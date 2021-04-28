import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteRechargeBalanceRequest from "./DeleteRechargeBalanceRequest";


export default class DeleteRechargeBalanceHandler
{
    public static async delete(request: DeleteRechargeBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiRechargeBalanceDelete, request, true);
        return response;
    }
}
