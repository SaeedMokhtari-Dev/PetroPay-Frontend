import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditEmployeeRequest from "./EditEmployeeRequest";


export default class EditEmployeeHandler
{
    public static async edit(request: EditEmployeeRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiEmployeeEdit, request, true);
        return response;
    }
}
