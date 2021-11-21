import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListPetrolPriceRequest from "./ListPetrolPriceRequest";

export default class ListPetrolPriceHandler
{
    public static async get(request: ListPetrolPriceRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiPetrolPriceList, request, true);
        return response;
    }
}
