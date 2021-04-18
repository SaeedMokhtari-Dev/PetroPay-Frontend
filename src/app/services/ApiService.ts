import Endpoints from "../constants/Endpoints";
import ApiResponse from "app/models/ApiResponse";
import TokenService from "app/services/TokenService";
import LogoutHandler from "auth/common/handlers/logout/LogoutHandler";
import RefreshAccessTokenHandler from "auth/common/handlers/refresh-access/RefreshAccessTokenHandler";
import LogoutRequest from "auth/common/handlers/logout/LogoutRequest";
import AuthState from "app/constants/AuthState";

export default class ApiService
{
    public static async get(endpoint: string, authorized: boolean = true) : Promise<ApiResponse>
    {
        let response = await this.getPrivate(endpoint, authorized);

        if(!response)
        {
            return this.apiCallFailedResponse();
        }

        if(response.ok)
        {
            return await response.json() as ApiResponse;
        }

        if(this.isAuthorizationError(response))
        {
            if(await this.refreshAuthorization())
            {
                return await this.get(endpoint);
            }
        }

        return this.apiCallFailedResponse(response.status);
    }

    public static async post(endpoint: string, body: any, authorized: boolean = true) : Promise<ApiResponse>
    {
        let response = await this.postPrivate(endpoint, body, authorized);

        if(!response)
        {
            return this.apiCallFailedResponse();
        }

        if(response.ok)
        {
            return await response.json() as ApiResponse;
        }

        if(this.isAuthorizationError(response))
        {
            if(await this.refreshAuthorization())
            {
                return await this.post(endpoint, body);
            }
        }

        return this.apiCallFailedResponse(response.status);
    }

    public static imageUrl(endpoint: string): string
    {
        if(endpoint.startsWith("blob")) return endpoint;

        let token = TokenService.getAccessToken();

        return `${process.env.REACT_APP_API_SERVER_ADDRESS}${endpoint}`.replace('{token}', token);
    }


    public static url(endpoint: string): string
    {
        return process.env.REACT_APP_API_SERVER_ADDRESS + endpoint;
    }

    private static headers(authorized: boolean)
    {
        let headers = {
            'API-VERSION': process.env.REACT_APP_API_VERSION
        };

        if(authorized)
        {
            headers['Authorization'] = `Bearer ${TokenService.getAccessToken()}`;
        }

        return headers;
    }

    private static jsonHeaders(authorized: boolean)
    {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if(authorized)
        {
            headers['Authorization'] = `Bearer ${TokenService.getAccessToken()}`;
        }

        return headers;
    }

    private static isAuthorizationError(response: Response) : boolean
    {
        return response && response instanceof Response && response.status === 401;
    }

    private static apiCallFailedResponse(statusCode = null) : ApiResponse
    {
        let message = statusCode ?
            `An error has occurred while processing the request (${statusCode})`:
            'An error has occurred while processing the request.';

        return ApiResponse.error(message, statusCode ?? -1);
    }

    private static async postPrivate(endpoint: string, body: any, authorized: boolean) : Promise<Response>
    {
        try
        {
            return await fetch(this.url(endpoint), {
                method:  'POST',
                headers: this.jsonHeaders(authorized),
                body: JSON.stringify(body)
            });
        }
        catch (ex)
        {
            return null;
        }
    }

    private static async getPrivate(endpoint: string, authorized: boolean) : Promise<Response>
    {
        try
        {
            return await fetch(this.url(endpoint), {
                method:  'GET',
                headers: this.headers(authorized)
            });
        }
        catch (ex)
        {
            return null;
        }
    }

    public static async postFormData(endpoint: string, data: FormData): Promise<ApiResponse>
    {
        let response = await this.postFormDataPrivate(endpoint, data);

        if(!response)
        {
            return this.apiCallFailedResponse();
        }

        if(response.ok)
        {
            return await response.json() as ApiResponse;
        }

        if(this.isAuthorizationError(response))
        {
            if(await this.refreshAuthorization())
            {
                return await this.postFormData(endpoint, data);
            }
        }

        return this.apiCallFailedResponse(response.status);
    }

    private static async postFormDataPrivate(endpoint: string, data: FormData) : Promise<Response>
    {
        try
        {
            return await fetch(this.url(endpoint), {
                method:  'POST',
                headers: this.headers(true),
                body: data
            });
        }
        catch (ex)
        {
            return null;
        }
    }

    private static async refreshAuthorization(): Promise<boolean>
    {
        let authState = await RefreshAccessTokenHandler.refreshAuthenticationToken();

        if(authState == AuthState.notLoggedIn)
        {
            await LogoutHandler.logout(true);
        }

        return authState == AuthState.loggedIn;
    }

    public static async logout(request: LogoutRequest)
    {
        await this.postPrivate(Endpoints.apiAuthLogout, request, true);
    }
}