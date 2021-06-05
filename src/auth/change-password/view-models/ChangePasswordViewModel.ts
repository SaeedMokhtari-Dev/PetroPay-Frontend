import AuthStore from "auth/stores/AuthStore";
import {action, makeAutoObservable, observable} from "mobx";
import ApiResponse from "app/models/ApiResponse";
import NavigationService from "app/services/NavigationService";
import Routes from "app/constants/Routes";
import i18next from "i18next";
import log from "loglevel";
import {getLocalizedString} from "app/utils/Localization";
import ChangePasswordRequest from "../handlers/ChangePasswordRequest";
import ChangePasswordHandler from "../handlers/ChangePasswordHandler";
import { message } from "antd";

export default class ChangePasswordViewModel
{
    token: string;
    newPassword: string;
    confirmPassword: string;
    isProcessing: boolean;
    message: string;
    errorMessage: string;
    isTokenValid: boolean;
    isValidating: boolean;
    roleType: number;

    constructor(public auth: AuthStore) {
        makeAutoObservable(this);
    }

    public async validateResetPasswordToken(token:string)
    {
        try
        {
            this.isValidating = true;

            let response = await ChangePasswordHandler.validateResetPasswordToken(token);

            if(response && response.success)
            {
                this.isTokenValid = true;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('ChangePassword.Error.ChangePasswordFailed');
            log.error(e);
        }
        finally
        {
            this.isValidating = false;
        }
    }

    public async changePassword()
    {
        try
        {

            this.isProcessing = true;

            let request = new ChangePasswordRequest(this.token, this.newPassword, this.confirmPassword);

            let response = await ChangePasswordHandler.changePassword(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                NavigationService.navigate("/auth");
            }
            else
            {
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('ChangePassword.Error.ChangePasswordFailed');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}