import React, {Component, useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PageStore from "page/stores/PageStore";
import {withTranslation} from "react-i18next";
import {withRouter} from "react-router-dom";
import "./Page.scss";
import UserContext from "identity/contexts/UserContext";
import RoleType from "identity/constants/RoleType";
import { Layout, Menu, Breadcrumb } from 'antd';
import Sidebar from "./sidebar/Sidebar";
import ContentHeader from "./content/ContentHeader";
import i18next from "i18next";
const { Header, Content, Footer} = Layout;


interface PageProps
{
    pageStore?: PageStore
}

const Page: React.FC<PageProps> = inject(Stores.pageStore)(observer(({pageStore, children}) =>
{
    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout className="site-layout">
                    <ContentHeader />
                    <Content style={{ margin: '0 16px' }}>
                        <br/>
                        {/*<Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>*/}
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>{i18next.t("Authentication.Label.PetroPay")}</Footer>
                </Layout>
            </Layout>
        </div>
    )
}));

export default withRouter(withTranslation()(Page));
