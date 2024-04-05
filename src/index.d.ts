declare module 'follow-redirects-fast' {
    interface FollowRedirectsOptions {
        url: string;
        maxRedirects?: number;
        timeout?: number;
    }

    interface RedirectResult {
        urlChain: string[];
        lastURL: string;
        redirectCount: number;
    }

    function followRedirects(options: FollowRedirectsOptions): Promise<RedirectResult>;

    export = followRedirects;
}