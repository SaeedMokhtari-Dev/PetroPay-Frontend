import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddMenuRequest from "./AddMenuRequest";


export default class AddMenuHandler
{
    public static async add(request: AddMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiMenuAdd, request, true);
        return response;
    }
}
