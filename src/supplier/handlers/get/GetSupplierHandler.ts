import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetSupplierRequest from "./GetSupplierRequest";

export default class GetSupplierHandler
{
    public static async get(request: GetSupplierRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiDashboardSupplierGet, request, true);
        return response;
    }
}
