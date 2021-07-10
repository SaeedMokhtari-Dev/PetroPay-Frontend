import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteOdometerRecordRequest from "./DeleteOdometerRecordRequest";


export default class DeleteOdometerRecordHandler
{
    public static async delete(request: DeleteOdometerRecordRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiOdometerRecordDelete, request, true);
        return response;
    }
}
