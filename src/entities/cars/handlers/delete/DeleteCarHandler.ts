import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteCarRequest from "./DeleteCarRequest";


export default class DeleteCarHandler
{
    public static async delete(request: DeleteCarRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarDelete, request, true);
        return response;
    }
}
