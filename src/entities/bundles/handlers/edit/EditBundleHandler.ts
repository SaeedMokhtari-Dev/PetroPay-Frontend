import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditBundleRequest from "./EditBundleRequest";


export default class EditBundleHandler
{
    public static async edit(request: EditBundleRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBundleEdit, request, true);
        return response;
    }
}
