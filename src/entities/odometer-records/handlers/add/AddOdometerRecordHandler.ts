import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddOdometerRecordRequest from "./AddOdometerRecordRequest";


export default class AddOdometerRecordHandler
{
    public static async add(request: AddOdometerRecordRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiOdometerRecordAdd, request, true);
        return response;
    }
}
