const { JSDOM } = require('jsdom')
const { error } = require('node:console')

function normalizeURL(url) {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (urlObj.pathname !== '/') {
        return `${urlObj.host}${urlObj.pathname}`
    }
    return urlObj.host
}

function getURLsFromHTML(html, baseURL) {
    const absoluteURLs = []
    const url = new URL(baseURL);
    const dom = new JSDOM(html);
    const aTags = dom.window.document.querySelectorAll('a');
    for (const aTag of aTags) {
        let attr = aTag.getAttribute('href');
        if (attr.length < 2) {
            continue
        }

        if (! absoluteURLs.includes(attr) && ! absoluteURLs.includes(`${url.href}${attr}`)) {
            if (attr[0] !== '/') {
                absoluteURLs.push(attr)
            } else if (normalizeURL(attr) !== normalizeURL(url.href)) {
                if (attr[0] === '/') {
                    attr = attr.slice(1)
                }
                absoluteURLs.push(`${url.href}${attr}`)
            } else {
                absoluteURLs.push(attr)
            }
        }
    }
    return absoluteURLs

}

async function crawlPage(baseURL, currentURL, pages) {
    let newPages = pages;
    const url = new URL(currentURL)
    const baseURLobj = new URL(baseURL)

    if (url.host !== baseURLobj.host) {
        return newPages
    }
    const normalURL = normalizeURL(currentURL)

    if (newPages.hasOwnProperty(normalURL)) {
        newPages[normalURL] += 1;
        return newPages;
    }
    if (baseURL !== currentURL) {
        newPages[normalURL] = 1;
    } else {
        newPages[normalURL] = 0;
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'content-type': 'text/html'
            }
        });

        if (response.status > 400) {
            throw error(`Failure in retreiving page recieved status code: ${response.status}`);
        }

        if (response.headers.get('content-type').split(';')[0] !== 'text/html') {
            throw error(`Response is not in text/html format`)
        }
        const urls = getURLsFromHTML(await response.text(), baseURL);
        for (const url of urls) {
            const crawlPages = await crawlPage(baseURL, url, newPages);
            newPages = aggregateCount(newPages, crawlPages);

        }

    } catch(err) {
        console.log(err)
        return {}
    }
    return newPages

}

function aggregateCount(prev, next) {
    let ret = prev
    for (const key of Object.keys(next)) {
        if (prev.hasOwnProperty(key)) {
            ret[key] += 1;
        }
    }
    return ret
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
