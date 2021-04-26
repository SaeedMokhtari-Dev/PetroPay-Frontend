import React, {Component, useEffect} from 'react';
import {inject, observer} from "mobx-react";
import AuthStore from "auth/stores/AuthStore";
import "./ResetPassword.scss";
import {Alert, Button, Form, Input} from "antd";
import i18next from "i18next";
import {withTranslation} from "react-i18next";
import Routes from "app/constants/Routes";
import { Link } from "react-router-dom";

interface ResetPasswordProps {
    authStore?: AuthStore
}

const ResetPassword: React.FC<ResetPasswordProps> = inject('authStore')(observer(({authStore}) =>
{
    useEffect(() =>
    {
        onLoad();
        return onUnload;
    }, []);

    function onLoad()
    {
        document.body.classList.add('auth-page');
        authStore.onResetPasswordPageLoad();
        authStore.resetPasswordViewModel.roleType = +localStorage.getItem("roleType");
    }

    function onUnload()
    {
        document.body.classList.remove('auth-page');
        authStore.onResetPasswordPageUnload();
    }

    let viewModel = authStore.resetPasswordViewModel;

    if(!viewModel) return null;

    async function onFinish()
    {
        await viewModel.resetPassword();
    }

    function onEmailChanged(e) {
        viewModel.email = e.target.value;
    }

    return (
        <div className="mainContent">
            <div className="signup-connect">
                <img src="/images/petro-pay-logo.png" className="logo" alt="logo"/>
            </div>
            <div className="signup-classic">
                <h2>{i18next.t("ResetPassword.Label.ResetPassword")}</h2>

                {viewModel.responseMessage && (
                    <div>
                        <Alert message={viewModel.responseMessage} type="success"/>
                        <div className="link">
                            <Link to={Routes.auth}>{i18next.t('ResetPassword.Link.BackToLogin')}</Link>
                        </div>
                    </div>
                )}
                {!viewModel.responseMessage && (
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item initialValue={viewModel.email} name="email"
                                   label={i18next.t("Authentication.Label.Email")} required={false}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Authentication.Validation.Message.Email.Required"),
                                           type: 'email'
                                       }
                                   ]}>
                            <Input onChange={onEmailChanged} className="text-input"/>
                        </Form.Item>
                        <Button type="primary" loading={viewModel.isProcessing} htmlType="submit">
                            {i18next.t("ResetPassword.Button.ResetPassword")}
                        </Button>
                        <div className="link">
                            <Link to={Routes.auth}>{i18next.t('ResetPassword.Link.BackToLogin')}</Link>
                        </div>
                    </Form>
                )}
            </div>
        </div>
    );
}));

export default withTranslation()(ResetPassword);
