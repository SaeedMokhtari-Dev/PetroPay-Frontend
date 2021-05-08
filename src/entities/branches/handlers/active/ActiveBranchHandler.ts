import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ActiveBranchRequest from "./ActiveBranchRequest";


export default class ActiveBranchHandler
{
    public static async active(request: ActiveBranchRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBranchActive, request, true);
        return response;
    }
}
