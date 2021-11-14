import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddPetrolCompanyRequest from "./AddPetrolCompanyRequest";


export default class AddPetrolCompanyHandler
{
    public static async add(request: AddPetrolCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetrolCompanyAdd, request, true);
        return response;
    }
}
