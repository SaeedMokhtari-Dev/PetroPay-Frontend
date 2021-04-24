import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddPetroStationRequest from "./AddPetroStationRequest";


export default class AddPetroStationHandler
{
    public static async add(request: AddPetroStationRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetroStationAdd, request, true);
        return response;
    }
}
