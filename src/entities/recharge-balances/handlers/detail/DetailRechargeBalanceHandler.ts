import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailRechargeBalanceRequest from "./DetailRechargeBalanceRequest";


export default class DetailRechargeBalanceHandler
{
    public static async detail(request: DetailRechargeBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiRechargeBalanceDetail, request, true);
        return response;
    }
}
