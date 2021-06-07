import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListPetroStationRequest from "./ListPetroStationRequest";

export default class ListPetroStationHandler
{
    public static async get(request: ListPetroStationRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetroStationList, request, true);
        return response;
    }
}
