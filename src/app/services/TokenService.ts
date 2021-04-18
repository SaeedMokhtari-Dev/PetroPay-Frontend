import Constants from "app/constants/Constants";

export default class TokenService
{
    public static clearTokens()
    {
        localStorage.removeItem(Constants.accessTokenName);
        localStorage.removeItem(Constants.refreshTokenName);
    }

    public static getAccessToken()
    {
        return localStorage.getItem(Constants.accessTokenName);
    }

    public static getRefreshToken()
    {
        return localStorage.getItem(Constants.refreshTokenName);
    }

    static saveTokens(accessToken: string, refreshToken: string)
    {
        localStorage.setItem(Constants.accessTokenName, accessToken);
        localStorage.setItem(Constants.refreshTokenName, refreshToken);
    }
}