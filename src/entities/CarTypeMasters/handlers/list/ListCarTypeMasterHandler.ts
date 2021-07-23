import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListCarTypeMasterRequest from "./ListCarTypeMasterRequest";

export default class ListCarTypeMasterHandler
{
    public static async get(request: ListCarTypeMasterRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarTypeMasterList, request, true);
        return response;
    }
}
