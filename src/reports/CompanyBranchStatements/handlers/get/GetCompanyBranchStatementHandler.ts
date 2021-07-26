import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetCompanyBranchStatementRequest from "./GetCompanyBranchStatementRequest";

export default class GetCompanyBranchStatementHandler
{
    public static async get(request: GetCompanyBranchStatementRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCompanyBranchStatementGet, request, true);
        return response;
    }
}
