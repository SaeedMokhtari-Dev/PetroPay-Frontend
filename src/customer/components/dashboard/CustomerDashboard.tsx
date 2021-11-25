import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CustomerStore from "../../stores/CustomerStore";
import i18next from "i18next";
import UserContext from "../../../identity/contexts/UserContext";
import GetCustomerRequest from "../../handlers/get/GetCustomerRequest";
import {Badge, Col, Descriptions, Divider, Row, Spin, Table} from "antd";
import CompanySubscriptionItemColumns from "./CompanySubscriptionItemColumns";
import CompanyBranchItemColumns from "./CompanyBranchItemColumns";
import {CheckOutlined, ClockCircleOutlined} from "@ant-design/icons";

interface DashboardProps {
    customerStore?: CustomerStore
}

const CustomerDashboard: React.FC<DashboardProps> = inject(Stores.customerStore)(observer(({customerStore}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    CompanySubscriptionItemColumns.forEach(w => {
        w.title = i18next.t(w.title);
        if(w.key === "alarm"){
            w["render"] = (w) => {
                return  w ? <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />} /> : "";
            }
        }
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
        if(UserContext.info.role === 1)
            customerStore.getCustomerViewModel.getCustomerRequest.companyId = UserContext.info.id;
        if(UserContext.info.role === 5)
            customerStore.getCustomerViewModel.getCustomerRequest.companyBranchId = UserContext.info.id;
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
                    <Descriptions.Item label={i18next.t("CustomerDashboard.TotalBranchBalance")}>{viewModel?.totalBranchBalance?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label={i18next.t("CustomerDashboard.TotalCarBalance")}>{viewModel?.totalCarBalance?.toLocaleString()}</Descriptions.Item>
                </Descriptions>
                <br />
                {UserContext.info.role === 1 ?
                    <React.Fragment>
                        <Divider>{i18next.t("CustomerDashboard.Section.BranchesBalance")}</Divider>
                        <br/>
                        <Table dataSource={viewModel?.companyBranchItems} columns={branchColumns} loading={viewModel?.isProcessing}
                               bordered={true} pagination={false} />
                        <br/>
                    </React.Fragment>
                    : "" }
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
