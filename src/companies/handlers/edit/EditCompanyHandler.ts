import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditCompanyRequest from "./EditCompanyRequest";


export default class EditCompanyHandler
{
    public static async edit(request: EditCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCompanyEdit, request, true);
        return response;
    }
}
