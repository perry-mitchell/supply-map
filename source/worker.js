const fetch = require("node-fetch");

function nextItem(context, remove = true) {
    if (context.pendingSellersJSON.length > 0) {
        const url = remove
            ? context.pendingSellersJSON.splice(0, 1)[0]
            : context.pendingSellersJSON[0];
        return {
            type: "sellers.json",
            url,
            title: `Process sellers.json: ${url}`
        };
    } else if (context.pendingAdsTxt.length > 0) {
        const url = remove
            ? context.pendingAdsTxt.splice(0, 1)[0]
            : context.pendingAdsTxt[0];
        return {
            type: "ads.txt",
            url,
            title: `Process ads.txt: ${url}`
        };
    }
    return null;
}

function processItem(item) {
    return new Promise(() => {});
}

module.exports = {
    nextItem,
    processItem
};
