import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetStationReportRequest from "./GetStationReportRequest";

export default class GetStationReportHandler
{
    public static async get(request: GetStationReportRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationReportGet, request, true);
        return response;

    }
}
