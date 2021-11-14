import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./CarConsumptionRateList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Select, Alert, Spin
} from "antd";
import {
    FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetCarConsumptionRateRequest from "../../handlers/get/GetCarConsumptionRateRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import CarConsumptionRateColumns from "./CarConsumptionRateColumns";
import CarConsumptionRateStore from "../../stores/CarConsumptionRateStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import Constants from "../../../../app/constants/Constants";

const { Panel } = Collapse;
const { Option } = Select;

interface CarConsumptionRateListProps {
    carConsumptionRateStore?: CarConsumptionRateStore
}

const CarConsumptionRateList: React.FC<CarConsumptionRateListProps> = inject(Stores.carConsumptionRateStore)(observer(({carConsumptionRateStore}) => {

    const [dataFetched, setDataFetched] = React.useState(false);
    const [carOptions, setCarOptions] = React.useState([]);
    const [branchOptions, setBranchOptions] = React.useState([]);
    const [companyOptions, setCompanyOptions] = React.useState([]);

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
    CarConsumptionRateColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    //const companyColumn = {title: i18next.t("CarConsumptionRates.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};

    let columns: any[] = [...CarConsumptionRateColumns];
    /*if(UserContext.info.role == 100)
    {
        columns.unshift(companyColumn);
    }*/

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        carConsumptionRateStore.onCarConsumptionRateGetPageLoad();
        carConsumptionRateStore.getCarConsumptionRateViewModel.getCarConsumptionRatesRequest = new GetCarConsumptionRateRequest();
        carConsumptionRateStore.getCarConsumptionRateViewModel.getCarConsumptionRatesRequest.pageSize = 20;
        carConsumptionRateStore.getCarConsumptionRateViewModel.getCarConsumptionRatesRequest.pageIndex = 0;
        if(UserContext.info.role == 1){
            carConsumptionRateStore.getCarConsumptionRateViewModel.getCarConsumptionRatesRequest.companyId = UserContext.info.id;
        }

        try {
            if (UserContext.info.role === 100) {
                await carConsumptionRateStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (carConsumptionRateStore.listCompanyViewModel) {
                    for (let item of carConsumptionRateStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }

            await carConsumptionRateStore.listBranchViewModel.getBranchList();
            await carConsumptionRateStore.listCarViewModel.getCarList();


            //await carConsumptionRateStore.getCarConsumptionRateViewModel.getAllCarConsumptionRate(carConsumptionRateStore.getCarConsumptionRateViewModel.getCarConsumptionRatesRequest);

            let carOptions = [];
            for (let item of carConsumptionRateStore.listCarViewModel.listCarResponse.items) {
                carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);

            let branchOptions = [];
            for (let item of carConsumptionRateStore.listBranchViewModel.listBranchResponse.items) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);

            setDataFetched(true);
        }
        catch {

        }
    }

    let viewModel = carConsumptionRateStore.getCarConsumptionRateViewModel;

    if (!viewModel) return;

    function onUnload() {
        carConsumptionRateStore.onCarConsumptionRateGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getCarConsumptionRatesRequest.pageSize = pageSize;
        viewModel.getCarConsumptionRatesRequest.pageIndex = pageIndex - 1;
        await carConsumptionRateStore.getCarConsumptionRateViewModel.getAllCarConsumptionRate(viewModel.getCarConsumptionRatesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getCarConsumptionRatesRequest.pageSize = pageSize;
        viewModel.getCarConsumptionRatesRequest.pageIndex = 0;
        await carConsumptionRateStore.getCarConsumptionRateViewModel.getAllCarConsumptionRate(viewModel.getCarConsumptionRatesRequest);
    }
    function onChanged(e){
        viewModel.getCarConsumptionRatesRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getCarConsumptionRatesRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.errorMessage = "";
        viewModel.getCarConsumptionRatesRequest.pageIndex = 0;
        if(viewModel.getCarConsumptionRatesRequest.dateFrom && !viewModel.getCarConsumptionRatesRequest.dateTo)
            viewModel.errorMessage = "Please enter date to";
        if(!viewModel.getCarConsumptionRatesRequest.dateFrom && viewModel.getCarConsumptionRatesRequest.dateTo)
            viewModel.errorMessage = "Please enter date from";
        if(!viewModel.errorMessage)
            await viewModel.getAllCarConsumptionRate(viewModel.getCarConsumptionRatesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getCarConsumptionRatesRequest.pageSize;
        viewModel.getCarConsumptionRatesRequest = new GetCarConsumptionRateRequest();
        viewModel.getCarConsumptionRatesRequest.pageIndex = 0;
        viewModel.getCarConsumptionRatesRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            carConsumptionRateStore.getCarConsumptionRateViewModel.getCarConsumptionRatesRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllCarConsumptionRate(viewModel.getCarConsumptionRatesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.carConsumptionRateExport = [];
        await viewModel.getAllCarConsumptionRate(viewModel.getCarConsumptionRatesRequest, true);
        if(viewModel.carConsumptionRateExport && viewModel?.carConsumptionRateExport?.length > 0)
            ExportExcel(columns, viewModel?.carConsumptionRateExport, "CarConsumptionRate");
    }
    function onSelectChanged(e, propName){
        viewModel.getCarConsumptionRatesRequest[`${propName}`] = e;
        if(propName === "companyId") {
            let carOptions = [];
            const filteredCars = carConsumptionRateStore.listCarViewModel.listCarResponse.items.filter(w => w.companyId == e);
            for (let item of filteredCars) {
                carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);

            let branchOptions = [];
            const filteredBranches = carConsumptionRateStore.listBranchViewModel.listBranchResponse.items.filter(w => w.companyId == e);
            for (let item of filteredBranches) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);
        }
        if(propName === "companyBranchId") {
            let carOptions = [];
            const filteredCars = carConsumptionRateStore.listCarViewModel.listCarResponse.items.filter(w => w.branchId == e);
            for (let item of filteredCars) {
                carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);
        }
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("CarConsumptionRates.Page.Title")}
                subTitle={i18next.t("CarConsumptionRates.Page.SubTitle")}
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
                        {dataFetched ?
                        <Row gutter={[24, 16]}>
                            {UserContext.info.role == 100 ?
                                <Col span={8}>
                                    <Form.Item name="companyId" initialValue={viewModel?.getCarConsumptionRatesRequest?.companyId}
                                               key={"companyId"}
                                               label={i18next.t("CarConsumptionRates.SearchPanel.Label.companyName")}>
                                        {/*<Input onChange={onChanged}/>*/}
                                        <Select style={{width: "100%", display:"block"}} allowClear={true}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                            {companyOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>: ""}
                            <Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getCarConsumptionRatesRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("CarConsumptionRates.SearchPanel.Label.companyBranchName")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}} allowClear={true}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "companyBranchId")}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="carIdNumber" initialValue={viewModel?.getCarConsumptionRatesRequest?.carIdNumber}
                                           key={"carIdNumber"}
                                           label={i18next.t("CarConsumptionRates.SearchPanel.Label.carIdNumber")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}} allowClear={true}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "carIdNumber")}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateFrom" initialValue={viewModel?.getCarConsumptionRatesRequest?.dateFrom}
                                           key={"dateFrom"}
                                           label={i18next.t("CarConsumptionRates.SearchPanel.Label.dateFrom")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item name="dateTo" initialValue={viewModel?.getCarConsumptionRatesRequest?.dateTo}
                                           key={"dateTo"}
                                           label={i18next.t("CarConsumptionRates.SearchPanel.Label.dateTo")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateTo"))} />
                                </Form.Item>
                            </Col>
                        </Row>
                            :
                            <Row gutter={[24, 16]}>
                                <Col offset={11} span={8}>
                                    <Spin className={"spine"} size="large" />
                                </Col>
                            </Row>
                        }
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
            <Table dataSource={viewModel?.carConsumptionRateList} columns={columns} loading={viewModel?.isProcessing}
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


export default CarConsumptionRateList;


