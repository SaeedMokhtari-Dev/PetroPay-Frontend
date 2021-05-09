import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetStationSaleRequest from "./GetStationSaleRequest";

export default class GetStationSaleHandler
{
    public static async get(request: GetStationSaleRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiStationSaleGet, request, true);
        return response;

    }
}
