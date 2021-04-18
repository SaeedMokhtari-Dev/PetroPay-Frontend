import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailCompanyRequest from "./DetailCompanyRequest";


export default class DetailCompanyHandler
{
    public static async detail(request: DetailCompanyRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCompanyDetail, request, true);
        return response;
    }
}
