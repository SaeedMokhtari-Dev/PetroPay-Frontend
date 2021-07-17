import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import SupplierStore from "../../stores/SupplierStore";
import i18next from "i18next";
import GetCustomerRequest from "../../../customer/handlers/get/GetCustomerRequest";
import UserContext from "../../../identity/contexts/UserContext";
import GetSupplierRequest from "../../handlers/get/GetSupplierRequest";
import {Col, Descriptions, Row, Spin} from "antd";

interface DashboardProps {
    supplierStore?: SupplierStore
}

const SupplierDashboard: React.FC<DashboardProps> = inject(Stores.supplierStore)(observer(({supplierStore}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        supplierStore.onSupplierGetPageLoad();
        supplierStore.getSupplierViewModel.getSupplierRequest = new GetSupplierRequest();
        supplierStore.getSupplierViewModel.getSupplierRequest.supplierId = UserContext.info.id;
        await supplierStore.getSupplierViewModel.getDashboardData(supplierStore.getSupplierViewModel.getSupplierRequest);

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
                        <Descriptions.Item label={i18next.t("SupplierDashboard.stationBonusBalance")}>{viewModel?.stationBonusBalance?.toLocaleString()}</Descriptions.Item>
                    </Descriptions>
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
