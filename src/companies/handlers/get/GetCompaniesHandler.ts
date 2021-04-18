import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCompaniesRequest from "./GetCompaniesRequest";

export default class GetCompaniesHandler
{
    public static async get(request: GetCompaniesRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCompanyGet, request, true);
        return response;
    }
}
