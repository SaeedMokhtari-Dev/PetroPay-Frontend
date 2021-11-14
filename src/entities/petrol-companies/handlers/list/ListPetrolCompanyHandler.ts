import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListPetrolCompanyRequest from "./ListPetrolCompanyRequest";

export default class ListPetrolCompanyHandler
{
    public static async get(request: ListPetrolCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetrolCompanyList, request, true);
        return response;
    }
}
