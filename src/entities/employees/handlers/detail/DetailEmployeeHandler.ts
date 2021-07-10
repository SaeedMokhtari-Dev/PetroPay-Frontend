import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailEmployeeRequest from "./DetailEmployeeRequest";


export default class DetailEmployeeHandler
{
    public static async detail(request: DetailEmployeeRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiEmployeeDetail, request, true);
        return response;
    }
}
