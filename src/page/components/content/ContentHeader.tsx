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
            <Menu mode="horizontal" style={{float:"right"}}>
                <SubMenu key="language" icon={<SettingOutlined />} title="Languages">
                    <Menu.Item key="en" onClick={changeLanguage}>English</Menu.Item>
                    <Menu.Item key="ar" onClick={changeLanguage}>Arabic</Menu.Item>
                </SubMenu>
                <SubMenu key="user" icon={<UserOutlined />} title={"Hi " + UserContext.info?.name}>
                    <Menu.Item key="profile">Profile</Menu.Item>
                    <Menu.Item key="signOut" onClick={handleSignOut}>Sign out</Menu.Item>
                </SubMenu>
            </Menu>
        </Header>
    )
}));

export default ContentHeader;
