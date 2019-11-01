function getControllablePromise() {
    let res, rej;
    const prom = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });
    prom.resolve = res;
    prom.reject = rej;
    return prom;
}

module.exports = {
    getControllablePromise
};
