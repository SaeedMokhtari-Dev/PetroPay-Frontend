import ChangeUserPasswordRequest from "./ChangeUserPasswordRequest";
import ApiService from "app/services/ApiService";
import Endpoints from "../../../../app/constants/Endpoints";
import {getLocalizedString} from "../../../../app/utils/Localization";
import { message } from "antd";
import log from "loglevel";

export default class ChangeUserPasswordHandler
{
    public static async changeUserPassword(request: ChangeUserPasswordRequest)
    {
        try
        {
            let response = await ApiService.post(Endpoints.apiAuthChangeUserPassword, request, true);
            if(response && response.success)
            {
                message.success(getLocalizedString(response.message), 5);
                return true;
            }
            else
            {
                message.error(getLocalizedString(response.message), 20);
                return false;
            }
        }
        catch(e)
        {
            message.error(getLocalizedString("ChangePassword.Error.ChangePasswordFailed"), 20);
            log.error(e);
            return false;
        }
    }
}
