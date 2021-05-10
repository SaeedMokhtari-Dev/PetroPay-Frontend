import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCarTransactionRequest from "./GetCarTransactionRequest";

export default class GetCarTransactionHandler
{
    public static async get(request: GetCarTransactionRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarTransactionGet, request, true);
        return response;
    }
}
