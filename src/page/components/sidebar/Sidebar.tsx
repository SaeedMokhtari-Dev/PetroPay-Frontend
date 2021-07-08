import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PageStore from "page/stores/PageStore";
import "page/components/sidebar/Sidebar.scss";
import { Link } from "react-router-dom";

import { Layout, Menu } from 'antd';
import {
    DashboardOutlined, ReadOutlined, ShoppingOutlined, DollarOutlined, HomeOutlined,
    ShopOutlined, BookOutlined, CarOutlined
} from '@ant-design/icons';
import Routes from "../../../app/constants/Routes";
import i18next from "i18next";
import GetCompaniesRequest from "../../../entities/companies/handlers/get/GetCompaniesRequest";
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
        <Menu.Item key="app" icon={<DashboardOutlined />}>
            <Link to={Routes.app}>{i18next.t('Dashboard.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="company" icon={<HomeOutlined />}>
            <Link to={Routes.company}>{i18next.t('Companies.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="bundle" icon={<ShoppingOutlined />}>
            <Link to={Routes.bundle}>{i18next.t('Bundles.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="petroStation" icon={<ShopOutlined />}>
            <Link to={Routes.petroStation}>{i18next.t('PetroStations.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="rechargeBalance" icon={<DollarOutlined />}>
            <Link to={Routes.rechargeBalance}>{i18next.t('RechargeBalances.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="subscription" icon={<ShoppingOutlined />}>
            <Link to={Routes.subscription}>{i18next.t('Subscriptions.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="paymentTransferAccount" icon={<ShoppingOutlined />}>
            <Link to={Routes.petropayAccountList}>{i18next.t('PetropayAccounts.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="car" icon={<CarOutlined />}>
            <Link to={Routes.car}>{i18next.t('Cars.Menu.Requested.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="promotionCoupon" icon={<CarOutlined />}>
            <Link to={Routes.promotionCoupon}>{i18next.t('PromotionCoupons.Menu.Title')}</Link>
        </Menu.Item>
        <SubMenu key="reports" icon={<ReadOutlined />} title={i18next.t('General.Menu.Reports')}>
            <Menu.Item key="accountBalance" icon={<DollarOutlined />}>
                <Link to={Routes.accountBalance}>{i18next.t('AccountBalances.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="invoiceSummary" icon={<BookOutlined />}>
                <Link to={Routes.invoiceSummary}>{i18next.t('InvoiceSummaries.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="carBalance" icon={<DollarOutlined />}>
                <Link to={Routes.carBalance}>{i18next.t('CarBalances.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="carTransaction" icon={<CarOutlined />}>
                <Link to={Routes.carTransaction}>{i18next.t('CarTransactions.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="stationReport" icon={<ShopOutlined />}>
                <Link to={Routes.stationReport}>{i18next.t('StationReports.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="stationSale" icon={<DollarOutlined />}>
                <Link to={Routes.stationSale}>{i18next.t('StationSales.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="stationStatement" icon={<ShopOutlined />}>
                <Link to={Routes.stationStatement}>{i18next.t('StationStatements.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="petrolStationList" icon={<ShopOutlined />}>
                <Link to={Routes.petrolStationList}>{i18next.t('PetrolStationLists.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="carConsumptionRate" icon={<ShopOutlined />}>
                <Link to={Routes.carConsumptionRate}>{i18next.t('CarConsumptionRates.Menu.Title')}</Link>
            </Menu.Item>
        </SubMenu>
    </Menu>)
    const customerMenu= (<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="app" icon={<DashboardOutlined />}>
            <Link to={Routes.app}>{i18next.t('Dashboard.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="branch" icon={<ShopOutlined />}>
            <Link to={Routes.branch}>{i18next.t('Branches.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="car" icon={<CarOutlined />}>
            <Link to={Routes.car}>{i18next.t('Cars.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="rechargeBalance" icon={<DollarOutlined />}>
            <Link to={Routes.rechargeBalance}>{i18next.t('RechargeBalances.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="subscription" icon={<ShoppingOutlined />}>
            <Link to={Routes.subscription}>{i18next.t('Subscriptions.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="transferBalance" icon={<ShoppingOutlined />}>
            <Link to={Routes.transferBalance}>{i18next.t('TransferBalances.Menu.Title')}</Link>
        </Menu.Item>
        <SubMenu key="reports" icon={<ReadOutlined />} title={i18next.t('General.Menu.Reports')}>
            <Menu.Item key="invoiceSummary" icon={<BookOutlined />}>
                <Link to={Routes.invoiceSummary}>{i18next.t('InvoiceSummaries.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="carBalance" icon={<DollarOutlined />}>
                <Link to={Routes.carBalance}>{i18next.t('CarBalances.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="carTransaction" icon={<CarOutlined />}>
                <Link to={Routes.carTransaction}>{i18next.t('CarTransactions.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="petrolStationList" icon={<ShopOutlined />}>
                <Link to={Routes.petrolStationList}>{i18next.t('PetrolStationLists.Menu.Title')}</Link>
            </Menu.Item>
        </SubMenu>
    </Menu>)
    const supplierMenu= (<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="app" icon={<DashboardOutlined />}>
            <Link to={Routes.app}>{i18next.t('Dashboard.Menu.Title')}</Link>
        </Menu.Item>
        <Menu.Item key="stationUser" icon={<ShopOutlined />}>
            <Link to={Routes.stationUser}>{i18next.t('StationUsers.Menu.Title')}</Link>
        </Menu.Item>
        <SubMenu key="reports" icon={<ReadOutlined />} title={i18next.t('General.Menu.Reports')}>
            <Menu.Item key="stationReport" icon={<BookOutlined />}>
                <Link to={Routes.stationReport}>{i18next.t('StationReports.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="stationSale" icon={<DollarOutlined />}>
                <Link to={Routes.stationSale}>{i18next.t('StationSales.Menu.Title')}</Link>
            </Menu.Item>
            <Menu.Item key="stationStatement" icon={<ShopOutlined />}>
                <Link to={Routes.stationStatement}>{i18next.t('StationStatements.Menu.Title')}</Link>
            </Menu.Item>

        </SubMenu>
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
                <img src="/images/petro-pay-logo.png" hidden={pageStore?.isSidebarCollapsed} width={150} height={100} alt="logo"/>
            </div>
            {UserContext.info.role == RoleType.customer ? customerMenu : ""}
            {UserContext.info.role == RoleType.supplier ? supplierMenu : ""}
            {UserContext.info.role == RoleType.admin ? adminMenu : ""}
        </Sider>
    )
}));

export default Sidebar;
