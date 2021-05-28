import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import PaymentPetropayAccountRequest from "./PaymentPetropayAccountRequest";


export default class PaymentPetropayAccountHandler
{
    public static async payment(request: PaymentPetropayAccountRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetropayAccountPayment, request, true);
        return response;
    }
}
