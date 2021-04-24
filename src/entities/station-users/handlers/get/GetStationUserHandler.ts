import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetStationUserRequest from "./GetStationUserRequest";

export default class GetStationUserHandler
{
    public static async get(request: GetStationUserRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationUserGet, request, true);
        return response;
    }
}
