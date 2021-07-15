import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./CarTransactionList.scss";
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
import GetCarTransactionRequest from "../../handlers/get/GetCarTransactionRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import CarTransactionColumns from "./CarTransactionColumns";
import CarTransactionStore from "../../stores/CarTransactionStore";
import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;
const { Option } = Select;

interface CarTransactionListProps {
    carTransactionStore?: CarTransactionStore
}

const CarTransactionList: React.FC<CarTransactionListProps> = inject(Stores.carTransactionStore)(observer(({carTransactionStore}) => {

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
    CarTransactionColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    const companyColumn = {title: i18next.t("CarTransactions.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};

    let columns: any[] = [...CarTransactionColumns];
    if(UserContext.info.role == 100)
    {
        columns.unshift(companyColumn);
    }

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        carTransactionStore.onCarTransactionGetPageLoad();
        carTransactionStore.getCarTransactionViewModel.getCarTransactionsRequest = new GetCarTransactionRequest();
        carTransactionStore.getCarTransactionViewModel.getCarTransactionsRequest.pageSize = 20;
        carTransactionStore.getCarTransactionViewModel.getCarTransactionsRequest.pageIndex = 0;
        if(UserContext.info.role == 1){
            carTransactionStore.getCarTransactionViewModel.getCarTransactionsRequest.companyId = UserContext.info.id;
        }

        try {
            if (UserContext.info.role === 100) {
                await carTransactionStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (carTransactionStore.listCompanyViewModel) {
                    for (let item of carTransactionStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }

            await carTransactionStore.listBranchViewModel.getBranchList();
            await carTransactionStore.listCarViewModel.getCarList();


            //await carTransactionStore.getCarTransactionViewModel.getAllCarTransaction(carTransactionStore.getCarTransactionViewModel.getCarTransactionsRequest);

            let carOptions = [];
            for (let item of carTransactionStore.listCarViewModel.listCarResponse.items) {
                carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);

            let branchOptions = [];
            for (let item of carTransactionStore.listBranchViewModel.listBranchResponse.items) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);
        }
        catch {

        }
    }

    let viewModel = carTransactionStore.getCarTransactionViewModel;

    if (!viewModel) return;

    function onUnload() {
        carTransactionStore.onCarTransactionGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getCarTransactionsRequest.pageSize = pageSize;
        viewModel.getCarTransactionsRequest.pageIndex = pageIndex - 1;
        await carTransactionStore.getCarTransactionViewModel.getAllCarTransaction(viewModel.getCarTransactionsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getCarTransactionsRequest.pageSize = pageSize;
        viewModel.getCarTransactionsRequest.pageIndex = 0;
        await carTransactionStore.getCarTransactionViewModel.getAllCarTransaction(viewModel.getCarTransactionsRequest);
    }
    function onChanged(e){
        viewModel.getCarTransactionsRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getCarTransactionsRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getCarTransactionsRequest.pageIndex = 0;
        await viewModel.getAllCarTransaction(viewModel.getCarTransactionsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getCarTransactionsRequest.pageSize;
        viewModel.getCarTransactionsRequest = new GetCarTransactionRequest();
        viewModel.getCarTransactionsRequest.pageIndex = 0;
        viewModel.getCarTransactionsRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            carTransactionStore.getCarTransactionViewModel.getCarTransactionsRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllCarTransaction(viewModel.getCarTransactionsRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.carTransactionExport = [];
        await viewModel.getAllCarTransaction(viewModel.getCarTransactionsRequest, true);
        if(viewModel.carTransactionExport && viewModel?.carTransactionExport?.length > 0)
            ExportExcel(columns, viewModel?.carTransactionExport, "CarTransaction");
    }
    function onSelectChanged(e, propName){
        viewModel.getCarTransactionsRequest[`${propName}`] = e;
        if(propName === "companyId") {
            let carOptions = [];
            const filteredCars = carTransactionStore.listCarViewModel.listCarResponse.items.filter(w => w.companyId == e);
            for (let item of filteredCars) {
                carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);

            let branchOptions = [];
            const filteredBranches = carTransactionStore.listBranchViewModel.listBranchResponse.items.filter(w => w.companyId == e);
            for (let item of filteredBranches) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);
        }
        if(propName === "companyBranchId") {
            let carOptions = [];
            const filteredCars = carTransactionStore.listCarViewModel.listCarResponse.items.filter(w => w.branchId == e);
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
                title={i18next.t("CarTransactions.Page.Title")}
                subTitle={i18next.t("CarTransactions.Page.SubTitle")}
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
                                <Col span={8}>
                                    <Form.Item name="companyId" initialValue={viewModel?.getCarTransactionsRequest?.companyId}
                                               key={"companyId"}
                                               label={i18next.t("CarTransactions.SearchPanel.Label.companyName")}>
                                        {/*<Input onChange={onChanged}/>*/}
                                        <Select style={{width: "100%", display:"block"}}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                            {companyOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>: ""}
                            <Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getCarTransactionsRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("CarTransactions.SearchPanel.Label.companyBranchName")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "companyBranchId")}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="carIdNumber" initialValue={viewModel?.getCarTransactionsRequest?.carIdNumber}
                                           key={"carIdNumber"}
                                           label={i18next.t("CarTransactions.SearchPanel.Label.carIdNumber")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "carIdNumber")}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="transDateFrom" initialValue={viewModel?.getCarTransactionsRequest?.transDateFrom}
                                           key={"transDateFrom"}
                                           label={i18next.t("CarTransactions.SearchPanel.Label.transDateFrom")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "transDateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="transDateTo" initialValue={viewModel?.getCarTransactionsRequest?.transDateTo}
                                           key={"transDateTo"}
                                           label={i18next.t("CarTransactions.SearchPanel.Label.transDateTo")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "transDateTo"))} />
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
            <Table dataSource={viewModel?.carTransactionList} columns={columns} loading={viewModel?.isProcessing}
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


export default CarTransactionList;


