import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DetailEmployeeMenuRequest from "./DetailEmployeeMenuRequest";


export default class DetailEmployeeMenuHandler
{
    public static async detail(request: DetailEmployeeMenuRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiEmployeeMenuDetail, request, true);
        return response;
    }
}
