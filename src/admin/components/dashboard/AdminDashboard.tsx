import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import i18next from "i18next";
import {Col, Descriptions, Divider, Row, Spin, Table} from "antd";
import PetrolStationItemColumns from "./PetrolStationItemColumns";
import CompanyListItemColumns from "./CompanyListItemColumns";
import AdminStore from 'admin/stores/AdminStore';

interface DashboardProps {
    adminStore?: AdminStore
}

const AdminDashboard: React.FC<DashboardProps> = inject(Stores.adminStore)(observer(({adminStore}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    PetrolStationItemColumns.forEach(w => {
        w.title = i18next.t(w.title);
    });

    const petrolStationsColumns: any[] = [...PetrolStationItemColumns];

    CompanyListItemColumns.forEach(w => {
        w.title = i18next.t(w.title);
    });

    const companyColumns: any[] = [...CompanyListItemColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        adminStore.onAdminGetPageLoad();
        await adminStore.getAdminViewModel.getDashboardData();

        setDataFetched(true);
    }

    let viewModel = adminStore.getAdminViewModel;

    if (!viewModel) return;

    function onUnload() {
        adminStore.onAdminGetPageUnload();
    }

    return (
        <div>
        {dataFetched ?
            <div>
                <Descriptions title={i18next.t("AdminDashboard.Title")} bordered>
                    <Descriptions.Item label={i18next.t("AdminDashboard.SubscriptionRequests")}>{viewModel?.subscriptionRequests?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label={i18next.t("AdminDashboard.RechargeRequests")}>{viewModel?.rechargeRequests?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label={i18next.t("AdminDashboard.CarRequests")}>{viewModel?.carRequests?.toLocaleString()}</Descriptions.Item>
                </Descriptions>
                <br />
                <Divider>{i18next.t("AdminDashboard.Section.CompaniesBalance")}</Divider>
                <br/>
                <Table dataSource={viewModel?.companyListItems} columns={companyColumns} loading={viewModel?.isProcessing}
                       bordered={true} pagination={false} />
                <br/>
                <Divider>{i18next.t("AdminDashboard.Section.PetrolStationsBalance")}</Divider>
                <br/>
                <Table dataSource={viewModel?.petrolStationItems} columns={petrolStationsColumns} loading={viewModel?.isProcessing}
                       bordered={true} pagination={false}/>
                <br/>
            </div>
                :
                <Row gutter={[24, 16]}>
                    <Col offset={11} span={8}>
                        <Spin className={"spine"} size="large" />
                    </Col>
                </Row>
        }
        </div>
    )
}));

export default AdminDashboard;
