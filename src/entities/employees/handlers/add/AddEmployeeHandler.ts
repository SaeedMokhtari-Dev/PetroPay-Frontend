import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddEmployeeRequest from "./AddEmployeeRequest";


export default class AddEmployeeHandler
{
    public static async add(request: AddEmployeeRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiEmployeeAdd, request, true);
        return response;
    }
}
