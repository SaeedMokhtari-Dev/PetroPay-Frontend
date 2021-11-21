import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import CarBatchTransferBalanceRequest from "./CarBatchTransferBalanceRequest";


export default class CarBatchTransferBalanceHandler
{
    public static async carBatch(request: CarBatchTransferBalanceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiTransferBalanceCarBatch, request, true);
        return response;
    }
}
