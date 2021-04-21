import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailBranchRequest from "./DetailBranchRequest";


export default class DetailBranchHandler
{
    public static async detail(request: DetailBranchRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBranchDetail, request, true);
        return response;
    }
}
