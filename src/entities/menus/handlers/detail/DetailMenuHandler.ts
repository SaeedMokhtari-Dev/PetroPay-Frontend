import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailMenuRequest from "./DetailMenuRequest";


export default class DetailMenuHandler
{
    public static async detail(request: DetailMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiMenuDetail, request, true);
        return response;
    }
}
