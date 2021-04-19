import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddCompanyRequest from "./AddCompanyRequest";


export default class AddCompanyHandler
{
    public static async add(request: AddCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCompanyAdd, request, true);
        return response;
    }
}
