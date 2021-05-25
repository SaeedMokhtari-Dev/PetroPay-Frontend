import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ListBranchRequest from "./ListBranchRequest";

export default class ListBranchHandler
{
    public static async get(request: ListBranchRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBranchList, request, true);
        return response;
    }
}
