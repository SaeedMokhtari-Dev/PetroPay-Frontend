import AuthStore from "auth/stores/AuthStore";
import {makeAutoObservable} from "mobx";
import LoginRequest from "auth/login/handlers/login/LoginRequest";
import LoginHandler from "auth/login/handlers/login/LoginHandler";
import NavigationService from "app/services/NavigationService";
import i18next from "i18next";
import log from "loglevel";
import {getLocalizedString} from "app/utils/Localization";
import UserContext from "identity/contexts/UserContext";

export default class LoginViewModel
{
    roleType: number;

    username: string;

    password: string;

    isProcessing: boolean;

    errorMessage: string;

    constructor(public auth: AuthStore)
    {
        makeAutoObservable(this);
    }

    public async login()
    {
        try
        {
            this.isProcessing = true;

            let request = new LoginRequest(this.roleType, this.username, this.password);

            let response = await LoginHandler.authenticate(request);

            if(response && response.success)
            {
                await UserContext.initialize();
                localStorage.setItem("roleType", this.roleType.toString());
                NavigationService.navigate('/');
            }
            else
            {
                this.errorMessage =  getLocalizedString(response.message);
            }
        }
        catch(e)
        {

            this.errorMessage = i18next.t('Authentication.Error.AuthFailed');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
