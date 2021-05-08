import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import CarAddSubscriptionRequest from "./CarAddSubscriptionRequest";


export default class CarAddSubscriptionHandler
{
    public static async carAdd(request: CarAddSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionCarAdd, request, true);
        return response;
    }
}
