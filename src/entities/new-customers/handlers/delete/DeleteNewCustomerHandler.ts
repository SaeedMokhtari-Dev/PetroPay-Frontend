import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteNewCustomerRequest from "./DeleteNewCustomerRequest";


export default class DeleteNewCustomerHandler
{
    public static async delete(request: DeleteNewCustomerRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiNewCustomerDelete, request, true);
        return response;
    }
}
