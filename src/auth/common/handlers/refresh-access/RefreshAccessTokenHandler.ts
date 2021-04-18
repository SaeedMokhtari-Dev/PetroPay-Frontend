import TokenService from "app/services/TokenService";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import {RefreshAccessTokenRequest} from "auth/common/handlers/refresh-access/RefreshAccessTokenRequest";
import ApiResponse from "app/models/ApiResponse";
import AuthState from "app/constants/AuthState";

export default class RefreshAccessTokenHandler
{
    public static async refreshAuthenticationToken() : Promise<number>
    {
        let request = new RefreshAccessTokenRequest(TokenService.getAccessToken(), TokenService.getRefreshToken());

        let response = await ApiService.post(Endpoints.apiAuthRefreshAccessToken, request, false);

        if(!response || response.statusCode == -1)
        {
            return AuthState.unknown;
        }

        if(response.success)
        {
            let data = response.data;

            if(data && !data.isLoginRequired && data.accessToken && data.refreshToken)
            {
                TokenService.saveTokens(data.accessToken, data.refreshToken);
                return AuthState.loggedIn;
            }
        }

        return AuthState.notLoggedIn;
    }
}