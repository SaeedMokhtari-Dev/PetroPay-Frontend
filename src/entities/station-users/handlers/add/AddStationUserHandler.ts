import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddStationUserRequest from "./AddStationUserRequest";


export default class AddStationUserHandler
{
    public static async add(request: AddStationUserRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationUserAdd, request, true);
        return response;
    }
}
