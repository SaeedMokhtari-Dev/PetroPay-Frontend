import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetOdometerHistoryRequest from "./GetOdometerHistoryRequest";

export default class GetOdometerHistoryHandler
{
    public static async get(request: GetOdometerHistoryRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiOdometerHistoryGet, request, true);
        return response;
    }
}
