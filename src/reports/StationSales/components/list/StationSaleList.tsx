import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./StationSaleList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Select, Alert
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
const { Option } = Select;

interface StationSaleListProps {
    stationSaleStore?: StationSaleStore
}

const StationSaleList: React.FC<StationSaleListProps> = inject(Stores.stationSaleStore)(observer(({stationSaleStore}) => {

    const [petroStationOptions, setPetroStationOptions] = React.useState([]);
    const [stationUserOptions, setStationUserOptions] = React.useState([]);
    const [invoiceFuelTypesOptions, setInvoiceFuelTypeOptions] = React.useState([]);

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
        if(UserContext.info.role === 10){
            stationSaleStore.getStationSaleViewModel.getStationSalesRequest.companyId = UserContext.info.id;
        }
        if(UserContext.info.role === 15){
            stationSaleStore.getStationSaleViewModel.getStationSalesRequest.stationId = UserContext.info.id;
        }

        try {
            if([10, 100].includes(UserContext.info.role)) {
                await stationSaleStore.listPetroStationViewModel.getPetroStationList(stationSaleStore.getStationSaleViewModel.getStationSalesRequest.companyId);
                let petroStationOptions = [];
                if (stationSaleStore.listPetroStationViewModel) {
                    for (let item of stationSaleStore.listPetroStationViewModel.listPetroStationResponse.items) {
                        petroStationOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setPetroStationOptions(petroStationOptions);
            }

            await stationSaleStore.listStationUserViewModel.getStationUserList(stationSaleStore.getStationSaleViewModel.getStationSalesRequest.stationId);
            let stationUserOptions = [];
            if (stationSaleStore.listStationUserViewModel) {
                if(stationSaleStore.listStationUserViewModel.listStationUserResponse.items) {
                    let items = stationSaleStore.listStationUserViewModel.listStationUserResponse.items;
                    if(UserContext.info.role === 10)
                        items = items.filter(w => w.stationId === UserContext.info.id);
                    for (let item of items) {
                        stationUserOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
            }
            setStationUserOptions(stationUserOptions);

            await stationSaleStore.listPetrolPriceViewModel.getPetrolPriceList();
            let invoiceFuelTypesOptions = [];
            if (stationSaleStore.listPetrolPriceViewModel) {
                if(stationSaleStore.listPetrolPriceViewModel.listPetrolPriceResponse.items) {
                    let items = stationSaleStore.listPetrolPriceViewModel.listPetrolPriceResponse.items;
                    for (let item of items) {
                        invoiceFuelTypesOptions.push(<Option key={item.key} value={item.petrolPriceType}>{item.petrolPriceType}</Option>);
                    }
                }
            }
            setInvoiceFuelTypeOptions(invoiceFuelTypesOptions);
        }
        catch {

        }
        //await stationSaleStore.getStationSaleViewModel.getAllStationSale(stationSaleStore.getStationSaleViewModel.getStationSalesRequest);
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
            stationSaleStore.getStationSaleViewModel.getStationSalesRequest.stationId = UserContext.info.id;
        }
        await viewModel.getAllStationSale(viewModel.getStationSalesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.stationSaleExport = [];
        await viewModel.getAllStationSale(viewModel.getStationSalesRequest, true);
        if(viewModel.stationSaleExport && viewModel.stationSaleExport?.length > 0)
            ExportExcel(columns, viewModel?.stationSaleExport, "StationSale");
    }
    function onSelectChanged(e, propName){
        viewModel.getStationSalesRequest[`${propName}`] = e;

        if(propName === "stationId") {
            const filteredStationUsers = stationSaleStore.listStationUserViewModel.listStationUserResponse.items.filter(w => w.stationId == e);
            let stationUserOptions = [];
            if (stationSaleStore.listStationUserViewModel) {
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
                title={i18next.t("StationSales.Page.Title")}
                subTitle={i18next.t("StationSales.Page.SubTitle")}
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
                                <React.Fragment>
                                <Col span={8}>
                                    <Form.Item name="stationWorkerId"
                                               key={"stationWorkerId"}
                                               label={i18next.t("StationSales.SearchPanel.Label.stationWorkerId")}>
                                        <Select style={{width: "100%", display:"block"}} allowClear={true}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "stationId")}>
                                            {petroStationOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                </React.Fragment>: ""}
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
                                <Form.Item name="invoiceFuelType" initialValue={viewModel?.getStationSalesRequest?.invoiceFuelType}
                                           key={"invoiceFuelType"}
                                           label={i18next.t("StationSales.SearchPanel.Label.invoiceFuelType")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select showSearch={true} onChange={(e) => onSelectChanged(e, "invoiceFuelType")} >
                                        {invoiceFuelTypesOptions}
                                    </Select>
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
            <Table dataSource={viewModel?.stationSaleList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky
                   summary={() => (
                       <Table.Summary.Row>
                           <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                           <Table.Summary.Cell index={5}>{viewModel?.sumInvoiceAmount?.toLocaleString()}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={3} index={6}></Table.Summary.Cell>
                           <Table.Summary.Cell index={6}>{viewModel?.sumInvoiceBonusPoints?.toLocaleString()}</Table.Summary.Cell>
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


export default StationSaleList;


