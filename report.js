
function printReport(pages) {
    console.log('Webcrawling report is starting')
    const sortable = Object.fromEntries(
        Object.entries(pages).sort(([,a],[,b]) => b - a)
    );

    for (const [key, value] of Object.entries(sortable)) {
        console.log(`Found ${value} internal links to ${key}`)
    }
}


module.exports = {
    printReport
}
