import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListStationUserRequest from "./ListStationUserRequest";

export default class ListStationUserHandler
{
    public static async get(request: ListStationUserRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationUserList, request, true);
        return response;
    }
}
