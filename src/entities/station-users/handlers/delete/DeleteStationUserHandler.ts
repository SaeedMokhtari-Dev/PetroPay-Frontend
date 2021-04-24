import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteStationUserRequest from "./DeleteStationUserRequest";


export default class DeleteStationUserHandler
{
    public static async delete(request: DeleteStationUserRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationUserDelete, request, true);
        return response;
    }
}
