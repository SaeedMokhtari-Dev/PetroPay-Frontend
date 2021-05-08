import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetInvoiceDetailRequest from "./GetInvoiceDetailRequest";

export default class GetInvoiceDetailHandler
{
    public static async get(request: GetInvoiceDetailRequest): Promise<ApiResponse>
    {
        debugger;
        let response = await ApiService.post(Endpoints.apiInvoiceDetailGet, request, true);
        return response;
    }
}
