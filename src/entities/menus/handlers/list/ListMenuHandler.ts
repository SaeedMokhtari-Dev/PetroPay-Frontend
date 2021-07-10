import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListMenuRequest from "./ListMenuRequest";

export default class ListMenuHandler
{
    public static async get(request: ListMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiMenuList, request, true);
        return response;
    }
}
