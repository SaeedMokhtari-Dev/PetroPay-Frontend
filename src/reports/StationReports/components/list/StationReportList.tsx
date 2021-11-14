import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./StationReportList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Alert, Select
} from "antd";
import {
    FolderViewOutlined,
    FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetStationReportRequest from "../../handlers/get/GetStationReportRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import StationReportColumns from "./StationReportColumns";
import StationReportStore from "../../stores/StationReportStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import {ReactComponent} from "*.svg";

const { Panel } = Collapse;
const { Option } = Select;

interface StationReportListProps {
    stationReportStore?: StationReportStore
}

const StationReportList: React.FC<StationReportListProps> = inject(Stores.stationReportStore)(observer(({stationReportStore}) => {

    const [petroStationOptions, setPetroStationOptions] = React.useState([]);
    const [stationUserOptions, setStationUserOptions] = React.useState([]);

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
    StationReportColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });

    const columns: any[] = [...StationReportColumns,
        {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                <Link to={`/app/invoiceDetail/${record.invoiceId}`}>
                    <Button type="default"  icon={<FolderViewOutlined />}
                            title={i18next.t("StationReports.Button.InvoiceDetail")} style={{ background: "green", borderColor: "white" }}/>
                </Link>
            </div>
        )
    }];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        stationReportStore.onStationReportGetPageLoad();
        stationReportStore.getStationReportViewModel.getStationReportsRequest = new GetStationReportRequest();
        stationReportStore.getStationReportViewModel.getStationReportsRequest.pageSize = 20;
        stationReportStore.getStationReportViewModel.getStationReportsRequest.pageIndex = 0;
        if(UserContext.info.role == 10){
            stationReportStore.getStationReportViewModel.getStationReportsRequest.stationId = UserContext.info.id;
        }

        try {
            await stationReportStore.listPetroStationViewModel.getPetroStationList();
            let petroStationOptions = [];
            if (stationReportStore.listPetroStationViewModel) {
                for (let item of stationReportStore.listPetroStationViewModel.listPetroStationResponse.items) {
                    petroStationOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                }
            }
            setPetroStationOptions(petroStationOptions);

            await stationReportStore.listStationUserViewModel.getStationUserList();
            let stationUserOptions = [];
            if (stationReportStore.listStationUserViewModel) {
                if(stationReportStore.listStationUserViewModel.listStationUserResponse.items) {
                    let items = stationReportStore.listStationUserViewModel.listStationUserResponse.items;
                    if(UserContext.info.role === 10)
                        items = items.filter(w => w.stationId === UserContext.info.id);
                    for (let item of items) {
                        stationUserOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
            }
            setStationUserOptions(stationUserOptions);
        }
        catch {

        }

        //await stationReportStore.getStationReportViewModel.getAllStationReport(stationReportStore.getStationReportViewModel.getStationReportsRequest);
    }

    let viewModel = stationReportStore.getStationReportViewModel;

    if (!viewModel) return;

    function onUnload() {
        stationReportStore.onStationReportGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getStationReportsRequest.pageSize = pageSize;
        viewModel.getStationReportsRequest.pageIndex = pageIndex - 1;
        await stationReportStore.getStationReportViewModel.getAllStationReport(viewModel.getStationReportsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getStationReportsRequest.pageSize = pageSize;
        viewModel.getStationReportsRequest.pageIndex = 0;
        await stationReportStore.getStationReportViewModel.getAllStationReport(viewModel.getStationReportsRequest);
    }
    function onChanged(e){
        viewModel.getStationReportsRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getStationReportsRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getStationReportsRequest.pageIndex = 0;
        await viewModel.getAllStationReport(viewModel.getStationReportsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getStationReportsRequest.pageSize;
        viewModel.getStationReportsRequest = new GetStationReportRequest();
        viewModel.getStationReportsRequest.pageIndex = 0;
        viewModel.getStationReportsRequest.pageSize = pageSize;
        if(UserContext.info.role == 10){
            stationReportStore.getStationReportViewModel.getStationReportsRequest.stationId = UserContext.info.id;
        }
        await viewModel.getAllStationReport(viewModel.getStationReportsRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.stationReportExport = [];
        await viewModel.getAllStationReport(viewModel.getStationReportsRequest, true);
        if(viewModel?.stationReportExport && viewModel?.stationReportExport.length > 0) {
            columns.pop();
            ExportExcel(columns, viewModel?.stationReportExport, "StationReport");
        }
    }
    function onSelectChanged(e, propName){
        viewModel.getStationReportsRequest[`${propName}`] = e;

        if(propName === "stationId") {
            const filteredStationUsers = stationReportStore.listStationUserViewModel.listStationUserResponse.items.filter(w => w.stationId == e);
            let stationUserOptions = [];
            if (stationReportStore.listStationUserViewModel) {
                for (let item of filteredStationUsers) {
                    stationUserOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                }
            }
            setStationUserOptions(stationUserOptions);
        }
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("StationReports.Page.Title")}
                subTitle={i18next.t("StationReports.Page.SubTitle")}
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
                            {UserContext.info.role == 100 ?
                                <React.Fragment>
                                <Col span={8}>
                                    <Form.Item name="stationWorkerId"
                                               key={"stationWorkerId"}
                                               label={i18next.t("StationReports.SearchPanel.Label.stationWorkerId")}>
                                        <Select style={{width: "100%", display:"block"}} allowClear={true}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "stationId")}>
                                            {petroStationOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                </React.Fragment>: "" }
                            <Col span={8}>
                                <Form.Item name="stationWorkerFname"
                                           key={"stationWorkerFname"}
                                           label={i18next.t("StationSales.SearchPanel.Label.stationWorkerFname")}>
                                    <Select style={{width: "100%", display:"block"}} allowClear={true}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "stationWorkerId")}>
                                        {stationUserOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceId" initialValue={viewModel?.getStationReportsRequest?.invoiceId}
                                           key={"invoiceId"}
                                           label={i18next.t("StationReports.SearchPanel.Label.invoiceId")}>
                                    <Input type={"number"} onChange={onChanged}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="serviceArDescription" initialValue={viewModel?.getStationReportsRequest?.serviceArDescription}
                                           key={"serviceArDescription"}
                                           label={i18next.t("StationReports.SearchPanel.Label.serviceArDescription")}>
                                    <Input onChange={onChanged}/>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeFrom" initialValue={viewModel?.getStationReportsRequest?.invoiceDataTimeFrom}
                                           key={"invoiceDataTimeFrom"}
                                           label={i18next.t("StationReports.SearchPanel.Label.invoiceDataTimeFrom")}>
                                    <DatePicker showTime={true} onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeTo" initialValue={viewModel?.getStationReportsRequest?.invoiceDataTimeTo}
                                           key={"invoiceDataTimeTo"}
                                           label={i18next.t("StationReports.SearchPanel.Label.invoiceDataTimeTo")}>
                                    <DatePicker showTime={true} onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeTo"))} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="paymentMethodName" initialValue={viewModel?.getStationReportsRequest?.paymentMethodName}
                                           key={"paymentMethodName"}
                                           label={i18next.t("StationReports.SearchPanel.Label.paymentMethodName")}>
                                    <Input onChange={onChanged}/>
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
            <Table dataSource={viewModel?.stationReportList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky
                   summary={() => (
                       <Table.Summary.Row>
                           <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={4} index={1}></Table.Summary.Cell>
                           <Table.Summary.Cell index={5}>{viewModel?.sumInvoiceAmount?.toLocaleString()}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={3} index={6}></Table.Summary.Cell>
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


export default StationReportList;


