import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditPetroStationRequest from "./EditPetroStationRequest";


export default class EditPetroStationHandler
{
    public static async edit(request: EditPetroStationRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetroStationEdit, request, true);
        return response;
    }
}
