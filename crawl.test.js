const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML } = require('./crawl.js')
const sameURL = ['https://blog.boot.dev/path', 'https://blog.boot.dev/path/', 'http://blog.boot.dev/path', 'http://blog.boot.dev/path/', 'blog.boot.dev/path'];

test('getURLsFromHTML empty', () => {
    expect(() => {
        getURLsFromHTML('','')
    }).toThrow('Invalid URL');
});

test('getURLsFromHTML basic', () => {
    const data = `
    <html>
        <body>
            <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        </body>
    </html>`
    const url = 'https://blog.boot.dev'
    expect(getURLsFromHTML(data, url)).toStrictEqual(['https://blog.boot.dev'])
});

test('getURLsFromHTML basic multiple', () => {
    const data = `
    <html>
        <body>
            <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
            <a href="/index.html"><span>Go to Boot.dev</span></a>
        </body>
    </html>`
    const url = 'https://blog.boot.dev'
    expect(getURLsFromHTML(data, url)).toStrictEqual(['https://blog.boot.dev', 'https://blog.boot.dev/index.html'])
});

test('getURLsFromHTML duplicate', () => {
    const data = `
    <html>
        <body>
            <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
            <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        </body>
    </html>`
    const url = 'https://blog.boot.dev'
    expect(getURLsFromHTML(data, url)).toStrictEqual(['https://blog.boot.dev'])
});

test(`normalizeURL sameURL test #-1`, () => {
    expect(normalizeURL(sameURL[0])).toBe('blog.boot.dev/path')
});

for (i in sameURL) {
    test(`normalizeURL sameURL test #${i}`, () => {
        expect(normalizeURL(sameURL[i])).toBe('blog.boot.dev/path')
    });
}

test('normalizeURL no path', () => {
    expect(normalizeURL('http://blog.boot.dev')).toBe('blog.boot.dev')
});

test('normalizeURL long subdomain chain', () => {
    expect(normalizeURL('http://cool.stuff.thing.here.blog.boot.dev')).toBe('cool.stuff.thing.here.blog.boot.dev')
});

const topLevelDomains = ['.com', '.org', '.app', '.codes', '.dev', '.net']
for (tld of topLevelDomains) {
    test('normalizeURL Top Level Domain', () => {
        expect(normalizeURL(`http://boot${tld}/`)).toBe(`boot${tld}`)
    });
}

test('normalizeURL empty string', () => {
    expect(() => {
        normalizeURL('')
    }).toThrow('Invalid URL');
});




