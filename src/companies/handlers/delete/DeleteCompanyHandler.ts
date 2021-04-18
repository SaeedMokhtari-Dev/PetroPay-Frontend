import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteCompanyRequest from "./DeleteCompanyRequest";


export default class DeleteCompanyHandler
{
    public static async delete(request: DeleteCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCompanyDelete, request, true);
        return response;
    }
}
