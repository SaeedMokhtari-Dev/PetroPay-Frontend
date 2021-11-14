import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeletePetrolCompanyRequest from "./DeletePetrolCompanyRequest";


export default class DeletePetrolCompanyHandler
{
    public static async delete(request: DeletePetrolCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetrolCompanyDelete, request, true);
        return response;
    }
}
