import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import PaymentPetroStationRequest from "./PaymentPetroStationRequest";


export default class PaymentPetroStationHandler
{
    public static async payment(request: PaymentPetroStationRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetroStationPayment, request, true);
        return response;
    }
}
