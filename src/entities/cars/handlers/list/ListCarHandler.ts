import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListCarRequest from "./ListCarRequest";

export default class ListCarHandler
{
    public static async get(request: ListCarRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarList, request, true);
        return response;
    }
}
