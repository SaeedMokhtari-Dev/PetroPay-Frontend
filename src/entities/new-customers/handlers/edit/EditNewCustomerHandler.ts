import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditNewCustomerRequest from "./EditNewCustomerRequest";


export default class EditNewCustomerHandler
{
    public static async edit(request: EditNewCustomerRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiNewCustomerEdit, request, true);
        return response;
    }
}
