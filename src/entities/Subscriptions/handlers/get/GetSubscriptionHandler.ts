import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetSubscriptionRequest from "./GetSubscriptionRequest";

export default class GetSubscriptionHandler
{
    public static async get(request: GetSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionGet, request, true);
        return response;
    }
}
