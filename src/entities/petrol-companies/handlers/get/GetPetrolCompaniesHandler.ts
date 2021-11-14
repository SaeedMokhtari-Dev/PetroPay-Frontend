import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetPetrolCompaniesRequest from "./GetPetrolCompaniesRequest";

export default class GetPetrolCompaniesHandler
{
    public static async get(request: GetPetrolCompaniesRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetrolCompanyGet, request, true);
        return response;
    }
}
