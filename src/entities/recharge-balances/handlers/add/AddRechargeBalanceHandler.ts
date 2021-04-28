import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddRechargeBalanceRequest from "./AddRechargeBalanceRequest";


export default class AddRechargeBalanceHandler
{
    public static async add(request: AddRechargeBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiRechargeBalanceAdd, request, true);
        return response;
    }
}
