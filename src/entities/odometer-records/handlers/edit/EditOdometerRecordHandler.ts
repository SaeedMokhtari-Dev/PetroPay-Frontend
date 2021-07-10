import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditOdometerRecordRequest from "./EditOdometerRecordRequest";


export default class EditOdometerRecordHandler
{
    public static async edit(request: EditOdometerRecordRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiOdometerRecordEdit, request, true);
        return response;
    }
}
