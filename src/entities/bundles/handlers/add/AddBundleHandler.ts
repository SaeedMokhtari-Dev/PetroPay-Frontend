import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddBundleRequest from "./AddBundleRequest";


export default class AddBundleHandler
{
    public static async add(request: AddBundleRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBundleAdd, request, true);
        return response;
    }
}
