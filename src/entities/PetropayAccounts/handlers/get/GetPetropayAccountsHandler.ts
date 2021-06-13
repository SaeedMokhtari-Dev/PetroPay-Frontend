import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetPetropayAccountsRequest from "./GetPetropayAccountsRequest";

export default class GetPetropayAccountsHandler
{
    public static async get(request: GetPetropayAccountsRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetropayAccountGet, request, true);
        return response;
    }
}
