import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditBranchRequest from "./EditBranchRequest";


export default class EditBranchHandler
{
    public static async edit(request: EditBranchRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBranchEdit, request, true);
        return response;
    }
}
