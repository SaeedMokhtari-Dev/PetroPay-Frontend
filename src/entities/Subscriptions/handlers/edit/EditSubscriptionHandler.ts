import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditSubscriptionRequest from "./EditSubscriptionRequest";


export default class EditSubscriptionHandler
{
    public static async edit(request: EditSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionEdit, request, true);
        return response;
    }
}
