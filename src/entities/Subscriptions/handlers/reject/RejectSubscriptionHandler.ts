import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import RejectSubscriptionRequest from "./RejectSubscriptionRequest";


export default class RejectSubscriptionHandler
{
    public static async reject(request: RejectSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionReject, request, true);
        return response;
    }
}
