import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetRechargeBalanceRequest from "./GetRechargeBalanceRequest";

export default class GetRechargeBalanceHandler
{
    public static async get(request: GetRechargeBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiRechargeBalanceGet, request, true);
        return response;
    }
}
