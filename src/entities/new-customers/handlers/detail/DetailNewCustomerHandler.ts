import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailNewCustomerRequest from "./DetailNewCustomerRequest";


export default class DetailNewCustomerHandler
{
    public static async detail(request: DetailNewCustomerRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiNewCustomerDetail, request, true);
        return response;
    }
}
