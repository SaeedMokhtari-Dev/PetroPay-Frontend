import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import EditAppSettingRequest from "./EditAppSettingRequest";


export default class EditAppSettingHandler
{
    public static async edit(request: EditAppSettingRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiAppSettingEdit, request, true);
        return response;
    }
}
