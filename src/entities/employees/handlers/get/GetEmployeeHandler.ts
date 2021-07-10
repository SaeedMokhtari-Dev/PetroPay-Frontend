import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetEmployeeRequest from "./GetEmployeeRequest";

export default class GetEmployeeHandler
{
    public static async get(request: GetEmployeeRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiEmployeeGet, request, true);
        return response;
    }
}
