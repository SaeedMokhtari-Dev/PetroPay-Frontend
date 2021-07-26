import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCustomerStatementRequest from "./GetCustomerStatementRequest";

export default class GetCustomerStatementHandler
{
    public static async get(request: GetCustomerStatementRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCustomerStatementGet, request, true);
        return response;
    }
}
