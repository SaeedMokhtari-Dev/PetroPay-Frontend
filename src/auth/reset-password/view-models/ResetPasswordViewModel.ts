import AuthStore from "auth/stores/AuthStore";
import {action, makeAutoObservable, observable} from "mobx";
import i18next from "i18next";
import log from "loglevel";
import {getLocalizedString} from "app/utils/Localization";
import ResetPasswordRequest from "../handlers/ResetPasswordRequest";
import ResetPasswordHandler from "../handlers/ResetPasswordHandler";

export default class ResetPasswordViewModel
{
    email: string;

    roleType: number;

    isProcessing: boolean;

    responseMessage: string;

    errorMessage: string;

    constructor(public auth: AuthStore)
    {
        makeAutoObservable(this);
    }

    public async resetPassword()
    {
        try
        {
            this.isProcessing = true;

            let request = new ResetPasswordRequest(this.roleType, this.email);

            let response = await ResetPasswordHandler.resetPassword(request);

            if(response)
            {
                this.responseMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('ResetPassword.Error.ResetPasswordFailed');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
