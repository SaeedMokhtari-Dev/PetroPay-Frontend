import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCarBalanceRequest from "./GetCarBalanceRequest";

export default class GetCarBalanceHandler
{
    public static async get(request: GetCarBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarBalanceGet, request, true);
        return response;
    }
}
