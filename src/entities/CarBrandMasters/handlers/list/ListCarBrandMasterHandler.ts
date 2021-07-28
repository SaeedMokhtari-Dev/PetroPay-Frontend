import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListCarBrandMasterRequest from "./ListCarBrandMasterRequest";

export default class ListCarBrandMasterHandler
{
    public static async get(request: ListCarBrandMasterRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarBrandMasterList, request, true);
        return response;
    }
}
