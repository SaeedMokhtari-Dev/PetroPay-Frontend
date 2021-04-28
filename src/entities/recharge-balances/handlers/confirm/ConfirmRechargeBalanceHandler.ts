import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ConfirmRechargeBalanceRequest from "./ConfirmRechargeBalanceRequest";


export default class ConfirmRechargeBalanceHandler
{
    public static async confirm(request: ConfirmRechargeBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiRechargeBalanceConfirm, request, true);
        return response;
    }
}
