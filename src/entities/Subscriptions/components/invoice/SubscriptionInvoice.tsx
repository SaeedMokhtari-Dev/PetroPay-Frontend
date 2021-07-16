import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import "./SubscriptionInvoice.scss";
import Stores from "app/constants/Stores";

import {
    Col, Descriptions, Image,
    PageHeader, Row, Spin, Statistic
} from "antd";
import i18next from "i18next";
import SubscriptionStore from 'entities/Subscriptions/stores/SubscriptionStore';
import NavigationService from "../../../../app/services/NavigationService";
import ImageConstants from "../../../../app/constants/ImageConstants";

interface SubscriptionInvoiceProps {
    subscriptionStore?: SubscriptionStore
    match?: any;
}

const SubscriptionInvoice: React.FC<SubscriptionInvoiceProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore, match}) => {
    const [dataFetched, setDataFetched] = React.useState(false);

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        subscriptionStore.onSubscriptionInvoicePageLoad();
        debugger;
        let invoiceIdParam = +match.params?.invoiceNumber;
        if(invoiceIdParam){
            subscriptionStore.invoiceSubscriptionViewModel?.getInvoiceSubscription(invoiceIdParam);
        }
        else {
            NavigationService.goBack();
        }
        setDataFetched(true);
    }

    let viewModel = subscriptionStore.invoiceSubscriptionViewModel;

    if (!viewModel) return;

    function onUnload() {
        subscriptionStore.onSubscriptionInvoicePageUnload();
        //subscriptionStore.onSubscriptionEditPageUnload();
    }
    return (
        <div>
            {/*<PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Subscriptions.Page.Title")}
                subTitle={i18next.t("Subscriptions.Page.SubTitle")}
            />*/}
            {dataFetched ?
                <React.Fragment>
                    <Row gutter={[24, 16]}>
                        <Col offset={8} span={12}>
                            <h1>{i18next.t("Subscriptions.Invoice.Page.Title")}</h1>
                        </Col>
                        <Col span={8}>
                            <Statistic title={i18next.t("Subscriptions.Invoice.Label.invoiceNumber")} value={`${viewModel.invoiceSubscriptionResponse?.invoiceNumber} `} />
                        </Col>
                        <Col span={8}>
                            <Statistic title={i18next.t("Subscriptions.Invoice.Label.dateOfIssue")} value={viewModel.invoiceSubscriptionResponse?.dateOfIssue} />
                        </Col>
                        <Col span={8}>
                            <Image width={150} src={viewModel.invoiceSubscriptionResponse?.companyLogo} fallback={ImageConstants.fallbackImage} />
                        </Col>
                        <Col span={12}>
                            <Descriptions title={i18next.t("Subscriptions.Invoice.Label.billedTo")} bordered>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.customerName")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.customerName}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.customerAddress")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.customerAddress}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={12}>
                            <Descriptions title={i18next.t("Subscriptions.Invoice.Label.companyInfo")} bordered>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.companyName")} span={3}>
                                    {localStorage.getItem("currentLanguage") === 'en' ? viewModel.invoiceSubscriptionResponse?.companyNameEn : viewModel.invoiceSubscriptionResponse?.companyNameAr }
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.companyAddress")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.companyAddress}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.companyTaxRecordNumber")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.companyTaxRecordNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.companyCommercialRecordNumber")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.companyCommercialRecordNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.companyEmail")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.companyEmail}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.companyWebsite")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.companyWebsite}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={24}>
                            <table id={"myTable"}>
                                <thead>
                                <tr>
                                    <th>
                                        {i18next.t("Subscriptions.Invoice.Label.serviceDescription")}
                                    </th>
                                    <th>
                                        {i18next.t("Subscriptions.Invoice.Label.unitCost")}
                                    </th>
                                    <th>
                                        {i18next.t("Subscriptions.Invoice.Label.quantity")}
                                    </th>
                                    <th>
                                        {i18next.t("Subscriptions.Invoice.Label.amount")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {viewModel.invoiceSubscriptionResponse?.serviceDescription ?? "Service Description"}
                                        </td>
                                        <td>
                                            {viewModel.invoiceSubscriptionResponse?.unitCost} {i18next.t("General.Currency.Symbol")}
                                        </td>
                                        <td>
                                            {viewModel.invoiceSubscriptionResponse?.quantity}
                                        </td>
                                        <td>
                                            {viewModel.invoiceSubscriptionResponse?.amount} {i18next.t("General.Currency.Symbol")}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col span={12}>
                            <Descriptions bordered>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.serviceStartDate")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.serviceStartDate}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.serviceEndDate")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.serviceEndDate}
                                </Descriptions.Item>
                            </Descriptions>
                            <br/>
                            <Statistic valueStyle={{ color: "blue", fontSize: "40px" }} title={i18next.t("Subscriptions.Invoice.Label.invoiceTotal")}
                                       suffix={i18next.t("General.Currency.Symbol")} value={viewModel.invoiceSubscriptionResponse?.total} />
                        </Col>
                        <Col offset={3} span={8}>
                            <Descriptions title={i18next.t("Subscriptions.Invoice")} bordered>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.subTotal")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.subTotal}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.discount")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.discount}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.taxRate")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.taxRate} %
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.tax")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.tax}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.vatRate")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.vatRate} %
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.vat")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.vat}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.total")} span={3}>
                                    {viewModel.invoiceSubscriptionResponse?.total}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
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


export default SubscriptionInvoice;


