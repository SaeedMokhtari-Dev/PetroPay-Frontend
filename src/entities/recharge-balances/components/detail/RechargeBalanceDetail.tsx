import React, {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import "./RechargeBalanceDetail.scss";
import Stores from "app/constants/Stores";

import {
    Col, Descriptions, Divider, Image,
    PageHeader, Row, Spin
} from "antd";
import {
    CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import NavigationService from "../../../../app/services/NavigationService";
import ImageConstants from "../../../../app/constants/ImageConstants";
import RechargeBalanceStore from "../../stores/RechargeBalanceStore";

interface RechargeBalanceProps {
    rechargeBalanceStore?: RechargeBalanceStore
    match?: any;
}

const RechargeBalanceDetail: React.FC<RechargeBalanceProps> = inject(Stores.rechargeBalanceStore)(observer(({rechargeBalanceStore, match}) => {
    const [dataFetched, setDataFetched] = React.useState(false);

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        rechargeBalanceStore.onRechargeBalanceEditPageLoad();
        let rechargeBalanceIdParam = +match.params?.rechargeBalanceId;
        if(rechargeBalanceIdParam){
            await rechargeBalanceStore.editRechargeBalanceViewModel.getDetailRechargeBalance(rechargeBalanceIdParam);
        }
        else {
            NavigationService.goBack();
        }
        setDataFetched(true);
    }

    let viewModel = rechargeBalanceStore.editRechargeBalanceViewModel;

    if (!viewModel) return;

    function onUnload() {
        rechargeBalanceStore.onRechargeBalanceEditPageUnload();
        //rechargeBalanceStore.onRechargeBalanceEditPageUnload();
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("RechargeBalances.Detail.HeaderText")}
            />
            {dataFetched ?
                    <Row gutter={[24, 16]}>
                        <Col span={24}>
                            <Descriptions bordered>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.rechargeBalanceId")}>
                                    {viewModel.detailRechargeBalanceResponse?.rechargeId}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.companyName")}>
                                    {viewModel.detailRechargeBalanceResponse?.companyName}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.rechageDate")}>
                                    {viewModel.detailRechargeBalanceResponse?.rechageDate}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.rechargeAmount")}>
                                    {viewModel.detailRechargeBalanceResponse?.rechargeAmount?.toFixed(2)}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.rechargePaymentMethod")}>
                                    {viewModel.detailRechargeBalanceResponse?.rechargePaymentMethod}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.bankName")}>
                                    {viewModel.detailRechargeBalanceResponse?.bankName}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.bankTransactionDate")}>
                                    {viewModel.detailRechargeBalanceResponse?.bankTransactionDate}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.transactionPersonName")}>
                                    {viewModel.detailRechargeBalanceResponse?.transactionPersonName}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.rechargeRequstConfirmed")}>
                                    {viewModel.detailRechargeBalanceResponse?.rechargeRequstConfirmed ? <CheckOutlined/> : <CloseOutlined/>}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("RechargeBalances.Label.rechargeDocumentPhoto")}>
                                    <Image src={viewModel.detailRechargeBalanceResponse?.rechargeDocumentPhoto} fallback={ImageConstants.fallbackImage} />
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>

                    </Row>
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


export default RechargeBalanceDetail;


