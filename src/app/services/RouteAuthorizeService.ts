import TokenService from "app/services/TokenService";
import JwtService from "app/services/JwtService";
import LoginHandler from "auth/login/handlers/login/LoginHandler";
import RefreshAccessTokenHandler from "auth/common/handlers/refresh-access/RefreshAccessTokenHandler";
import LogoutHandler from "auth/common/handlers/logout/LogoutHandler";
import AuthState from "app/constants/AuthState";
import UserContext from "identity/contexts/UserContext";

export default class RouteAuthorizeService
{
    public static async canActivate() : Promise<number>
    {
        let authState = await this.getAuthState();

        if(authState == AuthState.notLoggedIn)
        {
            await LogoutHandler.logout(false, false);
        }
        else if(authState == AuthState.loggedIn)
        {
            if(!UserContext.info)
            {
                authState = await UserContext.initialize();
            }
        }

        return authState;
    }

    public static async getAuthState(): Promise<number>
    {
        let accessToken = TokenService.getAccessToken();

        let authState = AuthState.notLoggedIn;

        if(accessToken != null)
        {
            let isTokenExpired = JwtService.isTokenExpired(accessToken);

            if(!isTokenExpired) return AuthState.loggedIn;

            authState = await this.isAuthenticated();

            if(authState != AuthState.notLoggedIn) return authState;

            authState = await RefreshAccessTokenHandler.refreshAuthenticationToken();

            if(authState != AuthState.notLoggedIn) return authState;
        }

        return authState;
    }

    private static async isAuthenticated(): Promise<number>
    {
        let response = await LoginHandler.isAuthenticated();

        if(!response || response.statusCode == -1)
        {
            return AuthState.unknown;
        }

        if(response.success)
        {
            return AuthState.loggedIn;
        }
        else
        {
            return AuthState.notLoggedIn;
        }
    }
}