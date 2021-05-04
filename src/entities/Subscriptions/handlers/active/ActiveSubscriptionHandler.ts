import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ActiveSubscriptionRequest from "./ActiveSubscriptionRequest";


export default class ActiveSubscriptionHandler
{
    public static async active(request: ActiveSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionActive, request, true);
        return response;
    }
}
