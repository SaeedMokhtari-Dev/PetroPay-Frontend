import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteEmployeeRequest from "./DeleteEmployeeRequest";


export default class DeleteEmployeeHandler
{
    public static async delete(request: DeleteEmployeeRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiEmployeeDelete, request, true);
        return response;
    }
}
