import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PageStore from "page/stores/PageStore";
import "page/components/sidebar/Sidebar.scss";
import { Link } from "react-router-dom";

import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    PieChartOutlined, DesktopOutlined, TeamOutlined, FileOutlined, ShopOutlined
} from '@ant-design/icons';
import Routes from "../../../app/constants/Routes";
import i18next from "i18next";
import GetCompaniesRequest from "../../../companies/handlers/get/GetCompaniesRequest";
import UserContext from "../../../identity/contexts/UserContext";
import RoleType from "../../../identity/constants/RoleType";

const { Sider } = Layout;
const { SubMenu } = Menu;

interface SidebarProps {
    pageStore?: PageStore
}

const Sidebar: React.FC<SidebarProps> = inject(Stores.pageStore)(observer(({pageStore, children}) =>
{
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    const adminMenu= (<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<ShopOutlined />}>
            <Link to={Routes.company}>{i18next.t('Companies.Menu.Title')}</Link>
        </Menu.Item>
        {/*<Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined />}>
            Files
        </Menu.Item>*/}
    </Menu>)
    const customerMenu= (<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<ShopOutlined />}>
            <Link to={Routes.company}>{i18next.t('Companies.Menu.Title')}</Link>
        </Menu.Item>
    </Menu>)
    const supplierMenu= (<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<ShopOutlined />}>
            <Link to={Routes.company}>{i18next.t('Companies.Menu.Title')}</Link>
        </Menu.Item>
    </Menu>)
    async function onLoad() {
    }

    function onUnload() {
        //companiesStore.onCompaniesSidebarPageUnload();
    }

    function toggle() {
        pageStore.isSidebarCollapsed = !pageStore?.isSidebarCollapsed
    }

    return (
        <Sider collapsible collapsed={pageStore?.isSidebarCollapsed} onCollapse={toggle}>
            <div className="logo" >
                <img src="/images/petro-pay-logo1.png" hidden={pageStore?.isSidebarCollapsed} width={150} height={100} alt="logo"/>
            </div>
            {UserContext.info.role == RoleType.customer ? customerMenu : ""}
            {UserContext.info.role == RoleType.supplier ? supplierMenu : ""}
            {UserContext.info.role == RoleType.admin ? adminMenu : ""}
        </Sider>
    )
}));

export default Sidebar;
