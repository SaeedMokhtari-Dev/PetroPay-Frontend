import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteMenuRequest from "./DeleteMenuRequest";


export default class DeleteMenuHandler
{
    public static async delete(request: DeleteMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiMenuDelete, request, true);
        return response;
    }
}
