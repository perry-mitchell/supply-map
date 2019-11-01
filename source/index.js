#!/usr/bin/env node

const path = require("path");
const minimist = require("minimist");
const Listr = require("listr");
const { nextItem, processItem } = require("./worker.js");
const { getInitialContext, hasWorkLeft } = require("./context.js");
const { prepareEntriesForContext } = require("./supply.js");
const { getControllablePromise } = require("./tools.js");

const ERR_WORKERS_COUNT = 2;
const ERR_ENTRIES = 3;

// Init
const argv = minimist(process.argv.slice(2));
const {
    _: entries = [],
    workers: workersRaw = 4
} = argv;
const context = getInitialContext();
const workers = parseInt(workersRaw, 10);
const currentWork = [];
const initProm = getControllablePromise();
const initTask = {
    title: "Initialise",
    task: () => initProm
};
const taskMgr = new Listr([initTask], { concurrent: true });

// Validation
if (typeof workers !== "number" || isNaN(workers) || workers <= 0) {
    console.error(`Invalid workers count: ${workersRaw}`);
    process.exit(ERR_WORKERS_COUNT);
}
if (entries.length <= 0) {
    console.error("No entry points provided");
    process.exit(ERR_ENTRIES);
}

// Prep
prepareEntriesForContext(context, entries);

// Work
function checkWork() {
    const hasWork = hasWorkLeft(context);
    if (!hasWork && currentWork.length <= 0) {
        console.log("Out of work: done");
        process.exit(0);
    } else if (hasWork && currentWork.length < workers) {
        const nextTarget = nextItem(context);
        const task = () => {
            return processItem(nextTarget).then(() => {
                const ind = currentWork.indexOf(task);
                if (ind === -1) {
                    console.warn("Failed removing worker from collection: leak detected");
                } else {
                    currentWork.splice(ind, 1);
                }
            });
        };
        currentWork.push(task);
        taskMgr.add({
            title: nextTarget.title,
            task
        });
        checkWork();
    }
}
setTimeout(() => {
    initProm.resolve();
    checkWork();
    taskMgr.run();
}, 1000);
