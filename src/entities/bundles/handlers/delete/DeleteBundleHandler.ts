import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteBundleRequest from "./DeleteBundleRequest";


export default class DeleteBundleHandler
{
    public static async delete(request: DeleteBundleRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBundleDelete, request, true);
        return response;
    }
}
