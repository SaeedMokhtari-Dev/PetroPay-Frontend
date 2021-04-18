import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ApiResponse from "app/models/ApiResponse";
import GetUserInfoRequest from "identity/handlers/user-info/GetUserInfoRequest";

export default class GetUserInfoHandler
{
    public static async get(): Promise<ApiResponse>
    {
        return await ApiService.post(Endpoints.apiUserInfo, new GetUserInfoRequest());
    }
}