import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import CalculateSubscriptionRequest from "./CalculateSubscriptionRequest";


export default class CalculateSubscriptionHandler
{
    public static async calculate(request: CalculateSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionCalculate, request, true);
        return response;
    }
}
