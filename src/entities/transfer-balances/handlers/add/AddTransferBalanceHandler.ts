import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddTransferBalanceRequest from "./AddTransferBalanceRequest";


export default class AddTransferBalanceHandler
{
    public static async add(request: AddTransferBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiTransferBalance, request, true);
        return response;
    }
}
