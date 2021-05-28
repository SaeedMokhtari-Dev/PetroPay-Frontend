import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCustomerRequest from "./GetCustomerRequest";

export default class GetCustomerHandler
{
    public static async get(request: GetCustomerRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiDashboardCustomerGet, request, true);
        return response;
    }
}
