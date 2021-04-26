import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditCarRequest from "./EditCarRequest";


export default class EditCarHandler
{
    public static async edit(request: EditCarRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarEdit, request, true);
        return response;
    }
}
