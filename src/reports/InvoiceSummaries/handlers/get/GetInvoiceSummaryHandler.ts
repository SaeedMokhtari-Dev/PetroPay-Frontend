import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetInvoiceSummaryRequest from "./GetInvoiceSummaryRequest";

export default class GetInvoiceSummaryHandler
{
    public static async get(request: GetInvoiceSummaryRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiInvoiceSummaryGet, request, true);
        return response;
    }
}
