import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCarConsumptionRateRequest from "./GetCarConsumptionRateRequest";

export default class GetCarConsumptionRateHandler
{
    public static async get(request: GetCarConsumptionRateRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarConsumptionRateGet, request, true);
        return response;
    }
}
