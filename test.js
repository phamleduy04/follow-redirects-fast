const followRedirects = require('./');

(async () => {
    const url = await followRedirects({ url: 'http://bit.ly/3K8720O', maxRedirects: 10 });
    console.log(url);
})();