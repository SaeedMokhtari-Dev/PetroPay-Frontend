import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./CarBalanceList.scss";
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
import GetCarBalanceRequest from "../../handlers/get/GetCarBalanceRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import CarBalanceColumns from "./CarBalanceColumns";
import CarBalanceStore from "../../stores/CarBalanceStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import CarTransactionColumns from "../../../CarTransactions/components/list/CarTransactionColumns";


const { Panel } = Collapse;

interface CarBalanceListProps {
    carBalanceStore?: CarBalanceStore
}

const CarBalanceList: React.FC<CarBalanceListProps> = inject(Stores.carBalanceStore)(observer(({carBalanceStore}) => {

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
    CarBalanceColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });

    const columns: any[] = [...CarBalanceColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        carBalanceStore.onCarBalanceGetPageLoad();
        carBalanceStore.getCarBalanceViewModel.getCarBalancesRequest = new GetCarBalanceRequest();
        carBalanceStore.getCarBalanceViewModel.getCarBalancesRequest.pageSize = 20;
        carBalanceStore.getCarBalanceViewModel.getCarBalancesRequest.pageIndex = 0;
        if(UserContext.info.role == 1){
            carBalanceStore.getCarBalanceViewModel.getCarBalancesRequest.companyId = UserContext.info.id;
        }

        await carBalanceStore.getCarBalanceViewModel.getAllCarBalance(carBalanceStore.getCarBalanceViewModel.getCarBalancesRequest);
    }

    let viewModel = carBalanceStore.getCarBalanceViewModel;

    if (!viewModel) return;

    function onUnload() {
        carBalanceStore.onCarBalanceGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getCarBalancesRequest.pageSize = pageSize;
        viewModel.getCarBalancesRequest.pageIndex = pageIndex - 1;
        await carBalanceStore.getCarBalanceViewModel.getAllCarBalance(viewModel.getCarBalancesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getCarBalancesRequest.pageSize = pageSize;
        viewModel.getCarBalancesRequest.pageIndex = 0;
        await carBalanceStore.getCarBalanceViewModel.getAllCarBalance(viewModel.getCarBalancesRequest);
    }
    function onChanged(e){
        viewModel.getCarBalancesRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getCarBalancesRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getCarBalancesRequest.pageIndex = 0;
        await viewModel.getAllCarBalance(viewModel.getCarBalancesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getCarBalancesRequest.pageSize;
        viewModel.getCarBalancesRequest = new GetCarBalanceRequest();
        viewModel.getCarBalancesRequest.pageIndex = 0;
        viewModel.getCarBalancesRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            carBalanceStore.getCarBalanceViewModel.getCarBalancesRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllCarBalance(viewModel.getCarBalancesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.carBalanceExport = [];
        await viewModel.getAllCarBalance(viewModel.getCarBalancesRequest, true);
        if(viewModel.carBalanceExport && viewModel.carBalanceExport?.length > 0)
            ExportExcel(columns, viewModel?.carBalanceExport, "CarBalance");
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("CarBalances.Page.Title")}
                subTitle={i18next.t("CarBalances.Page.SubTitle")}
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
                                    <Form.Item name="companyName" initialValue={viewModel?.getCarBalancesRequest?.companyName}
                                               key={"companyName"}
                                               label={i18next.t("CarBalances.SearchPanel.Label.companyName")}>
                                        <Input onChange={onChanged}/>
                                    </Form.Item>
                                </Col>: ""}
                            <Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getCarBalancesRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("CarBalances.SearchPanel.Label.companyBranchName")}>
                                    <Input onChange={onChanged}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="carIdNumber" initialValue={viewModel?.getCarBalancesRequest?.carIdNumber}
                                           key={"carIdNumber"}
                                           label={i18next.t("CarBalances.SearchPanel.Label.carIdNumber")}>
                                    <Input onChange={onChanged}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="serviceDescription" initialValue={viewModel?.getCarBalancesRequest?.serviceDescription}
                                           key={"serviceDescription"}
                                           label={i18next.t("CarBalances.SearchPanel.Label.serviceDescription")}>
                                    <Input onChange={onChanged}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeFrom" initialValue={viewModel?.getCarBalancesRequest?.invoiceDataTimeFrom}
                                           key={"invoiceDataTimeFrom"}
                                           label={i18next.t("CarBalances.SearchPanel.Label.invoiceDataTimeFrom")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeTo" initialValue={viewModel?.getCarBalancesRequest?.invoiceDataTimeTo}
                                           key={"invoiceDataTimeTo"}
                                           label={i18next.t("CarBalances.SearchPanel.Label.invoiceDataTimeTo")}>
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
            <Table dataSource={viewModel?.carBalanceList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                   summary={() => (
                       <Table.Summary.Row>
                           <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={4} index={1}></Table.Summary.Cell>
                           <Table.Summary.Cell index={5}>{viewModel?.sumCarBalance?.toLocaleString()}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={2} index={6}></Table.Summary.Cell>
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


export default CarBalanceList;


