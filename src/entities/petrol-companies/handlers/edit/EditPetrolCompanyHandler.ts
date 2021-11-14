import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditPetrolCompanyRequest from "./EditPetrolCompanyRequest";


export default class EditPetrolCompanyHandler
{
    public static async edit(request: EditPetrolCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetrolCompanyEdit, request, true);
        return response;
    }
}
