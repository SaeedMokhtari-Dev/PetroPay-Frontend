import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import SupplierStore from "../../stores/SupplierStore";
import i18next from "i18next";
import GetCustomerRequest from "../../../customer/handlers/get/GetCustomerRequest";
import UserContext from "../../../identity/contexts/UserContext";
import GetSupplierRequest from "../../handlers/get/GetSupplierRequest";
import {Col, Descriptions, Divider, Row, Spin, Table} from "antd";
import SupplierDashboardColumns from "./SupplierDashboardColumns";

interface DashboardProps {
    supplierStore?: SupplierStore
}

const SupplierDashboard: React.FC<DashboardProps> = inject(Stores.supplierStore)(observer(({supplierStore}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);

    SupplierDashboardColumns.forEach(w => {
        w.title = i18next.t(w.title);
    });
    const columns: any[] = [...SupplierDashboardColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        supplierStore.onSupplierGetPageLoad();
        supplierStore.getSupplierViewModel.getSupplierRequest = new GetSupplierRequest();
        if(UserContext.info.role === 10)
            supplierStore.getSupplierViewModel.getSupplierRequest.supplierId = UserContext.info.id;
        if(UserContext.info.role === 15)
            supplierStore.getSupplierViewModel.getSupplierRequest.supplierBranchId = UserContext.info.id;
        await supplierStore.getSupplierViewModel.getDashboardData(supplierStore.getSupplierViewModel.getSupplierRequest);
        supplierStore.getSupplierViewModel.petroStationItems.forEach((w, i) => {w.key = i });
        setDataFetched(true);
    }

    let viewModel = supplierStore.getSupplierViewModel;

    if (!viewModel) return;

    function onUnload() {
        supplierStore.onSupplierGetPageUnload();
    }
    return (
        <div>
        {dataFetched ?
                <div>
                    <Descriptions title={i18next.t("Dashboard.Supplier.Title")} bordered>
                        <Descriptions.Item label={i18next.t("SupplierDashboard.stationBalance")}>{viewModel?.stationBalance?.toLocaleString()}</Descriptions.Item>
                        {UserContext.info.role === 15 ?
                        <Descriptions.Item label={i18next.t("SupplierDashboard.stationBonusBalance")}>{viewModel?.stationBonusBalance?.toLocaleString()}</Descriptions.Item>
                            : "" }
                    </Descriptions>
                    <br/>
                    <Divider>{i18next.t("SupplierDashboard.Section.Stations")}</Divider>
                    <br/>
                    <Table dataSource={viewModel?.petroStationItems} columns={columns} loading={viewModel?.isProcessing}
                           bordered={true} pagination={false} sticky
                           summary={() => (
                               <Table.Summary.Row>
                                   <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                                   <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                   {/*<Table.Summary.Cell index={5}>{viewModel.petroStationItems.map(w => w.stationBalance).reduce((a, b) => a + b).toLocaleString()}</Table.Summary.Cell>*/}
                                   <Table.Summary.Cell index={6}>{viewModel.petroStationItems.map(w => w.stationBonusBalance).reduce((a, b) => a + b).toLocaleString()}</Table.Summary.Cell>
                               </Table.Summary.Row>
                           )}
                    />

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

export default SupplierDashboard;
