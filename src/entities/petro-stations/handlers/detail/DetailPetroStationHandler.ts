import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailPetroStationRequest from "./DetailPetroStationRequest";


export default class DetailPetroStationHandler
{
    public static async detail(request: DetailPetroStationRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetroStationDetail, request, true);
        return response;
    }
}
