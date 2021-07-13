import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import InvoiceSubscriptionRequest from "./InvoiceSubscriptionRequest";


export default class InvoiceSubscriptionHandler
{
    public static async detail(request: InvoiceSubscriptionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiSubscriptionInvoice, request, true);
        return response;
    }
}
