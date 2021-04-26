import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCarRequest from "./GetCarRequest";

export default class GetCarHandler
{
    public static async get(request: GetCarRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarGet, request, true);
        return response;
    }
}
