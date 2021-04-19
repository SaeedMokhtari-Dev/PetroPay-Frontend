import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailBundleRequest from "./DetailBundleRequest";


export default class DetailBundleHandler
{
    public static async detail(request: DetailBundleRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiBundleDetail, request, true);
        return response;
    }
}
