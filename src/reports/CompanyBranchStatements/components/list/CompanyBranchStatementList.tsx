import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import "./CompanyBranchStatementList.scss";
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
import GetCompanyBranchStatementRequest from "../../handlers/get/GetCompanyBranchStatementRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import CompanyBranchStatementColumns from "./CompanyBranchStatementColumns";
import CompanyBranchStatementStore from "../../stores/CompanyBranchStatementStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import Constants from "../../../../app/constants/Constants";

const { Panel } = Collapse;
const { Option } = Select;

interface CompanyBranchStatementListProps {
    companyBranchStatementStore?: CompanyBranchStatementStore
}

const CompanyBranchStatementList: React.FC<CompanyBranchStatementListProps> = inject(Stores.companyBranchStatementStore)(observer(({companyBranchStatementStore}) => {
    const [dataFetched, setDataFetched] = React.useState(false);
    const [companyOptions, setCompanyOptions] = React.useState([]);
    const [branchOptions, setBranchOptions] = React.useState([]);

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
    CompanyBranchStatementColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });

    const columns: any[] = [...CompanyBranchStatementColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        companyBranchStatementStore.onCompanyBranchStatementGetPageLoad();
        companyBranchStatementStore.getCompanyBranchStatementViewModel.getCompanyBranchStatementsRequest = new GetCompanyBranchStatementRequest();
        companyBranchStatementStore.getCompanyBranchStatementViewModel.getCompanyBranchStatementsRequest.pageSize = 20;
        companyBranchStatementStore.getCompanyBranchStatementViewModel.getCompanyBranchStatementsRequest.pageIndex = 0;
        if(UserContext.info.role == 1){
            companyBranchStatementStore.getCompanyBranchStatementViewModel.getCompanyBranchStatementsRequest.companyId = UserContext.info.id;
        }

        await companyBranchStatementStore.getCompanyBranchStatementViewModel.getAllCompanyBranchStatement(companyBranchStatementStore.getCompanyBranchStatementViewModel.getCompanyBranchStatementsRequest);

        try {
            if (UserContext.info.role === 100) {
                await companyBranchStatementStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (companyBranchStatementStore.listCompanyViewModel) {
                    for (let item of companyBranchStatementStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }

            await companyBranchStatementStore.listBranchViewModel.getBranchList();
            let branchOptions = [];
            for (let item of companyBranchStatementStore.listBranchViewModel.listBranchResponse.items) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);
        }
        catch {

        }
        setDataFetched(true);
    }

    let viewModel = companyBranchStatementStore.getCompanyBranchStatementViewModel;

    if (!viewModel) return;

    function onUnload() {
        companyBranchStatementStore.onCompanyBranchStatementGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getCompanyBranchStatementsRequest.pageSize = pageSize;
        viewModel.getCompanyBranchStatementsRequest.pageIndex = pageIndex - 1;
        await companyBranchStatementStore.getCompanyBranchStatementViewModel.getAllCompanyBranchStatement(viewModel.getCompanyBranchStatementsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getCompanyBranchStatementsRequest.pageSize = pageSize;
        viewModel.getCompanyBranchStatementsRequest.pageIndex = 0;
        await companyBranchStatementStore.getCompanyBranchStatementViewModel.getAllCompanyBranchStatement(viewModel.getCompanyBranchStatementsRequest);
    }
    function onChanged(e){
        viewModel.getCompanyBranchStatementsRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getCompanyBranchStatementsRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getCompanyBranchStatementsRequest.pageIndex = 0;
        await viewModel.getAllCompanyBranchStatement(viewModel.getCompanyBranchStatementsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getCompanyBranchStatementsRequest.pageSize;
        viewModel.getCompanyBranchStatementsRequest = new GetCompanyBranchStatementRequest();
        viewModel.getCompanyBranchStatementsRequest.pageIndex = 0;
        viewModel.getCompanyBranchStatementsRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            companyBranchStatementStore.getCompanyBranchStatementViewModel.getCompanyBranchStatementsRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllCompanyBranchStatement(viewModel.getCompanyBranchStatementsRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.companyBranchStatementExport = [];
        await viewModel.getAllCompanyBranchStatement(viewModel.getCompanyBranchStatementsRequest, true);
        if(viewModel.companyBranchStatementExport && viewModel.companyBranchStatementExport?.length > 0)
            ExportExcel(columns, viewModel?.companyBranchStatementExport, "CompanyBranchStatement");
    }
    function onSelectChanged(e, propName){
        viewModel.getCompanyBranchStatementsRequest[`${propName}`] = e;
        if(propName === "companyId") {
            let branchOptions = [];
            const filteredBranches = companyBranchStatementStore.listBranchViewModel.listBranchResponse.items.filter(w => w.companyId == e);
            for (let item of filteredBranches) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);
        }
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("CompanyBranchStatements.Page.Title")}
                subTitle={i18next.t("CompanyBranchStatements.Page.SubTitle")}
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
                                    <Form.Item name="companyId" initialValue={viewModel?.getCompanyBranchStatementsRequest?.companyId}
                                               key={"companyId"}
                                               label={i18next.t("CompanyBranchStatements.SearchPanel.Label.companyId")}>
                                        <Select style={{width: "100%", display:"block"}}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                            {companyOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>: ""}
                            <Col span={8}>
                                <Form.Item name="branchId" initialValue={viewModel?.getCompanyBranchStatementsRequest?.branchId}
                                           key={"branchId"}
                                           label={i18next.t("CompanyBranchStatements.SearchPanel.Label.branchId")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "branchId")}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item name="dateFrom" initialValue={viewModel?.getCompanyBranchStatementsRequest?.dateFrom}
                                           key={"dateFrom"}
                                           label={i18next.t("CompanyBranchStatements.SearchPanel.Label.dateFrom")}>
                                    <DatePicker format={"YYYY/MM/DD"} onChange={((date, dateString) => onDateChange(date, dateString, "dateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTo" initialValue={viewModel?.getCompanyBranchStatementsRequest?.dateTo}
                                           key={"dateTo"}
                                           label={i18next.t("CompanyBranchStatements.SearchPanel.Label.dateTo")}>
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
            <Table dataSource={viewModel?.companyBranchStatementList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                   summary={() => (
                       <Table.Summary.Row>
                           <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                           <Table.Summary.Cell colSpan={5} index={1}></Table.Summary.Cell>
                           <Table.Summary.Cell index={5}>{viewModel?.sumCompanyBranchStatement?.toLocaleString()}</Table.Summary.Cell>
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


export default CompanyBranchStatementList;


