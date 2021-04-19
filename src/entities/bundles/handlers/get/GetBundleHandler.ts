import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import GetBundleRequest from "./GetBundleRequest";

export default class GetBundleHandler
{
    public static async get(request: GetBundleRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBundleGet, request, true);
        return response;
    }
}
