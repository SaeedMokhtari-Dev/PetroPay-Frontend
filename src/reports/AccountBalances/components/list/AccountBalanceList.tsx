import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./AccountBalanceList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker
} from "antd";
import {
    FileExcelOutlined,

} from '@ant-design/icons';
import i18next from "i18next";
import GetAccountBalanceRequest from "../../handlers/get/GetAccountBalanceRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import AccountBalanceColumns from "./AccountBalanceColumns";
import AccountBalanceStore from "../../stores/AccountBalanceStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import CarTransactionColumns from "../../../CarTransactions/components/list/CarTransactionColumns";


const { Panel } = Collapse;

interface AccountBalanceListProps {
    accountBalanceStore?: AccountBalanceStore
}

const AccountBalanceList: React.FC<AccountBalanceListProps> = inject(Stores.accountBalanceStore)(observer(({accountBalanceStore}) => {

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
    };
    const [form] = Form.useForm();
    AccountBalanceColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });

    const columns: any[] = [...AccountBalanceColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        accountBalanceStore.onAccountBalanceGetPageLoad();
        accountBalanceStore.getAccountBalanceViewModel.getAccountBalancesRequest = new GetAccountBalanceRequest();
        accountBalanceStore.getAccountBalanceViewModel.getAccountBalancesRequest.pageSize = 20;
        accountBalanceStore.getAccountBalanceViewModel.getAccountBalancesRequest.pageIndex = 0;
        /*if(UserContext.info.role == 1){
            accountBalanceStore.getAccountBalanceViewModel.getAccountBalancesRequest.companyId = UserContext.info.id;
        }*/

        await accountBalanceStore.getAccountBalanceViewModel.getAllAccountBalance(accountBalanceStore.getAccountBalanceViewModel.getAccountBalancesRequest);
    }

    let viewModel = accountBalanceStore.getAccountBalanceViewModel;

    if (!viewModel) return;

    function onUnload() {
        accountBalanceStore.onAccountBalanceGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getAccountBalancesRequest.pageSize = pageSize;
        viewModel.getAccountBalancesRequest.pageIndex = pageIndex - 1;
        await accountBalanceStore.getAccountBalanceViewModel.getAllAccountBalance(viewModel.getAccountBalancesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getAccountBalancesRequest.pageSize = pageSize;
        viewModel.getAccountBalancesRequest.pageIndex = 0;
        await accountBalanceStore.getAccountBalanceViewModel.getAllAccountBalance(viewModel.getAccountBalancesRequest);
    }
    function onChanged(e){
        viewModel.getAccountBalancesRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getAccountBalancesRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getAccountBalancesRequest.pageIndex = 0;
        await viewModel.getAllAccountBalance(viewModel.getAccountBalancesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getAccountBalancesRequest.pageSize;
        viewModel.getAccountBalancesRequest = new GetAccountBalanceRequest();
        viewModel.getAccountBalancesRequest.pageIndex = 0;
        viewModel.getAccountBalancesRequest.pageSize = pageSize;
        /*if(UserContext.info.role == 1){
            accountBalanceStore.getAccountBalanceViewModel.getAccountBalancesRequest.companyId = UserContext.info.id;
        }*/
        await viewModel.getAllAccountBalance(viewModel.getAccountBalancesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.accountBalanceExport = [];
        await viewModel.getAllAccountBalance(viewModel.getAccountBalancesRequest, true);
        if(viewModel?.accountBalanceExport && viewModel?.accountBalanceExport?.length > 0)
            ExportExcel(columns, viewModel?.accountBalanceExport, "AccountBalance");
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("AccountBalances.Page.Title")}
                subTitle={i18next.t("AccountBalances.Page.SubTitle")}
                extra={[
                    <Button key={"ExportExcel"} type="primary" loading={viewModel?.isProcessing} icon={<FileExcelOutlined />} onClick={ExportToExcel}>
                        {i18next.t("General.Button.ExportExcel")}
                    </Button>
                    ,
                ]}
            />

            {/*<Collapse>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        <Row gutter={[24, 16]}>
                            {UserContext.info.role == 100 ?
                                <Col span={8}>
                                    <Form.Item name="companyName" initialValue={viewModel?.getAccountBalancesRequest?.companyName}
                                               key={"companyName"}
                                               label={i18next.t("AccountBalances.SearchPanel.Label.companyName")}>
                                        <Input onChange={onChanged}/>
                                    </Form.Item>
                                </Col>: ""}
                            <Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getAccountBalancesRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("AccountBalances.SearchPanel.Label.companyBranchName")}>
                                    <Input onChange={onChanged}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="carIdNumber" initialValue={viewModel?.getAccountBalancesRequest?.carIdNumber}
                                           key={"carIdNumber"}
                                           label={i18next.t("AccountBalances.SearchPanel.Label.carIdNumber")}>
                                    <Input onChange={onChanged}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="serviceDescription" initialValue={viewModel?.getAccountBalancesRequest?.serviceDescription}
                                           key={"serviceDescription"}
                                           label={i18next.t("AccountBalances.SearchPanel.Label.serviceDescription")}>
                                    <Input onChange={onChanged}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeFrom" initialValue={viewModel?.getAccountBalancesRequest?.invoiceDataTimeFrom}
                                           key={"invoiceDataTimeFrom"}
                                           label={i18next.t("AccountBalances.SearchPanel.Label.invoiceDataTimeFrom")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeTo" initialValue={viewModel?.getAccountBalancesRequest?.invoiceDataTimeTo}
                                           key={"invoiceDataTimeTo"}
                                           label={i18next.t("AccountBalances.SearchPanel.Label.invoiceDataTimeTo")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeTo"))} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <PageHeader
                            ghost={false}
                            extra={[
                                <Button type="primary" loading={viewModel.isProcessing} onClick={onReset} danger key="reset" size={"large"} htmlType="reset">
                                    {i18next.t("General.SearchPanel.ResetButton")}
                                </Button>,
                                <Button type="primary" loading={viewModel.isProcessing} key="submit" size={"large"} htmlType="submit">
                                    {i18next.t("General.SearchPanel.SearchButton")}
                                </Button>
                            ]}
                        />
                    </Form>
                </Panel>
            </Collapse>
            <br/>*/}
            <Table dataSource={viewModel?.accountBalanceList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky />
            <br/>
            <Pagination
                total={viewModel?.totalSize}
                showSizeChanger
                showQuickJumper
                defaultPageSize={20}
                onChange={pageIndexChanged}
                onShowSizeChange={pageSizeChanged}
                showTotal={total => `Total ${total} items`}
            />
        </div>
    )
}));


export default AccountBalanceList;


