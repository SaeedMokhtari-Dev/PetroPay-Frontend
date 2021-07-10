import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetMenuRequest from "./GetMenuRequest";

export default class GetMenuHandler
{
    public static async get(request: GetMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiMenuGet, request, true);
        return response;
    }
}
