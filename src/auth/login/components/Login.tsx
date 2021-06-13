import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import AuthStore from "auth/stores/AuthStore";
import "auth/login/components/Login.scss";
import {Button, Form, Input, Radio} from "antd";
import i18next from "i18next";
import {withTranslation} from "react-i18next";
import Routes from "app/constants/Routes";
import { Link } from "react-router-dom";
import history from "../../../app/utils/History";
import {useParams} from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';
import RoleTypeUtils from "../../../app/utils/RoleTypeUtils";
import NavigationService from "../../../app/services/NavigationService";

interface LoginProps {
    authStore?: AuthStore,
    match?: any
}

const Login: React.FC<LoginProps> = inject('authStore')(observer(({authStore, match}) =>
{
    let params = useParams();

    useEffect(() =>
    {
        onLoad();
        return onUnload;
    }, []);

    function onLoad()
    {
        /*document.body.classList.add('auth-page');*/
        authStore.onLoginPageLoad();
        
        if(params?.roleType){
            if(match.params.roleType.toLowerCase() == 'customer'){
                authStore.loginViewModel.roleType = 1;
            }
            if(match.params.roleType.toLowerCase() == 'petrol-station'){
                authStore.loginViewModel.roleType = 10;
            }
            if(match.params.roleType.toLowerCase() == 'admin'){
                authStore.loginViewModel.roleType = 100;
            }
        }
    }

    function onUnload()
    {
        authStore.onLoginPageUnload();
        document.body.classList.remove('auth-page');
    }

    let viewModel = authStore.loginViewModel;

    if(!viewModel) return null;

    async function onFinish()
    {
        viewModel.errorMessage = null;
        viewModel.roleType = viewModel.roleType ?? 1;
        await viewModel.login();
    }

    function onUsernameChanged(e)
    {
        viewModel.username = e.target.value;
    }

    function onPasswordChanged(e)
    {
        viewModel.password = e.target.value;
    }

    function onRoleTypeChanged(e)
    {
        viewModel.roleType = e.target.value;
        localStorage.setItem("roleType", e.target.value);
    }

    const optionsWithDisabled = [
        { label: 'English', value: 'en' },
        { label: 'عربي', value: 'ar' }
    ];

    function onLanguageChanged(e) {
        i18next.changeLanguage(e.target.value);
        localStorage.setItem("currentLanguage", e.target.value);
        history.go(0);
    }
    function resetPasswordPage(){
        localStorage.setItem("roleType", viewModel.roleType.toString());
        NavigationService.navigate(Routes.resetPassword);
    }
    return (
        <div>
            {!viewModel?.roleType && (
                <div className={"mainContent"}>
                    <div className={"role-type"}>
                        <Link to={"/auth/customer"}>
                            <img src="/images/customer.png" className="logo" alt="logo"/>
                            <h3 style={{textAlign: "center"}}>
                                {i18next.t("Authentication.RoleType.Customer")}
                            </h3>
                        </Link>
                        <Link to={"/auth/petrol-station"}>
                            <img src="/images/petro-station.png" className="logo" alt="logo"/>
                            <h3 style={{textAlign: "center"}}>
                                {i18next.t("Authentication.RoleType.Supplier")}
                            </h3>
                        </Link>
                        <Link to={"/auth/admin"}>
                            <img src="/images/admin.png" className="logo" alt="logo"/>
                            <h3 style={{textAlign: "center"}}>
                                {i18next.t("Authentication.RoleType.Admin")}
                            </h3>
                        </Link>
                        {/*<Radio.Group onChange={onRoleTypeChanged} className={"radio-role"}>
                            <Radio  value={1}>
                                <img src="/images/customer.png" className="logo" alt="logo"/>
                                <h2 style={{textAlign: "center"}}>
                                    {i18next.t("Authentication.RoleType.Customer")}
                                </h2>
                            </Radio>
                            <Radio value={10}>
                                <img src="/images/petro-station.png" className="logo" alt="logo"/>
                                <h2 style={{textAlign: "center"}}>
                                    {i18next.t("Authentication.RoleType.Supplier")}
                                </h2>
                            </Radio>
                            <Radio value={100}>
                                <img src="/images/admin.png" className="logo" alt="logo"/>
                                <h2 style={{textAlign: "center"}}>
                                    {i18next.t("Authentication.RoleType.Admin")}
                                </h2>
                            </Radio>
                        </Radio.Group>*/}
                    </div>
                </div>)}
            {viewModel?.roleType && (
                <div className={"mainContent"}>
                    <div className="signup-connect">
                        <img src="/images/petro-pay-logo.png" className="logo" alt="logo"/>
                    </div>
                    <div className="signup-classic">
                        <h1>{i18next.t("General.HeaderMenu.User")} {i18next.t(`Authentication.RoleType.${RoleTypeUtils.getRoleTypeTitle(viewModel?.roleType)}`)}</h1>
                        <Form layout="vertical" onFinish={onFinish} >
                            <Form.Item initialValue={viewModel.username} name="username" label={i18next.t("Authentication.Label.Username")} required={false}
                                       rules={[
                                           {
                                               required: true,
                                               message: i18next.t("Authentication.Validation.Message.Username.Required")
                                           }
                                       ]}>
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} onChange={onUsernameChanged} className="text-input"/>
                            </Form.Item>
                            <Form.Item initialValue={viewModel.password} name="password" label={i18next.t("Authentication.Label.Password")} required={false}
                                       rules={[
                                           {
                                               required: true,
                                               message: i18next.t("Authentication.Validation.Message.Password.Required")
                                           }
                                       ]}>
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    onChange={onPasswordChanged}
                                    className="text-input"
                                />
                            </Form.Item>
                            {viewModel.errorMessage && (
                                <div className='response-error-msg'>{viewModel.errorMessage}</div>
                            )}
                            <Button type="primary" className={"button"} loading={viewModel.isProcessing} htmlType="submit">
                                {i18next.t("Authentication.Button.Login")}
                            </Button>
                            <div className="link">
                                {/*<Link to={Routes.resetPassword}></Link>*/}
                                <Button type="link" onClick={resetPasswordPage}>
                                    {i18next.t('Authentication.Link.ForgotPassword')}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
}));

export default withTranslation()(Login);
