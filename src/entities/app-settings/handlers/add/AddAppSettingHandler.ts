import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import AddAppSettingRequest from "./AddAppSettingRequest";


export default class AddAppSettingHandler
{
    public static async add(request: AddAppSettingRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiAppSettingAdd, request, true);
        return response;
    }
}
