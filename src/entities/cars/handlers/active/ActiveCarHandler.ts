import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ActiveCarRequest from "./ActiveCarRequest";


export default class ActiveCarHandler
{
    public static async active(request: ActiveCarRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiCarActive, request, true);
        return response;
    }
}
