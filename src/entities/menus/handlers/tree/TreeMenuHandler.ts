import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import TreeMenuRequest from "./TreeMenuRequest";

export default class TreeMenuHandler
{
    public static async get(request: TreeMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiMenuTree, request, true);
        return response;
    }
}
