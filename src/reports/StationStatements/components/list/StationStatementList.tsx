import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./StationStatementList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Alert, Select
} from "antd";
import {
    FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetStationStatementRequest from "../../handlers/get/GetStationStatementRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import StationStatementColumns from "./StationStatementColumns";
import StationStatementStore from "../../stores/StationStatementStore";
import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;
const { Option } = Select;

interface StationStatementListProps {
    stationStatementStore?: StationStatementStore
}

const StationStatementList: React.FC<StationStatementListProps> = inject(Stores.stationStatementStore)(observer(({stationStatementStore}) => {

    const [petroStationOptions, setPetroStationOptions] = React.useState([]);

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
        if(UserContext.info.role === 10){
            stationStatementStore.getStationStatementViewModel.getStationStatementsRequest.companyId = UserContext.info.id;
        }
        if(UserContext.info.role === 15){
            stationStatementStore.getStationStatementViewModel.getStationStatementsRequest.stationId = UserContext.info.id;
        }

        try {
            if([10, 100].includes(UserContext.info.role)) {
                await stationStatementStore.listPetroStationViewModel.getPetroStationList(stationStatementStore.getStationStatementViewModel.getStationStatementsRequest.companyId);
                let petroStationOptions = [];
                if (stationStatementStore.listPetroStationViewModel) {
                    for (let item of stationStatementStore.listPetroStationViewModel.listPetroStationResponse.items) {
                        petroStationOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setPetroStationOptions(petroStationOptions);
            }
        }
        catch {

        }
        //await stationStatementStore.getStationStatementViewModel.getAllStationStatement(stationStatementStore.getStationStatementViewModel.getStationStatementsRequest);
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
    async function ExportToExcel(){
        viewModel.stationStatementExport = [];
        await viewModel.getAllStationStatement(viewModel.getStationStatementsRequest, true);
        if(viewModel.stationStatementExport && viewModel.stationStatementExport?.length > 0)
            ExportExcel(columns, viewModel?.stationStatementExport, "StationStatement");
    }
    function onSelectChanged(e, propName){
        viewModel.getStationStatementsRequest[`${propName}`] = e;
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("StationStatements.Page.Title")}
                subTitle={i18next.t("StationStatements.Page.SubTitle")}
                extra={[
                    <Button key={"ExportExcel"} type="primary" loading={viewModel?.isProcessing} icon={<FileExcelOutlined />} onClick={ExportToExcel}>
                        {i18next.t("General.Button.ExportExcel")}
                    </Button>
                    ,
                ]}
            />

            <Collapse defaultActiveKey={['1']}>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        <Row gutter={[24, 16]}>
                            {[10, 100].includes(UserContext.info.role) ?
                                <Col span={8}>
                                    <Form.Item name="stationId" initialValue={viewModel?.getStationStatementsRequest?.stationId}
                                               key={"stationId"}
                                               label={i18next.t("StationStatements.SearchPanel.Label.stationId")}>
                                        <Select style={{width: "100%", display:"block"}} allowClear={true}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "stationId")}>
                                            {petroStationOptions}
                                        </Select>
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
            <br/>
            <Table dataSource={viewModel?.stationStatementList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky
                   summary={() => (
                       <Table.Summary.Row>
                           <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={3} index={1}></Table.Summary.Cell>
                           <Table.Summary.Cell index={5}>{viewModel?.sumTransAmount?.toLocaleString()}</Table.Summary.Cell>
                           <Table.Summary.Cell index={6}></Table.Summary.Cell>
                       </Table.Summary.Row>
                   )}/>
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


