import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetTransferBonusesRequest from "./GetTransferBonusesRequest";

export default class GetTransferBonusesHandler
{
    public static async get(request: GetTransferBonusesRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiTransferBonusGet, request, true);
        return response;
    }
}
