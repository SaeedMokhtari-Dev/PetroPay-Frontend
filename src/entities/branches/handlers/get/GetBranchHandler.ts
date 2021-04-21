import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetBranchRequest from "./GetBranchRequest";

export default class GetBranchHandler
{
    public static async get(request: GetBranchRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBranchGet, request, true);
        return response;
    }
}
