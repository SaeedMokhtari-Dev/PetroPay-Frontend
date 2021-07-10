import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import DeleteAppSettingRequest from "./DeleteAppSettingRequest";


export default class DeleteAppSettingHandler
{
    public static async delete(request: DeleteAppSettingRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiAppSettingDelete, request, true);
        return response;
    }
}
