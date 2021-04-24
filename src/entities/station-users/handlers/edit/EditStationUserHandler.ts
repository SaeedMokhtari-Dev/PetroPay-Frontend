import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditStationUserRequest from "./EditStationUserRequest";


export default class EditStationUserHandler
{
    public static async edit(request: EditStationUserRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationUserEdit, request, true);
        return response;
    }
}
