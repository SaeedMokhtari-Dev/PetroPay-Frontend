import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ResetPasswordRequest from "./ResetPasswordRequest";
import {action} from "app/utils/Action";

export default class ResetPasswordHandler
{
    public static async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse>
    {
        let response = await action<ApiResponse>(async () => await ApiService.post(Endpoints.apiAuthResetPassword, request, false), 1000);

        return response;
    }
}