import LoginRequest from "auth/login/handlers/login/LoginRequest";
import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import LoginResponse from "auth/login/handlers/login/LoginResponse";
import {isNullOrEmpty} from "app/utils/String";
import TokenService from "app/services/TokenService";
import {action} from "app/utils/Action";

export default class LoginHandler
{
    public static async authenticate(request: LoginRequest): Promise<ApiResponse>
    {
        let response = await action<ApiResponse>(async () => await ApiService.post(Endpoints.apiAuthLogin, request, false), 1500);

        if(response && response.success)
        {
            let data = new LoginResponse().deserialize(response.data);

            this.onAuthenticated(data.accessToken, data.refreshToken);
        }

        return response;
    }

    static onAuthenticated(accessToken: string, refreshToken: string)
    {
        if(isNullOrEmpty(accessToken)) throw new Error("The access token must not be null.");
        if(isNullOrEmpty(refreshToken)) throw new Error("The refresh token must not be null.");

        TokenService.saveTokens(accessToken, refreshToken);
    }

    public static async isAuthenticated() : Promise<ApiResponse>
    {
        try
        {
            return await ApiService.get(Endpoints.apiAuthCheck);
        }
        catch (ex)
        {
            return null;
        }
    }
}