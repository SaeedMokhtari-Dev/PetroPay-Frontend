import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetAdminRequest from "./GetAdminRequest";

export default class GetAdminHandler
{
    public static async get(request: GetAdminRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiDashboardAdminGet, request, true);
        return response;
    }
}
