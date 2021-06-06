import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./StationSaleList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Select
} from "antd";
import {
    FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetStationSaleRequest from "../../handlers/get/GetStationSaleRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import StationSaleColumns from "./StationSaleColumns";
import StationSaleStore from "../../stores/StationSaleStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import CarTypeOfFuels from "../../../../app/constants/CarTypeOfFuels";

const { Panel } = Collapse;

interface StationSaleListProps {
    stationSaleStore?: StationSaleStore
}

const StationSaleList: React.FC<StationSaleListProps> = inject(Stores.stationSaleStore)(observer(({stationSaleStore}) => {

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
    StationSaleColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });

    const columns: any[] = [...StationSaleColumns];

    CarTypeOfFuels.forEach(w =>{ w.title = i18next.t(w.title) });
    const carTypeOfFuelOptions = [...CarTypeOfFuels];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        stationSaleStore.onStationSaleGetPageLoad();
        stationSaleStore.getStationSaleViewModel.getStationSalesRequest = new GetStationSaleRequest();
        stationSaleStore.getStationSaleViewModel.getStationSalesRequest.pageSize = 20;
        stationSaleStore.getStationSaleViewModel.getStationSalesRequest.pageIndex = 0;
        if(UserContext.info.role == 10){
            stationSaleStore.getStationSaleViewModel.getStationSalesRequest.stationWorkerId = UserContext.info.id;
        }

        await stationSaleStore.getStationSaleViewModel.getAllStationSale(stationSaleStore.getStationSaleViewModel.getStationSalesRequest);
    }

    let viewModel = stationSaleStore.getStationSaleViewModel;

    if (!viewModel) return;

    function onUnload() {
        stationSaleStore.onStationSaleGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getStationSalesRequest.pageSize = pageSize;
        viewModel.getStationSalesRequest.pageIndex = pageIndex - 1;
        await stationSaleStore.getStationSaleViewModel.getAllStationSale(viewModel.getStationSalesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getStationSalesRequest.pageSize = pageSize;
        viewModel.getStationSalesRequest.pageIndex = 0;
        await stationSaleStore.getStationSaleViewModel.getAllStationSale(viewModel.getStationSalesRequest);
    }
    function onChanged(e){
        viewModel.getStationSalesRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getStationSalesRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getStationSalesRequest.pageIndex = 0;
        await viewModel.getAllStationSale(viewModel.getStationSalesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getStationSalesRequest.pageSize;
        viewModel.getStationSalesRequest = new GetStationSaleRequest();
        viewModel.getStationSalesRequest.pageIndex = 0;
        viewModel.getStationSalesRequest.pageSize = pageSize;
        if(UserContext.info.role == 10){
            stationSaleStore.getStationSaleViewModel.getStationSalesRequest.stationWorkerId = UserContext.info.id;
        }
        await viewModel.getAllStationSale(viewModel.getStationSalesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        await viewModel.getAllStationSale(viewModel.getStationSalesRequest, true);
        ExportExcel(columns, viewModel?.stationSaleExport, "StationSale");
    }
    function onSelectChanged(e, propName){
        viewModel.getStationSalesRequest[`${propName}`] = e;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("StationSales.Page.Title")}
                subTitle={i18next.t("StationSales.Page.SubTitle")}
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
                                    <Form.Item name="stationWorkerFname" initialValue={viewModel?.getStationSalesRequest?.stationWorkerFname}
                                               key={"stationWorkerFname"}
                                               label={i18next.t("StationSales.SearchPanel.Label.stationWorkerFname")}>
                                        <Input onChange={onChanged}/>
                                    </Form.Item>
                                </Col>: ""}
                            <Col span={8}>
                                <Form.Item name="invoiceFuelType" initialValue={viewModel?.getStationSalesRequest?.invoiceFuelType}
                                           key={"invoiceFuelType"}
                                           label={i18next.t("StationSales.SearchPanel.Label.invoiceFuelType")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select options={carTypeOfFuelOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "invoiceFuelType")} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeFrom" initialValue={viewModel?.getStationSalesRequest?.invoiceDataTimeFrom}
                                           key={"invoiceDataTimeFrom"}
                                           label={i18next.t("StationSales.SearchPanel.Label.invoiceDataTimeFrom")}>
                                    <DatePicker format={'DD/MM/yyyy'} onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeTo" initialValue={viewModel?.getStationSalesRequest?.invoiceDataTimeTo}
                                           key={"invoiceDataTimeTo"}
                                           label={i18next.t("StationSales.SearchPanel.Label.invoiceDataTimeTo")}>
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
            <Table dataSource={viewModel?.stationSaleList} columns={columns} loading={viewModel?.isProcessing}
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


export default StationSaleList;


