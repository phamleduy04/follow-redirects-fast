const tls = require('tls');
const parser = require('http-string-parser');
const net = require('net');
const resolve = require('util').promisify(getRedirect);

const followRedirects = async ({ url, maxRedirects = 5 }) => {
    const urlChain = [];
    let redirectCount = 0;
    let timeRequested = 0;
    while (timeRequested < maxRedirects) {
        const res = await resolve(url);
        const location = res.headers[Object.keys(res.headers).find(key => key.toLowerCase() === 'location')];
        if (res.statusCode == 302 || res.statusCode == 301) {
            redirectCount++;
            url = location;
            urlChain.push(url);
        }
        else break;
        timeRequested++;
    }
    return { urlChain, lastURL: urlChain[urlChain.length - 1], redirectCount };

};

function getRedirect(url, callback) {
    const { host, protocol } = new URL(url);
    const raw_request = `GET ${url} HTTP/1.1\r\nUser-Agent: Mozilla 5.0\r\nHost: ${host}\r\nCookie: \r\ncontent-length: 0\r\n\n`;
    let socket;
    if (protocol.startsWith('https')) {
        socket = tls.connect({
            highWaterMark: 16384,
            servername: host,
            port: 443,
            host,
        }, () => socket.write(raw_request));
    }
    else {
        socket = net.connect({
            highWaterMark: 16384,
            servername: host,
            port: 80,
            host,
        }, () => socket.write(raw_request));
    }
    socket.on('data', (data) => {
        socket.destroy();
        const parsed = parser.parseResponse(data.toString());
        callback(null, parsed);
    });
}

module.exports = followRedirects;