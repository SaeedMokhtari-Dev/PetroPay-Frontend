import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListCompanyRequest from "./ListCompanyRequest";

export default class ListCompanyHandler
{
    public static async get(request: ListCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCompanyList, request, true);
        return response;
    }
}
