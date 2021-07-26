import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import "./CustomerStatementList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Select
} from "antd";
import {
    FileExcelOutlined,

} from '@ant-design/icons';
import i18next from "i18next";
import GetCustomerStatementRequest from "../../handlers/get/GetCustomerStatementRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import CustomerStatementColumns from "./CustomerStatementColumns";
import CustomerStatementStore from "../../stores/CustomerStatementStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import Constants from "../../../../app/constants/Constants";

const { Panel } = Collapse;
const { Option } = Select;

interface CustomerStatementListProps {
    customerStatementStore?: CustomerStatementStore
}

const CustomerStatementList: React.FC<CustomerStatementListProps> = inject(Stores.customerStatementStore)(observer(({customerStatementStore}) => {
    const [dataFetched, setDataFetched] = React.useState(false);
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
    CustomerStatementColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });

    const columns: any[] = [...CustomerStatementColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        customerStatementStore.onCustomerStatementGetPageLoad();
        customerStatementStore.getCustomerStatementViewModel.getCustomerStatementsRequest = new GetCustomerStatementRequest();
        customerStatementStore.getCustomerStatementViewModel.getCustomerStatementsRequest.pageSize = 20;
        customerStatementStore.getCustomerStatementViewModel.getCustomerStatementsRequest.pageIndex = 0;
        if(UserContext.info.role == 1){
            customerStatementStore.getCustomerStatementViewModel.getCustomerStatementsRequest.companyId = UserContext.info.id;
        }

        await customerStatementStore.getCustomerStatementViewModel.getAllCustomerStatement(customerStatementStore.getCustomerStatementViewModel.getCustomerStatementsRequest);

        try {
            if (UserContext.info.role === 100) {
                await customerStatementStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (customerStatementStore.listCompanyViewModel) {
                    for (let item of customerStatementStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }
        }
        catch {

        }
        setDataFetched(true);
    }

    let viewModel = customerStatementStore.getCustomerStatementViewModel;

    if (!viewModel) return;

    function onUnload() {
        customerStatementStore.onCustomerStatementGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getCustomerStatementsRequest.pageSize = pageSize;
        viewModel.getCustomerStatementsRequest.pageIndex = pageIndex - 1;
        await customerStatementStore.getCustomerStatementViewModel.getAllCustomerStatement(viewModel.getCustomerStatementsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getCustomerStatementsRequest.pageSize = pageSize;
        viewModel.getCustomerStatementsRequest.pageIndex = 0;
        await customerStatementStore.getCustomerStatementViewModel.getAllCustomerStatement(viewModel.getCustomerStatementsRequest);
    }
    function onChanged(e){
        viewModel.getCustomerStatementsRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getCustomerStatementsRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getCustomerStatementsRequest.pageIndex = 0;
        await viewModel.getAllCustomerStatement(viewModel.getCustomerStatementsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getCustomerStatementsRequest.pageSize;
        viewModel.getCustomerStatementsRequest = new GetCustomerStatementRequest();
        viewModel.getCustomerStatementsRequest.pageIndex = 0;
        viewModel.getCustomerStatementsRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            customerStatementStore.getCustomerStatementViewModel.getCustomerStatementsRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllCustomerStatement(viewModel.getCustomerStatementsRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.customerStatementExport = [];
        await viewModel.getAllCustomerStatement(viewModel.getCustomerStatementsRequest, true);
        if(viewModel.customerStatementExport && viewModel.customerStatementExport?.length > 0)
            ExportExcel(columns, viewModel?.customerStatementExport, "CustomerStatement");
    }
    function onSelectChanged(e, propName){
        viewModel.getCustomerStatementsRequest[`${propName}`] = e;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("CustomerStatements.Page.Title")}
                subTitle={i18next.t("CustomerStatements.Page.SubTitle")}
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
                                    <Form.Item name="companyId" initialValue={viewModel?.getCustomerStatementsRequest?.companyId}
                                               key={"companyId"}
                                               label={i18next.t("CustomerStatements.SearchPanel.Label.companyId")}>
                                        <Select style={{width: "100%", display:"block"}}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                            {companyOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>: ""}
                            <Col span={8}>
                                <Form.Item name="dateFrom" initialValue={viewModel?.getCustomerStatementsRequest?.dateFrom}
                                           key={"dateFrom"}
                                           label={i18next.t("CustomerStatements.SearchPanel.Label.dateFrom")}>
                                    <DatePicker format={"YYYY/MM/DD"} onChange={((date, dateString) => onDateChange(date, dateString, "dateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTo" initialValue={viewModel?.getCustomerStatementsRequest?.dateTo}
                                           key={"dateTo"}
                                           label={i18next.t("CustomerStatements.SearchPanel.Label.dateTo")}>
                                    <DatePicker format={"YYYY/MM/DD"} onChange={((date, dateString) => onDateChange(date, dateString, "dateTo"))} />
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
            <Table dataSource={viewModel?.customerStatementList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                   summary={() => (
                       <Table.Summary.Row>
                           <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={4} index={1}></Table.Summary.Cell>
                           <Table.Summary.Cell index={5}>{viewModel?.sumCustomerStatement?.toLocaleString()}</Table.Summary.Cell>
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


export default CustomerStatementList;


