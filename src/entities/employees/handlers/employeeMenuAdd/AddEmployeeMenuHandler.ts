import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddEmployeeMenuRequest from "./AddEmployeeMenuRequest";


export default class AddEmployeeMenuHandler
{
    public static async add(request: AddEmployeeMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiEmployeeMenuAdd, request, true);
        return response;
    }
}
