import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailAppSettingRequest from "./DetailAppSettingRequest";


export default class DetailAppSettingHandler
{
    public static async detail(request: DetailAppSettingRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiAppSettingDetail, request, true);
        return response;
    }
}
