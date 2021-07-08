import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCarOdometerMinRequest from "./GetCarOdometerMinRequest";

export default class GetCarOdometerMinHandler
{
    public static async get(request: GetCarOdometerMinRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarOdometerMinGet, request, true);
        return response;
    }
}
