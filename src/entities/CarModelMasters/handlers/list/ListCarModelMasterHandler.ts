import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListCarModelMasterRequest from "./ListCarModelMasterRequest";

export default class ListCarModelMasterHandler
{
    public static async get(request: ListCarModelMasterRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarModelMasterList, request, true);
        return response;
    }
}
