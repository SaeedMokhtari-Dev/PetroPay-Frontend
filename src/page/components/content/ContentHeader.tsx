import React, {useEffect} from 'react';
import i18next from "i18next";
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PageStore from "page/stores/PageStore";
import "./ContentHeader.scss";
import {Header} from "antd/es/layout/layout";
import {Avatar, Badge, List, Menu, Popover} from "antd";
import {MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import LogoutHandler from "auth/common/handlers/logout/LogoutHandler";
import UserContext from "../../../identity/contexts/UserContext";
import history from "../../../app/utils/History";
const { SubMenu } = Menu


interface ContentHeaderProps {
    pageStore?: PageStore
}

const ContentHeader: React.FC<ContentHeaderProps> = inject(Stores.pageStore)(observer(({pageStore}) =>
{
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);
    function onLoad(){

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


    return (
        <Header className="site-layout-background" style={{ padding: 0 }}>
            <Menu mode="horizontal" style={localStorage.getItem("currentLanguage") == 'en' ? {float:"right"} : {float:"left"}}>
                <SubMenu key="language" icon={<SettingOutlined />} title={i18next.t("General.HeaderMenu.Languages")}>
                    <Menu.Item key="en" onClick={changeLanguage}>{i18next.t("General.HeaderMenu.English")}</Menu.Item>
                    <Menu.Item key="ar" onClick={changeLanguage}>{i18next.t("General.HeaderMenu.Arabic")}</Menu.Item>
                </SubMenu>
                <SubMenu key="user" icon={<UserOutlined />} title={i18next.t("General.HeaderMenu.User") + " " + UserContext.info?.name}>
                    <Menu.Item key="profile">{i18next.t("General.HeaderMenu.Profile")}</Menu.Item>
                    <Menu.Item key="signOut" onClick={handleSignOut}>{i18next.t("General.HeaderMenu.SignOut")}</Menu.Item>
                </SubMenu>
            </Menu>
        </Header>
    )
}));

export default ContentHeader;
