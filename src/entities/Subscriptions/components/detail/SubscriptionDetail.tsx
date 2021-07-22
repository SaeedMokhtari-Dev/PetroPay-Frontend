import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import "./SubscriptionDetail.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Col, Descriptions, Divider, Image,
    PageHeader, Row, Spin, Statistic
} from "antd";
import {
    CheckOutlined, CloseOutlined,
    PrinterOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import SubscriptionStore from 'entities/Subscriptions/stores/SubscriptionStore';
import NavigationService from "../../../../app/services/NavigationService";
import ImageConstants from "../../../../app/constants/ImageConstants";
import ApiService from "../../../../app/services/ApiService";


interface SubscriptionProps {
    subscriptionStore?: SubscriptionStore
    match?: any;
}

const SubscriptionDetail: React.FC<SubscriptionProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore, match}) => {
    const [dataFetched, setDataFetched] = React.useState(false);

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        subscriptionStore.onSubscriptionEditPageLoad();
        debugger;
        let subscriptionIdParam = +match.params?.subscriptionId;
        if(subscriptionIdParam){
            await subscriptionStore.editSubscriptionViewModel.getDetailSubscription(subscriptionIdParam);
        }
        else {
            NavigationService.goBack();
        }
        setDataFetched(true);
    }

    let viewModel = subscriptionStore.editSubscriptionViewModel;

    if (!viewModel) return;

    function onUnload() {
        subscriptionStore.onSubscriptionEditPageUnload();
        //subscriptionStore.onSubscriptionEditPageUnload();
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Subscriptions.Detail.HeaderText")}
                /*subTitle={i18next.t("Subscriptions.Page.Detail.SubTitle")}*/
            />
            {dataFetched ?
                <React.Fragment>
                    <Row gutter={[24, 16]}>
                        <Col span={24}>
                            <Descriptions bordered>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionId")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionId}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.companyName")}>
                                    {viewModel.detailSubscriptionResponse?.companyName}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.bundlesId")}>
                                    {viewModel.detailSubscriptionResponse?.bundlesId}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionCarNumbers")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionCarNumbers}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionPaymentMethod")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionPaymentMethod}
                                </Descriptions.Item>
                                {/*<Descriptions.Item label={i18next.t("Subscriptions.Label.payFromCompanyBalance")}>
                                    {viewModel.detailSubscriptionResponse?.payFromCompanyBalance ? <CheckOutlined /> : <CloseOutlined />}
                                </Descriptions.Item>*/}
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionType")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionType}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionStartDate")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionStartDate}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.numberOfDateDiff")}>
                                    {viewModel.detailSubscriptionResponse?.numberOfDateDiff}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionEndDate")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionEndDate}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionCost")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionCost}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionActive")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionActive}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.paymentReferenceNumber")}>
                                    {viewModel.detailSubscriptionResponse?.paymentReferenceNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionDate")}>
                                    {viewModel.detailSubscriptionResponse?.subscriptionDate}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.couponCode")}>
                                    {viewModel.detailSubscriptionResponse?.couponCode}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Label.subscriptionPaymentDocPhoto")}>
                                    <Image src={viewModel.detailSubscriptionResponse?.subscriptionPaymentDocPhoto} fallback={ImageConstants.fallbackImage} />
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        {viewModel.detailSubscriptionResponse?.subscriptionCars?.length > 0 &&
                            <React.Fragment>
                            <Divider>{i18next.t("Subscriptions.Label.Cars")}</Divider>
                            <table id={"myTable"}>
                                <thead>
                                <tr>
                                    <th>
                                        {i18next.t("Subscriptions.Label.branchName")}
                                    </th>
                                    <th>
                                        {i18next.t("Subscriptions.Label.carId")}
                                    </th>
                                    <th>
                                        {i18next.t("Subscriptions.Label.carNumber")}
                                    </th>
                                    <th>
                                        {i18next.t("Subscriptions.Label.invoiced")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {viewModel.detailSubscriptionResponse?.subscriptionCars?.map((item, index) => {
                                    return <tr>
                                        <td>
                                            {item?.branchName}
                                        </td>
                                        <td>
                                            {item?.key}
                                        </td>
                                        <td>
                                            {item?.carIdNumber}
                                        </td>
                                        <td>
                                            {item?.disabled ? <CheckOutlined/> : <CloseOutlined/>}
                                        </td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                            </React.Fragment>
                        }
                    </Row>

                </React.Fragment>
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


export default SubscriptionDetail;


