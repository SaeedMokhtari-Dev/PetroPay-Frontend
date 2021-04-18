import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PageStore from "page/stores/PageStore";
import "page/components/content/UserMenu.scss";
import {Dropdown, Menu} from "antd";
import UserContext from "identity/contexts/UserContext";
import bxsUserCircle from '@iconify-icons/bx/bxs-user-circle';
import { Icon, InlineIcon } from '@iconify/react';
import roundKeyboardArrowDown from '@iconify-icons/ic/round-keyboard-arrow-down';
import UserMenuKeys from "page/constants/UserMenuKeys";
import i18next from "i18next";
import LogoutHandler from "auth/common/handlers/logout/LogoutHandler";

interface UserMenuProps {
    pageStore?: PageStore
}

const UserMenuOverlay = (onItemClick) => {
    return (
        <Menu onClick={onItemClick} className="user-menu-dropdown">
            <Menu.Item key={UserMenuKeys.changePassword}>
                <div>{i18next.t('User.Menu.ChangePassword')}</div>
            </Menu.Item>
            <Menu.Item key={UserMenuKeys.logout}>
                <div>{i18next.t('User.Menu.Logout')}</div>
            </Menu.Item>
        </Menu>
    )
};

const UserMenu: React.FC<UserMenuProps> = inject(Stores.pageStore)(observer(({pageStore}) =>
{
    function onItemClick(e)
    {
        if(e.key == UserMenuKeys.logout)
        {
            logout();
        }
        else if(e.key == UserMenuKeys.changePassword)
        {
            changePassword();
        }
    }

    async function logout()
    {
        await LogoutHandler.logout(true);
    }

    function changePassword()
    {
        // show password change dialog
    }

    return (
        <Dropdown overlay={UserMenuOverlay(onItemClick)} trigger={['hover']}>
            <div className="user-menu noselect">
                <Icon height={32} className='icon' icon={bxsUserCircle} />
                <span className="user-name">{UserContext.info?.name}</span>
                <Icon className='icon' width={24} icon={roundKeyboardArrowDown} />
            </div>
        </Dropdown>
    )
}));

export default UserMenu;