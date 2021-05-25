import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetAccountBalanceRequest from "./GetAccountBalanceRequest";

export default class GetAccountBalanceHandler
{
    public static async get(request: GetAccountBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiAccountBalanceGet, request, true);
        return response;
    }
}
