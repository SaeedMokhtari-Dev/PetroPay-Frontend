import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./TransferBonusList.scss";
import Stores from "app/constants/Stores";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader, Form, Collapse, Row, Col, Select, DatePicker, Alert
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, BranchesOutlined, FileExcelOutlined
} from '@ant-design/icons';
import GetTransferBonusesRequest from "../../handlers/get/GetTransferBonusesRequest";
import i18next from "i18next";
import TransferBonusesColumns from "./TransferBonusColumns";
import Routes from "../../../../app/constants/Routes";
import { Link } from "react-router-dom";
import TransferBonusStore from "../../stores/TransferBonusStore";
import Constants from "../../../../app/constants/Constants";
import GetSubscriptionRequest from "../../../Subscriptions/handlers/get/GetSubscriptionRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;
const { confirm } = Modal;


interface TransferBonusesSidebarProps {
    transferBonusStore?: TransferBonusStore
}

const TransferBonusList: React.FC<TransferBonusesSidebarProps> = inject(Stores.transferBonusStore)(observer(({transferBonusStore}) => {
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

    TransferBonusesColumns.forEach(w => {
        w.title = i18next.t(w.title)
    });
    const columns: any[] = [...TransferBonusesColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        transferBonusStore.onTransferBonusGetPageLoad();
        
        transferBonusStore.getTransferBonusViewModel.getTransferBonusesRequest.pageIndex = 0;
        transferBonusStore.getTransferBonusViewModel.getTransferBonusesRequest.pageSize = 10;
        await transferBonusStore.getTransferBonusViewModel.getAllTransferBonuses(transferBonusStore.getTransferBonusViewModel.getTransferBonusesRequest);
    }

    let viewModel = transferBonusStore.getTransferBonusViewModel;

    if (!viewModel) return;

    function onUnload() {
        transferBonusStore.onTransferBonusGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getTransferBonusesRequest.pageIndex = pageIndex - 1;
        viewModel.getTransferBonusesRequest.pageSize = pageSize;
        await viewModel.getAllTransferBonuses(viewModel.getTransferBonusesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getTransferBonusesRequest.pageIndex = 0;
        viewModel.getTransferBonusesRequest.pageSize = pageSize;
        await viewModel.getAllTransferBonuses(viewModel.getTransferBonusesRequest);
    }
    async function onFinish(values: any) {
        viewModel.getTransferBonusesRequest.pageIndex = 0;
        await viewModel.getAllTransferBonuses(viewModel.getTransferBonusesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getTransferBonusesRequest.pageSize;
        viewModel.getTransferBonusesRequest = new GetTransferBonusesRequest();
        viewModel.getTransferBonusesRequest.pageIndex = 0;
        viewModel.getTransferBonusesRequest.pageSize = pageSize;
        await viewModel.getAllTransferBonuses(viewModel.getTransferBonusesRequest);
        form.resetFields();
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getTransferBonusesRequest[`${prop}`] = dateString;
    }

    async function ExportToExcel(){
        viewModel.transferBonusExport = [];
        /*await viewModel.getAllTransferBonuses(viewModel.getTransferBonusesRequest, true);
        if(viewModel.transferBonusExport && viewModel?.transferBonusExport?.length > 0)
            ExportExcel(columns, viewModel?.transferBonusExport, "transferBonus");*/
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("TransferBonuses.Page.Title")}
                subTitle={i18next.t("TransferBonuses.Page.SubTitle")}
                extra={[
                    <Link to={Routes.addTransferBonus}>
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} >
                            {i18next.t("General.Button.Add")}
                        </Button>
                    </Link>
                    /*<Button key={"ExportExcel"} type="primary" loading={viewModel?.isProcessing}
                            icon={<FileExcelOutlined />} onClick={ExportToExcel}>
                        {i18next.t("General.Button.ExportExcel")}
                    </Button>*/
                ]}
            />
            {/*<Collapse defaultActiveKey={['1']}>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        <Row gutter={[24, 16]}>
                            <Col span={8}>
                                <Form.Item name="dateFrom"
                                           key={"dateFrom"}
                                           label={i18next.t("TransferBonuses.SearchPanel.Label.dateFrom")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTo"
                                           key={"dateTo"}
                                           label={i18next.t("TransferBonuses.SearchPanel.Label.dateTo")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateTo"))} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <PageHeader
                            ghost={false}
                            subTitle={<div>
                                {viewModel?.errorMessage &&
                                <Alert message={viewModel?.errorMessage} type="error" />
                                }
                            </div>}
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
            <Table dataSource={viewModel?.transferBonusList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky/>
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

            {/*<EditTransferBonus />*/}
        </div>
    )
}));


export default TransferBonusList;


