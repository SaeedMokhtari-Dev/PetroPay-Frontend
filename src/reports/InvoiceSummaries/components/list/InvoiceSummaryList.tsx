import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./InvoiceSummaryList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Select
} from "antd";
import {
    FolderViewOutlined,
    FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetInvoiceSummaryRequest from "../../handlers/get/GetInvoiceSummaryRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import InvoiceSummaryColumns from "./InvoiceSummaryColumns";
import InvoiceSummaryStore from "../../stores/InvoiceSummaryStore";

import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;
const { Option } = Select;

interface InvoiceSummaryListProps {
    invoiceSummaryStore?: InvoiceSummaryStore
}

const InvoiceSummaryList: React.FC<InvoiceSummaryListProps> = inject(Stores.invoiceSummaryStore)(observer(({invoiceSummaryStore}) => {
    const [carOptions, setCarOptions] = React.useState([]);
    const [branchOptions, setBranchOptions] = React.useState([]);
    const [serviceMasterOptions, setServiceMasterOptions] = React.useState([]);

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
    InvoiceSummaryColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });

    const companyColumn = {title: i18next.t("InvoiceSummaries.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};
    const columns: any[] = [...InvoiceSummaryColumns,
        {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                <Link to={`/app/invoiceDetail/${record.key}`}>
                    <Button type="default"  icon={<FolderViewOutlined />}
                            title={i18next.t("InvoiceSummaries.Button.InvoiceDetail")} style={{ background: "green", borderColor: "white" }}/>
                </Link>
            </div>
        )
    }];
    if(UserContext.info.role == 100)
    {
        columns.unshift(companyColumn);
    }

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        invoiceSummaryStore.onInvoiceSummaryGetPageLoad();
        await invoiceSummaryStore.listBranchViewModel.getBranchList();
        await invoiceSummaryStore.listCarViewModel.getCarList();
        await invoiceSummaryStore.listServiceMasterViewModel.getServiceMasterList();
        invoiceSummaryStore.getInvoiceSummaryViewModel.getInvoiceSummariesRequest = new GetInvoiceSummaryRequest();
        invoiceSummaryStore.getInvoiceSummaryViewModel.getInvoiceSummariesRequest.pageSize = 20;
        invoiceSummaryStore.getInvoiceSummaryViewModel.getInvoiceSummariesRequest.pageIndex = 0;
        if(UserContext.info.role == 1){
            invoiceSummaryStore.getInvoiceSummaryViewModel.getInvoiceSummariesRequest.companyId = UserContext.info.id;
        }

        await invoiceSummaryStore.getInvoiceSummaryViewModel.getAllInvoiceSummary(invoiceSummaryStore.getInvoiceSummaryViewModel.getInvoiceSummariesRequest);

        let carOptions = [];
        for (let item of invoiceSummaryStore.listCarViewModel.listCarResponse.items) {
            carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
        }
        setCarOptions(carOptions);

        let branchOptions = [];
        for (let item of invoiceSummaryStore.listBranchViewModel.listBranchResponse.items) {
            branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
        }
        setBranchOptions(branchOptions);

        let serviceMasterOptions = [];
        for (let item of invoiceSummaryStore.listServiceMasterViewModel.listServiceMasterResponse.items) {
            serviceMasterOptions.push(<Option key={item.key} value={item.title}>{item.title}</Option>);
        }
        setServiceMasterOptions(serviceMasterOptions);
    }

    let viewModel = invoiceSummaryStore.getInvoiceSummaryViewModel;

    if (!viewModel) return;

    function onUnload() {
        invoiceSummaryStore.onInvoiceSummaryGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getInvoiceSummariesRequest.pageSize = pageSize;
        viewModel.getInvoiceSummariesRequest.pageIndex = pageIndex - 1;
        await invoiceSummaryStore.getInvoiceSummaryViewModel.getAllInvoiceSummary(viewModel.getInvoiceSummariesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getInvoiceSummariesRequest.pageSize = pageSize;
        viewModel.getInvoiceSummariesRequest.pageIndex = 0;
        await invoiceSummaryStore.getInvoiceSummaryViewModel.getAllInvoiceSummary(viewModel.getInvoiceSummariesRequest);
    }
    function onChanged(e){
        viewModel.getInvoiceSummariesRequest[`${e.target.id}`] = e.target.value;
    }
    function onSelectChanged(e, propName){
        viewModel.getInvoiceSummariesRequest[`${propName}`] = e;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getInvoiceSummariesRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getInvoiceSummariesRequest.pageIndex = 0;
        await viewModel.getAllInvoiceSummary(viewModel.getInvoiceSummariesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getInvoiceSummariesRequest.pageSize;
        viewModel.getInvoiceSummariesRequest = new GetInvoiceSummaryRequest();
        viewModel.getInvoiceSummariesRequest.pageIndex = 0;
        viewModel.getInvoiceSummariesRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            invoiceSummaryStore.getInvoiceSummaryViewModel.getInvoiceSummariesRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllInvoiceSummary(viewModel.getInvoiceSummariesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        await viewModel.getAllInvoiceSummary(viewModel.getInvoiceSummariesRequest, true);
        columns.pop();
        ExportExcel(columns, viewModel?.invoiceSummaryExport, "InvoiceSummary");
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("InvoiceSummaries.Page.Title")}
                subTitle={i18next.t("InvoiceSummaries.Page.SubTitle")}
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
                                    <Form.Item name="companyName" initialValue={viewModel?.getInvoiceSummariesRequest?.companyName}
                                               key={"companyName"}
                                               label={i18next.t("InvoiceSummaries.SearchPanel.Label.companyName")}>
                                        <Input onChange={onChanged}/>
                                    </Form.Item>
                                </Col>: ""}
                            {/*<Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getInvoiceSummariesRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("InvoiceSummaries.SearchPanel.Label.companyBranchName")}>
                                    <Input onChange={onChanged}/>
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "companyBranchName")}>
                                        {petropayAccountOptions}
                                    </Select>
                                </Form.Item>
                            </Col>*/}
                            <Col span={8}>
                                <Form.Item name="companyBranchId" initialValue={viewModel?.getInvoiceSummariesRequest?.companyBranchId}
                                           key={"companyBranchId"}
                                           label={i18next.t("InvoiceSummaries.SearchPanel.Label.companyBranchName")}>
                                    {/*<Input onChange={onChanged} />*/}
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "companyBranchId")}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="carIdNumber" initialValue={viewModel?.getInvoiceSummariesRequest?.carIdNumber}
                                           key={"carIdNumber"}
                                           label={i18next.t("InvoiceSummaries.SearchPanel.Label.carIdNumber")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "carIdNumber")}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="serviceDescription" initialValue={viewModel?.getInvoiceSummariesRequest?.serviceDescription}
                                           key={"serviceDescription"}
                                           label={i18next.t("InvoiceSummaries.SearchPanel.Label.serviceDescription")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "serviceDescription")}>
                                        {serviceMasterOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeFrom" initialValue={viewModel?.getInvoiceSummariesRequest?.invoiceDataTimeFrom}
                                           key={"invoiceDataTimeFrom"}
                                           label={i18next.t("InvoiceSummaries.SearchPanel.Label.invoiceDataTimeFrom")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "invoiceDataTimeFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="invoiceDataTimeTo" initialValue={viewModel?.getInvoiceSummariesRequest?.invoiceDataTimeTo}
                                           key={"invoiceDataTimeTo"}
                                           label={i18next.t("InvoiceSummaries.SearchPanel.Label.invoiceDataTimeTo")}>
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
            <br/>
            <Table dataSource={viewModel?.invoiceSummaryList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                   summary={() => (
                       <Table.Summary.Row>
                           <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={7} index={1}></Table.Summary.Cell>
                           <Table.Summary.Cell index={5}>{viewModel?.sumInvoiceAmount?.toLocaleString()}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={2} index={6}></Table.Summary.Cell>
                       </Table.Summary.Row>
                   )} />
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


export default InvoiceSummaryList;

