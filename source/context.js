/**
 * @typedef {Object} ScanningContext
 * @property {Object} networks Networks index
 * @property {Object} publishers Publishers index
 * @property {Object} sites Sites index
 * @property {String[]} pendingAdsTxt Array of ads.txt URLs to scan
 * @property {String[]} pendingSellersJSON Array of sellers.json URLs to scan
 */

function getInitialContext() {
    return {
        networks: {},
        publishers: {},
        sites: {},
        pendingAdsTxt: [],
        pendingSellersJSON: []
    };
}

function hasWorkLeft(context) {
    return context.pendingAdsTxt.length > 0 || context.pendingSellersJSON.length > 0;
}

module.exports = {
    getInitialContext,
    hasWorkLeft
};
