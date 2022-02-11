const tls = require('tls');
const parser = require('http-string-parser');
const net = require('net');
const resolve = require('util').promisify(getRedirect);
const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const followRedirects = async ({ url, maxRedirects = 5, timeout = 5000 }) => {
    try {
        if (!url || !urlRegex.test(url)) throw ("Not a valid URL");
        const urlChain = [];
        let redirectCount = 0;
        let timeRequested = 0;
        while (timeRequested < maxRedirects) {
            const res = await resolve(url, timeout);
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
    }
    catch (err) {
        throw new Error(err);
    }

};

function getRedirect(url, timeout, callback) {
    const { host, protocol } = new URL(url);
    const raw_request = `GET ${url} HTTP/1.1\r\nUser-Agent: Mozilla 5.0\r\nHost: ${host}\r\nCookie: \r\nContent-length: 0\r\n\n`;
    let socket;
    if (protocol.startsWith('https')) {
        socket = tls.connect({
            highWaterMark: 16384,
            servername: host,
            port: 443,
            host,
            timeout,
        }, () => socket.write(raw_request));
    } else {
        socket = net.connect({
            highWaterMark: 16384,
            servername: host,
            port: 80,
            host,
            timeout,
        }, () => socket.write(raw_request));
    }
    socket.on('data', (data) => {
        socket.destroy();
        const parsed = parser.parseResponse(data.toString());
        callback(null, parsed);
    });
}

module.exports = followRedirects;