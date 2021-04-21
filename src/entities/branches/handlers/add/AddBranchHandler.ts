import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddBranchRequest from "./AddBranchRequest";


export default class AddBranchHandler
{
    public static async add(request: AddBranchRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBranchAdd, request, true);
        return response;
    }
}
