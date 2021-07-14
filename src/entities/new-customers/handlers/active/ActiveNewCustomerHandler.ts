import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ActiveNewCustomerRequest from "./ActiveNewCustomerRequest";


export default class ActiveNewCustomerHandler
{
    public static async active(request: ActiveNewCustomerRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiNewCustomerActive, request, true);
        return response;
    }
}
