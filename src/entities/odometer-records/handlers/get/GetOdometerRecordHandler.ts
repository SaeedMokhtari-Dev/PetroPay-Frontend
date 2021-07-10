import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetOdometerRecordRequest from "./GetOdometerRecordRequest";

export default class GetOdometerRecordHandler
{
    public static async get(request: GetOdometerRecordRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiOdometerRecordGet, request, true);
        return response;
    }
}
