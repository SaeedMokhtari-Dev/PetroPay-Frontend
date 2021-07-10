import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditMenuRequest from "./EditMenuRequest";


export default class EditMenuHandler
{
    public static async edit(request: EditMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiMenuEdit, request, true);
        return response;
    }
}
