import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListServiceMasterRequest from "./ListServiceMasterRequest";

export default class ListServiceMasterHandler
{
    public static async get(request: ListServiceMasterRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiServiceMasterList, request, true);
        return response;
    }
}
