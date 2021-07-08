import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCarOdometerMaxRequest from "./GetCarOdometerMaxRequest";

export default class GetCarOdometerMaxHandler
{
    public static async get(request: GetCarOdometerMaxRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarOdometerMaxGet, request, true);
        return response;
    }
}
