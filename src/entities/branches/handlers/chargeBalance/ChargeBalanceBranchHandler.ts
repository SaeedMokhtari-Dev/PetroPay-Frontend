import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ChargeBalanceBranchRequest from "./ChargeBalanceBranchRequest";


export default class ChargeBalanceBranchHandler
{
    public static async chargeBalance(request: ChargeBalanceBranchRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBranchChargeBalance, request, true);
        return response;
    }
}
