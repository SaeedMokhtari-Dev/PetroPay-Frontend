import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailSubscriptionRequest from "./DetailSubscriptionRequest";


export default class DetailSubscriptionHandler
{
    public static async detail(request: DetailSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionDetail, request, true);
        return response;
    }
}
