import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./StationReportList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker
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

const { Panel } = Collapse;

interface StationReportListProps {
    stationReportStore?: StationReportStore
}

const StationReportList: React.FC<StationReportListProps> = inject(Stores.stationReportStore)(observer(({stationReportStore}) => {

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
                <Link to={`/app/invoiceDetail/${record.key}`}>
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
            stationReportStore.getStationReportViewModel.getStationReportsRequest.stationWorkerId = UserContext.info.id;
        }

        await stationReportStore.getStationReportViewModel.getAllStationReport(stationReportStore.getStationReportViewModel.getStationReportsRequest);
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
            stationReportStore.getStationReportViewModel.getStationReportsRequest.stationWorkerId = UserContext.info.id;
        }
        await viewModel.getAllStationReport(viewModel.getStationReportsRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        await viewModel.getAllStationReport(viewModel.getStationReportsRequest, true);
        columns.pop();
        ExportExcel(columns, viewModel?.stationReportExport, "StationReport");
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

            <Collapse>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        <Row gutter={[24, 16]}>
                            {UserContext.info.role == 100 ?
                                <Col span={8}>
                                    <Form.Item name="stationWorkerFname" initialValue={viewModel?.getStationReportsRequest?.stationWorkerFname}
                                               key={"stationWorkerFname"}
                                               label={i18next.t("StationReports.SearchPanel.Label.stationWorkerFname")}>
                                        <Input onChange={onChanged}/>
                                    </Form.Item>
                                </Col>: ""}
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
            <Table dataSource={viewModel?.stationReportList} columns={columns} loading={viewModel?.isProcessing}
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


export default StationReportList;


