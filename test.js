const followRedirects = require('./');

(async () => {
    const redirects = await followRedirects({ url: 'http://bit.ly/3K8720O', maxRedirects: 10 });
    console.log(redirects);
})();