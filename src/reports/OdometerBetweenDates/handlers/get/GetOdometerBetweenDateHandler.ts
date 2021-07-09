import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetOdometerBetweenDateRequest from "./GetOdometerBetweenDateRequest";

export default class GetOdometerBetweenDateHandler
{
    public static async get(request: GetOdometerBetweenDateRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiOdometerBetweenDateGet, request, true);
        return response;
    }
}
