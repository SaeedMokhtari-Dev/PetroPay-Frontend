import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailStationUserRequest from "./DetailStationUserRequest";


export default class DetailStationUserHandler
{
    public static async detail(request: DetailStationUserRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationUserDetail, request, true);
        return response;
    }
}
