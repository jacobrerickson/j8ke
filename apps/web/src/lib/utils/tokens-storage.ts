export class TokensStorage {
    private static ACCESS_TOKEN_KEY = 'access_token';
    private static REFRESH_TOKEN_KEY = 'refresh_token';

    static setTokens(accessToken: string, refreshToken: string) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    static getTokens() {
        if (typeof window === 'undefined') return null;

        const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

        if (!accessToken || !refreshToken) return null;

        return {
            accessToken,
            refreshToken
        };
    }

    static clearTokens() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
} 