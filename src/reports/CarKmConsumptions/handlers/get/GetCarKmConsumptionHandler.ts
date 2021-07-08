import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCarKmConsumptionRequest from "./GetCarKmConsumptionRequest";

export default class GetCarKmConsumptionHandler
{
    public static async get(request: GetCarKmConsumptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarKmConsumptionGet, request, true);
        return response;
    }
}
