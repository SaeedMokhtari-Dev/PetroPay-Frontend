import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./StationStatementList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker
} from "antd";
import {
    FolderViewOutlined,
    PlusCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetStationStatementRequest from "../../handlers/get/GetStationStatementRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import StationStatementColumns from "./StationStatementColumns";
import StationStatementStore from "../../stores/StationStatementStore";

const { Panel } = Collapse;

interface StationStatementListProps {
    stationStatementStore?: StationStatementStore
}

const StationStatementList: React.FC<StationStatementListProps> = inject(Stores.stationStatementStore)(observer(({stationStatementStore}) => {

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
    StationStatementColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });

    const columns: any[] = [...StationStatementColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        stationStatementStore.onStationStatementGetPageLoad();
        stationStatementStore.getStationStatementViewModel.getStationStatementsRequest = new GetStationStatementRequest();
        stationStatementStore.getStationStatementViewModel.getStationStatementsRequest.pageSize = 20;
        stationStatementStore.getStationStatementViewModel.getStationStatementsRequest.pageIndex = 0;
        if(UserContext.info.role == 10){
            stationStatementStore.getStationStatementViewModel.getStationStatementsRequest.stationId = UserContext.info.id;
        }

        await stationStatementStore.getStationStatementViewModel.getAllStationStatement(stationStatementStore.getStationStatementViewModel.getStationStatementsRequest);
    }

    let viewModel = stationStatementStore.getStationStatementViewModel;

    if (!viewModel) return;

    function onUnload() {
        stationStatementStore.onStationStatementGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getStationStatementsRequest.pageSize = pageSize;
        viewModel.getStationStatementsRequest.pageIndex = pageIndex - 1;
        await stationStatementStore.getStationStatementViewModel.getAllStationStatement(viewModel.getStationStatementsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getStationStatementsRequest.pageSize = pageSize;
        viewModel.getStationStatementsRequest.pageIndex = 0;
        await stationStatementStore.getStationStatementViewModel.getAllStationStatement(viewModel.getStationStatementsRequest);
    }
    function onChanged(e){
        viewModel.getStationStatementsRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getStationStatementsRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getStationStatementsRequest.pageIndex = 0;
        await viewModel.getAllStationStatement(viewModel.getStationStatementsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getStationStatementsRequest.pageSize;
        viewModel.getStationStatementsRequest = new GetStationStatementRequest();
        viewModel.getStationStatementsRequest.pageIndex = 0;
        viewModel.getStationStatementsRequest.pageSize = pageSize;
        if(UserContext.info.role == 10){
            stationStatementStore.getStationStatementViewModel.getStationStatementsRequest.stationId = UserContext.info.id;
        }
        await viewModel.getAllStationStatement(viewModel.getStationStatementsRequest);
        form.resetFields();
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("StationStatements.Page.Title")}
                subTitle={i18next.t("StationStatements.Page.SubTitle")}
            />

            <Collapse>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        <Row gutter={[24, 16]}>
                            {UserContext.info.role == 100 ?
                                <Col span={8}>
                                    <Form.Item name="stationName" initialValue={viewModel?.getStationStatementsRequest?.stationName}
                                               key={"stationName"}
                                               label={i18next.t("StationStatements.SearchPanel.Label.stationName")}>
                                        <Input onChange={onChanged}/>
                                    </Form.Item>
                                </Col>: ""}
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeFrom" initialValue={viewModel?.getStationStatementsRequest?.invoiceDataTimeFrom}
                                           key={"invoiceDataTimeFrom"}
                                           label={i18next.t("StationStatements.SearchPanel.Label.invoiceDataTimeFrom")}>
                                    <DatePicker format={'DD/MM/yyyy'} onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeTo" initialValue={viewModel?.getStationStatementsRequest?.invoiceDataTimeTo}
                                           key={"invoiceDataTimeTo"}
                                           label={i18next.t("StationStatements.SearchPanel.Label.invoiceDataTimeTo")}>
                                    <DatePicker format={'DD/MM/yyyy'} onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeTo"))} />
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
            <br/>
            <Table dataSource={viewModel?.stationStatementList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky />
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


export default StationStatementList;


