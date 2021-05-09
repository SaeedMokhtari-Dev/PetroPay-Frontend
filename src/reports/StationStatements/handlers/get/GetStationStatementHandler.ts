import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetStationStatementRequest from "./GetStationStatementRequest";

export default class GetStationStatementHandler
{
    public static async get(request: GetStationStatementRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationStatementGet, request, true);
        return response;

    }
}
