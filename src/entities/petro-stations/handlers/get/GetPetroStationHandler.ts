import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetPetroStationRequest from "./GetPetroStationRequest";

export default class GetPetroStationHandler
{
    public static async get(request: GetPetroStationRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetroStationGet, request, true);
        return response;
    }
}
