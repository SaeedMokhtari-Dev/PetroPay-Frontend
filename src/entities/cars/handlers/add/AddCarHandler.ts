import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddCarRequest from "./AddCarRequest";


export default class AddCarHandler
{
    public static async add(request: AddCarRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarAdd, request, true);
        return response;
    }
}
