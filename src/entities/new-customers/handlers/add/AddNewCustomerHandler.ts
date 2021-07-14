import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddNewCustomerRequest from "./AddNewCustomerRequest";


export default class AddNewCustomerHandler
{
    public static async add(request: AddNewCustomerRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiNewCustomerAdd, request, true);
        return response;
    }
}
