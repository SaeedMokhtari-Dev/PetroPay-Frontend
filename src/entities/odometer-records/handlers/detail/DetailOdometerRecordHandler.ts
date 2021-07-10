import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailOdometerRecordRequest from "./DetailOdometerRecordRequest";


export default class DetailOdometerRecordHandler
{
    public static async detail(request: DetailOdometerRecordRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiOdometerRecordDetail, request, true);
        return response;
    }
}
