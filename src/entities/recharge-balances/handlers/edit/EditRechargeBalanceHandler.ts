import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditRechargeBalanceRequest from "./EditRechargeBalanceRequest";


export default class EditRechargeBalanceHandler
{
    public static async edit(request: EditRechargeBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiRechargeBalanceEdit, request, true);
        return response;
    }
}
