import ApiResponse from "app/models/ApiResponse";
import ApiService from "app/services/ApiService";
import Endpoints from "app/constants/Endpoints";
import ChangePasswordRequest from "./ChangePasswordRequest";
import {action} from "app/utils/Action";

export default class ChangePasswordHandler
{
    public static async changePassword(request: ChangePasswordRequest): Promise<ApiResponse>
    {
        let response = await ApiService.post(Endpoints.apiAuthChangePassword, request, false);
        return response;
    }

    public static async validateResetPasswordToken(token: string): Promise<ApiResponse>
    {
        let validateRequest = {token};
        let response = await action<ApiResponse>(async () => ApiService.post(Endpoints.apiAuthValidateResetPasswordToken, validateRequest, false), 500);
        return response;
    }
}