import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteSubscriptionRequest from "./DeleteSubscriptionRequest";


export default class DeleteSubscriptionHandler
{
    public static async delete(request: DeleteSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionDelete, request, true);
        return response;
    }
}
