import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddTransferBonusRequest from "./AddTransferBonusRequest";


export default class AddTransferBonusHandler
{
    public static async add(request: AddTransferBonusRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiTransferBonusAdd, request, true);
        return response;
    }
}
