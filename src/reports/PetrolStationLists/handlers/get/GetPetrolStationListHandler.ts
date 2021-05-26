import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetPetrolStationListRequest from "./GetPetrolStationListRequest";

export default class GetPetrolStationListHandler
{
    public static async get(request: GetPetrolStationListRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetrolStationListGet, request, true);
        return response;

    }
}
