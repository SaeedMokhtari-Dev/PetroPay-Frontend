import React, {useEffect} from 'react';
import i18next from "i18next";
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PageStore from "page/stores/PageStore";
import "./ContentHeader.scss";
import {Header} from "antd/es/layout/layout";
import {Button, Input, Form, Menu, Modal, Tag} from "antd";
import {MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined, DollarOutlined} from '@ant-design/icons';
import LogoutHandler from "auth/common/handlers/logout/LogoutHandler";
import UserContext from "../../../identity/contexts/UserContext";
import history from "../../../app/utils/History";
import { PasswordInput } from 'antd-password-input-strength';
import ChangeUserPasswordRequest from "../../../auth/common/handlers/change-user-password/ChangeUserPasswordRequest";
import ChangeUserPasswordHandler from "../../../auth/common/handlers/change-user-password/ChangeUserPasswordHandler";
const { SubMenu } = Menu


interface ContentHeaderProps {
    pageStore?: PageStore
}

const ContentHeader: React.FC<ContentHeaderProps> = inject(Stores.pageStore)(observer(({pageStore}) =>
{
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);
    function onLoad(){
        pageStore.changeUserPasswordRequest = new ChangeUserPasswordRequest();
    }
    function onUnload(){

    }

    function handleClickMenu(e) {
        e.key === 'SignOut' && this.props.onSignOut()
    }
    function changeLanguage(e){
        i18next.changeLanguage(e.key, () => {
            localStorage.setItem("currentLanguage", e.key);
            history.go(0);
        });
    }
    async function handleSignOut(){
        await LogoutHandler.logout(true);
    }

    async function handleChangePassword(){
        setLoading(true);
        const result = await ChangeUserPasswordHandler.changeUserPassword(pageStore.changeUserPasswordRequest);
        setLoading(false);
        if(result)
            setModalVisible(false)
    }
    function handleCancel(){
        debugger;
        pageStore.changeUserPasswordRequest = new ChangeUserPasswordRequest();
        setModalVisible(false)
    }
    function onCurrentPasswordChanged(e){
        pageStore.changeUserPasswordRequest.currentPassword = e.target.value;
        //bundlesStore.editBundleViewModel.editBundleRequest[`${e.target.id}`] = e.target.value;
    }
    function onNewPasswordChanged(e)
    {
        pageStore.changeUserPasswordRequest.newPassword = e.target.value;
    }

    function onConfirmPasswordChanged(e)
    {
        pageStore.changeUserPasswordRequest.confirmPassword = e.target.value;
    }

    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            <Menu mode="horizontal" style={localStorage.getItem("currentLanguage") == 'en' ? {float:"right"} : {float:"left"}}>
                <Menu.Item disabled  key={"balance"}>
                {UserContext.info?.role !== 100 &&
                    <div>
                <Tag icon={<DollarOutlined />} color="success">
                    {UserContext.info?.balance?.toLocaleString()}
                </Tag> </div>}
                </Menu.Item>

                <SubMenu key="language" icon={<SettingOutlined />} title={i18next.t("General.HeaderMenu.Languages")}>
                    <Menu.Item key="en" onClick={changeLanguage}>{i18next.t("General.HeaderMenu.English")}</Menu.Item>
                    <Menu.Item key="ar" onClick={changeLanguage}>{i18next.t("General.HeaderMenu.Arabic")}</Menu.Item>
                </SubMenu>
                <SubMenu key="user" icon={<UserOutlined />} title={i18next.t("General.HeaderMenu.User") + " " + UserContext.info?.name}>
                    <Menu.Item key="profile">{i18next.t("General.HeaderMenu.Profile")}</Menu.Item>
                    <Menu.Item key="changePassword" onClick={() => setModalVisible(true)}>{i18next.t("General.HeaderMenu.ChangePassword")}</Menu.Item>
                    <Menu.Item key="signOut" onClick={handleSignOut}>{i18next.t("General.HeaderMenu.SignOut")}</Menu.Item>
                </SubMenu>
            </Menu>
            <Modal
                title={i18next.t("ChangePassword.Label.ChangePassword")}
                centered
                visible={modalVisible}
                destroyOnClose={true}
                closable={false}
                footer={[
                    <Button type={"default"} loading={isLoading} danger key="cancel" onClick={handleCancel}>
                        {i18next.t("General.Add.CancelButton")}
                    </Button>,
                    <Button type={"primary"} loading={isLoading} form="changePasswordForm" key="submit" htmlType="submit">
                        {i18next.t("ChangePassword.Button.ChangePassword")}
                    </Button>
                ]}
            >
                <Form {...layout} form={form} onFinish={handleChangePassword}
                      key={"changePasswordForm"} id={"changePasswordForm"}>
                    <Form.Item name="currentPassword" initialValue={pageStore?.changeUserPasswordRequest?.currentPassword}
                               key={"currentPassword"}
                               label={i18next.t("ChangePassword.Label.currentPassword")}
                               rules={[
                                   {
                                       required: true,
                                       message: i18next.t("ChangePassword.Validation.Message.CurrentPassword.Required")
                                   }
                               ]}>
                        <Input type={"password"} onChange={onCurrentPasswordChanged}/>
                    </Form.Item>
                    <Form.Item name="newPassword"  initialValue={pageStore?.changeUserPasswordRequest?.newPassword}
                               label={i18next.t("ChangePassword.Label.NewPassword")}
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
                    <Form.Item name="confirmPassword"  initialValue={pageStore?.changeUserPasswordRequest?.confirmPassword}
                               label={i18next.t("ChangePassword.Label.ConfirmPassword")}
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
                </Form>
            </Modal>
        </Header>
    )
}));

export default ContentHeader;
