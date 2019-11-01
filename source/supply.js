const ADS_TXT_URL = /\/ads\.txt$/;
const DOMAIN_EXP = /^[a-z0-9\.-]+$/i;
const SELLERS_JSON_URL = /\/sellers\.json$/;

function convertURLForAdsTxt(url) {
    const { domain, protocol } = getDomainSpec(url);
    return `${protocol}://${domain}/ads.txt`;
}

function convertURLForSellersJSON(url) {
    const { domain, protocol } = getDomainSpec(url);
    return `${protocol}://${domain}/sellers.json`;
}

function getDomainSpec(url) {
    if (DOMAIN_EXP.test(url)) {
        return {
            domain: url.toLowerCase(),
            protocol: "https"
        };
    }
    const match = /^(https?):\/\/([^\/]+)/i.exec(url.toLowerCase());
    if (!match) {
        throw new Error(`Failed processing domain specifications for URL: ${url}`);
    }
    const [, protocol, domain] = match;
    return { domain, protocol };
}

function getURLType(url) {
    if (ADS_TXT_URL.test(url)) {
        return "ads.txt";
    } else if (SELLERS_JSON_URL.test(url)) {
        return "sellers.json";
    }
    return "";
}

function prepareEntriesForContext(context, entries) {
    entries.forEach(entry => {
        const urlType = getURLType(entry);
        if (urlType === "ads.txt") {
            context.pendingAdsTxt.push(entry);
        } else if (urlType === "sellers.json") {
            context.pendingSellersJSON.push(entry);
        } else {
            context.pendingAdsTxt.push(convertURLForAdsTxt(entry));
            context.pendingSellersJSON.push(convertURLForSellersJSON(entry));
        }
    });
}

module.exports = {
    prepareEntriesForContext
};
