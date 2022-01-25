## Follow Redirect Fast

Follow redirect using barebone packages (tls and net) from NodeJS.

Supports Promise return

[![npm version](https://img.shields.io/npm/v/follow-redirects-fast.svg)](https://www.npmjs.com/package/follow-redirects-fast)
[![Node.js CI](https://github.com/phamleduy04/follow-redirects-fast/actions/workflows/nodejs.yml/badge.svg)](https://github.com/phamleduy04/follow-redirects-fast/actions/workflows/nodejs.yml)

Example:
```js
const followRedirects = require('follow-redirects-fast');

(async () => {
    const url = await followRedirects({ url: 'http://bit.ly/3K8720O', maxRedirects: 10, timeout: 5000 });
    console.log(url);
})();
```


