import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteBranchRequest from "./DeleteBranchRequest";


export default class DeleteBranchHandler
{
    public static async delete(request: DeleteBranchRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBranchDelete, request, true);
        return response;
    }
}
