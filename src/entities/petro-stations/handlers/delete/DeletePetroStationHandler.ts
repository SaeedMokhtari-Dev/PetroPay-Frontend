import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeletePetroStationRequest from "./DeletePetroStationRequest";


export default class DeletePetroStationHandler
{
    public static async delete(request: DeletePetroStationRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetroStationDelete, request, true);
        return response;
    }
}
