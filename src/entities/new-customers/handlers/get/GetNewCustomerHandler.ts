import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetNewCustomerRequest from "./GetNewCustomerRequest";

export default class GetNewCustomerHandler
{
    public static async get(request: GetNewCustomerRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiNewCustomerGet, request, true);
        return response;
    }
}
