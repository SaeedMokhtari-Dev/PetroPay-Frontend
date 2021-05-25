import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListPetropayAccountRequest from "./ListPetropayAccountRequest";

export default class ListPetropayAccountHandler
{
    public static async get(request: ListPetropayAccountRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetropayAccountList, request, true);
        return response;
    }
}
