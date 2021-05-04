import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddSubscriptionRequest from "./AddSubscriptionRequest";


export default class AddSubscriptionHandler
{
    public static async add(request: AddSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionAdd, request, true);
        return response;
    }
}
