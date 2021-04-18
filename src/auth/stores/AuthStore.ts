import {AppStore} from "app/stores/AppStore";
import LoginViewModel from "auth/login/view-models/LoginViewModel";
import {makeAutoObservable} from "mobx";
import ResetPasswordViewModel from "../reset-password/view-models/ResetPasswordViewModel";
import ChangePasswordViewModel from "../change-password/view-models/ChangePasswordViewModel";

export default class AuthStore
{
    loginViewModel: LoginViewModel;

    resetPasswordViewModel: ResetPasswordViewModel;

    changePasswordViewModel: ChangePasswordViewModel;

    constructor(public appStore: AppStore)
    {
        makeAutoObservable(this);
    }

    onLoginPageLoad()
    {
        this.loginViewModel = new LoginViewModel(this);
    }

    onLoginPageUnload()
    {
        this.loginViewModel = null;
    }

    onResetPasswordPageLoad()
    {
        this.resetPasswordViewModel = new ResetPasswordViewModel(this);
    }

    onResetPasswordPageUnload()
    {
        this.resetPasswordViewModel = null;
    }

    onChangePasswordPageLoad()
    {
        this.changePasswordViewModel = new ChangePasswordViewModel(this);
    }

    onChangePasswordPageUnload()
    {
        this.changePasswordViewModel = null;
    }
}