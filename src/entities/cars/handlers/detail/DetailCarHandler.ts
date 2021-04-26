import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailCarRequest from "./DetailCarRequest";


export default class DetailCarHandler
{
    public static async detail(request: DetailCarRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarDetail, request, true);
        return response;
    }
}
