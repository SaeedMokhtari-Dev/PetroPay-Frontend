import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CustomerStore from "../../stores/CustomerStore";
import i18next from "i18next";
import GetAccountBalanceRequest from "../../../reports/AccountBalances/handlers/get/GetAccountBalanceRequest";
import UserContext from "../../../identity/contexts/UserContext";
import GetCustomerRequest from "../../handlers/get/GetCustomerRequest";
import {Col, Descriptions, Divider, Row, Spin, Table} from "antd";
import AccountBalanceColumns from "../../../reports/AccountBalances/components/list/AccountBalanceColumns";
import CompanySubscriptionItemColumns from "./CompanySubscriptionItemColumns";
import CompanyBranchItemColumns from "./CompanyBranchItemColumns";

interface DashboardProps {
    customerStore?: CustomerStore
}

const CustomerDashboard: React.FC<DashboardProps> = inject(Stores.customerStore)(observer(({customerStore}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    CompanySubscriptionItemColumns.forEach(w => {
        w.title = i18next.t(w.title);
    });

    const subscriptionColumns: any[] = [...CompanySubscriptionItemColumns];

    CompanyBranchItemColumns.forEach(w => {
        w.title = i18next.t(w.title);
    });

    const branchColumns: any[] = [...CompanyBranchItemColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        customerStore.onCustomerGetPageLoad();
        customerStore.getCustomerViewModel.getCustomerRequest = new GetCustomerRequest();
        customerStore.getCustomerViewModel.getCustomerRequest.companyId = UserContext.info.id;
        await customerStore.getCustomerViewModel.getDashboardData(customerStore.getCustomerViewModel.getCustomerRequest);

        setDataFetched(true);
    }

    let viewModel = customerStore.getCustomerViewModel;

    if (!viewModel) return;

    function onUnload() {
        customerStore.onCustomerGetPageUnload();
    }

    return (
        <div>
        {dataFetched ?
            <div>
                <Descriptions title={i18next.t("CustomerDashboard.Title")} bordered>
                    <Descriptions.Item label={i18next.t("CustomerDashboard.TotalCustomerBalance")}>{viewModel?.totalCustomerBalance?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label={i18next.t("CustomerDashboard.TotalCarBalance")}>{viewModel?.totalCarBalance?.toLocaleString()}</Descriptions.Item>
                </Descriptions>
                <br />
                <Divider>{i18next.t("CustomerDashboard.Section.BranchesBalance")}</Divider>
                <br/>
                <Table dataSource={viewModel?.companyBranchItems} columns={branchColumns} loading={viewModel?.isProcessing}
                       bordered={true} pagination={false} />
                <br/>
                <Divider>{i18next.t("CustomerDashboard.Section.Subscriptions")}</Divider>
                <br/>
                <Table dataSource={viewModel?.companySubscriptionItems} columns={subscriptionColumns} loading={viewModel?.isProcessing}
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

export default CustomerDashboard;
