import React, {Component, useEffect} from 'react';
import {inject, observer} from "mobx-react";
import AuthStore from "auth/stores/AuthStore";
import "./ChangePassword.scss";
import {Alert, Button, Form, Input, Spin} from "antd";
import i18next from "i18next";
import {withTranslation} from "react-i18next";
import Routes from "app/constants/Routes";
import { Link, withRouter } from "react-router-dom";
import { PasswordInput } from 'antd-password-input-strength';

class ChangePasswordProps {
    authStore?: AuthStore;
    match?: any;
}

const ChangePassword: React.FC<ChangePasswordProps> = inject('authStore')(observer(({authStore, match}) =>
{
    useEffect(() =>
    {
        onLoad();

        return onUnload;
    }, []);

    let viewModel = authStore.changePasswordViewModel;

    if(!viewModel) return;

    async function onLoad()
    {
        document.body.classList.add('auth-page');

        authStore.onChangePasswordPageLoad();

        await authStore.changePasswordViewModel.validateResetPasswordToken(match.params.token);
    }

    function onUnload()
    {
        document.body.classList.remove('auth-page');
        authStore.onChangePasswordPageUnload();
    }

    async function onFinish()
    {
        viewModel.token = match.params.token;
        await viewModel.changePassword();
    }

    function onNewPasswordChanged(e)
    {
        viewModel.newPassword = e.target.value;
    }

    function onConfirmPasswordChanged(e)
    {
        viewModel.confirmPassword = e.target.value;
    }


    return (
        <div className="mainContent">
            <div className="signup-connect">
                <img src="/images/petro-pay-logo.png" className="logo" alt="logo"/>
            </div>
            <div className="signup-classic">
                <h2>
                {i18next.t("ChangePassword.Label.ChangePassword")}
                </h2>
                {viewModel.isValidating ?
                    <div className='token-validate-loader'>
                        <Spin size="large" />
                        <p>{i18next.t('ChangePassword.Token.Validation.Message')}</p>
                    </div>
                    :
                    !viewModel.isTokenValid ?
                        <div>
                            <Alert message={viewModel.errorMessage} type="error" />
                            <div className="link">
                                <Link to={Routes.auth}>{i18next.t('ResetPassword.Link.BackToLogin')}</Link>
                            </div>
                        </div>
                    :
                    <Form layout="vertical" onFinish={onFinish} >
                        <Form.Item initialValue={viewModel.newPassword} name="newPassword"
                                   label={i18next.t("ChangePassword.Label.NewPassword")} required={false}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("ChangePassword.Validation.Message.NewPassword.Required")
                                       },
                                       {
                                           pattern: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g,
                                           message: i18next.t("Companies.Validation.Message.companyAdminUserPassword.Valid"),
                                       }
                                   ]}>
                            <PasswordInput onChange={onNewPasswordChanged}/>
                        </Form.Item>
                        <Form.Item initialValue={viewModel.confirmPassword} name="confirmPassword"
                                   label={i18next.t("ChangePassword.Label.ConfirmPassword")} required={false}
                                   dependencies={['password']}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("ChangePassword.Validation.Message.ConfirmPassword.Required")
                                       },
                                       ({ getFieldValue }) => ({
                                           validator(_, value) {
                                               if (!value || getFieldValue('newPassword') === value) {
                                                   return Promise.resolve();
                                               }
                                               return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                           },
                                       }),
                                   ]}>
                            <PasswordInput onChange={onConfirmPasswordChanged}/>
                        </Form.Item>
                        {viewModel.errorMessage && (
                            <div className='response-error-msg'>{viewModel.errorMessage}</div>
                        )}
                        <Button type="primary" loading={viewModel.isProcessing} htmlType="submit">
                            {i18next.t("ChangePassword.Button.ChangePassword")}
                        </Button>
                        <div className="link">
                            <Link to={Routes.auth}>{i18next.t('ResetPassword.Link.BackToLogin')}</Link>
                        </div>
                    </Form>
                }

            </div>
        </div>
    );
}));

export default withRouter(withTranslation()(ChangePassword));
