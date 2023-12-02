const { error } = require('node:console');
const { argv } = require('node:process');
const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');

function main() {
    if (argv.length < 3) {
        throw error('url required to crawl Ex: npm run start google.com')
    }
    if (argv.length > 3) {
        throw error('unknown number of arguements, only one arguement required')
    }
    baseURL = argv[2]
    console.log(`Starting webcrawling at: ${baseURL}`)
    const promise =  crawlPage(baseURL, baseURL, {})
    promise.then((pages) => {
        printReport(pages)
    });
}

main()
