import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import TreeEmployeeMenuRequest from "./TreeEmployeeMenuRequest";

export default class TreeEmployeeMenuHandler
{
    public static async get(request: TreeEmployeeMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiEmployeeMenuTree, request, true);
        return response;
    }
}
