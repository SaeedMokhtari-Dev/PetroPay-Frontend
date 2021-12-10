import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCurrentUserBalanceRequest from "./GetCurrentUserBalanceRequest";

export default class GetCurrentUserBalanceHandler
{
    public static async get(request: GetCurrentUserBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCurrentUserBalanceGet, request, true);
        return response;
    }
}
