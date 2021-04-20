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
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface LoginProps {
    authStore?: AuthStore
}

const Login: React.FC<LoginProps> = inject('authStore')(observer(({authStore}) =>
{
    useEffect(() =>
    {
        onLoad();
        return onUnload;
    }, []);

    function onLoad()
    {
        document.body.classList.add('auth-page');
        authStore.onLoginPageLoad();
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
    return (
        <div className="container">
            <div className="center-item">

            <span className="petro-pay">
                {i18next.t("Authentication.Label.PetroPay")}
            </span>
                <img src="/images/petro-pay-logo.png" className="logo" alt="logo"/>
                <span className="authentication">
                {i18next.t("Authentication.Label.Authentication")}
            </span>
                <Form layout="vertical" onFinish={onFinish} >
                    <Form.Item initialValue={viewModel.roleType} name="roleType" label={i18next.t("Authentication.Label.RoleType")} required={false}>
                        <Radio.Group onChange={onRoleTypeChanged} defaultValue={1}>
                            <Radio value={1}>{i18next.t("Authentication.RoleType.Customer")}</Radio>
                            <Radio value={10}>{i18next.t("Authentication.RoleType.Supplier")}</Radio>
                            <Radio value={100}>{i18next.t("Authentication.RoleType.Admin")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item initialValue={viewModel.username} name="username" label={i18next.t("Authentication.Label.Username")} required={false}
                               rules={[
                                   {
                                       required: true,
                                       message: i18next.t("Authentication.Validation.Message.Username.Required")
                                   }
                               ]}>
                        <Input onChange={onUsernameChanged} className="text-input"/>
                    </Form.Item>
                    <Form.Item initialValue={viewModel.password} name="password" label={i18next.t("Authentication.Label.Password")} required={false}
                               rules={[
                                   {
                                       required: true,
                                       message: i18next.t("Authentication.Validation.Message.Password.Required")
                                   }
                               ]}>
                        <Input.Password
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            onChange={onPasswordChanged}
                            className="text-input"
                        />
                    </Form.Item>
                    {viewModel.errorMessage && (
                        <div className='response-error-msg'>{viewModel.errorMessage}</div>
                    )}
                    <Button type="primary" loading={viewModel.isProcessing} htmlType="submit">
                        {i18next.t("Authentication.Button.Login")}
                    </Button>
                    {/*<div className="link">
                        <Link to={Routes.resetPassword}>{i18next.t('Authentication.Link.ForgotPassword')}</Link>
                    </div>*/}
                </Form>
                <br/>
                <br/>
                <br/>
                <Radio.Group value={localStorage.getItem('currentLanguage')}
                    options={optionsWithDisabled}
                    onChange={onLanguageChanged}
                    optionType="button"
                    buttonStyle="solid"
                />
            </div>
        </div>
    );
}));

export default withTranslation()(Login);
