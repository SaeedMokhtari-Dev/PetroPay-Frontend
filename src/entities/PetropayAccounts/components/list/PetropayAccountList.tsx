import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./PetropayAccountList.scss";
import Stores from "app/constants/Stores";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader, Form, Collapse, Row, Col, Select, DatePicker, Alert, Spin
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, BranchesOutlined, FileExcelOutlined
} from '@ant-design/icons';
import GetPetropayAccountsRequest from "../../handlers/get/GetPetropayAccountsRequest";
import i18next from "i18next";
import PetropayAccountsColumns from "./PetropayAccountColumns";
import Routes from "../../../../app/constants/Routes";
import { Link } from "react-router-dom";
import PetropayAccountStore from "../../stores/PetropayAccountStore";
import Constants from "../../../../app/constants/Constants";
import ExportExcel from "../../../../app/utils/ExportExcel";
import {set} from "mobx";

const { Panel } = Collapse;
const { confirm } = Modal;
const { Option } = Select;


interface PetropayAccountsSidebarProps {
    petropayAccountStore?: PetropayAccountStore
}

const PetropayAccountList: React.FC<PetropayAccountsSidebarProps> = inject(Stores.petropayAccountStore)(observer(({petropayAccountStore}) => {
    const [petropayAccountOptions, setPetropayAccountOptions] = React.useState([]);
    const [dataFetched, setDataFetched] = React.useState(false);
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

    PetropayAccountsColumns.forEach(w => {
        w.title = i18next.t(w.title)
    });
    const columns: any[] = [...PetropayAccountsColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        petropayAccountStore.onPetropayAccountGetPageLoad();
        debugger;
        petropayAccountStore.getPetropayAccountViewModel.getPetropayAccountsRequest.pageIndex = 0;
        petropayAccountStore.getPetropayAccountViewModel.getPetropayAccountsRequest.pageSize = 10;
        await petropayAccountStore.getPetropayAccountViewModel.getAllPetropayAccounts(petropayAccountStore.getPetropayAccountViewModel.getPetropayAccountsRequest);

        await petropayAccountStore.listPetropayAccountViewModel.getPetropayAccountList(false);

        let petropayAccountOptions = [];
        debugger;
        for (let item of petropayAccountStore.listPetropayAccountViewModel?.listPetropayAccountResponse?.items) {
            petropayAccountOptions.push(<Option key={item.key} value={item.accountId} balance={item.balance}>{item.title}</Option>);
        }
        setPetropayAccountOptions(petropayAccountOptions);

        setDataFetched(true);
    }

    let viewModel = petropayAccountStore.getPetropayAccountViewModel;

    if (!viewModel) return;

    function onUnload() {
        petropayAccountStore.onPetropayAccountGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getPetropayAccountsRequest.pageIndex = pageIndex - 1;
        viewModel.getPetropayAccountsRequest.pageSize = pageSize;
        await viewModel.getAllPetropayAccounts(viewModel.getPetropayAccountsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getPetropayAccountsRequest.pageIndex = 0;
        viewModel.getPetropayAccountsRequest.pageSize = pageSize;
        await viewModel.getAllPetropayAccounts(viewModel.getPetropayAccountsRequest);
    }
    async function onFinish(values: any) {
        viewModel.getPetropayAccountsRequest.pageIndex = 0;
        await viewModel.getAllPetropayAccounts(viewModel.getPetropayAccountsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getPetropayAccountsRequest.pageSize;
        viewModel.getPetropayAccountsRequest = new GetPetropayAccountsRequest();
        viewModel.getPetropayAccountsRequest.pageIndex = 0;
        viewModel.getPetropayAccountsRequest.pageSize = pageSize;
        await viewModel.getAllPetropayAccounts(viewModel.getPetropayAccountsRequest);
        form.resetFields();
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getPetropayAccountsRequest[`${prop}`] = dateString;
    }
    function onOptionSelectChanged(e, option, propName) {
        viewModel.getPetropayAccountsRequest[`${propName}`] = e;
    }
    async function ExportToExcel(){
        viewModel.petropayAccountExport = [];
        await viewModel.getAllPetropayAccounts(viewModel.getPetropayAccountsRequest, true);
        if(viewModel.petropayAccountExport && viewModel?.petropayAccountExport?.length > 0)
            ExportExcel(columns, viewModel?.petropayAccountExport, "petropayAccount");
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("PetropayAccounts.Page.Title")}
                subTitle={i18next.t("PetropayAccounts.Page.SubTitle")}
                extra={[
                    <Link to={Routes.paymentTransferAccount}>
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} >
                            {i18next.t("General.Button.Add")}
                        </Button>
                    </Link>,
                    <Button key={"ExportExcel"} type="primary" loading={viewModel?.isProcessing}
                            icon={<FileExcelOutlined />} onClick={ExportToExcel}>
                        {i18next.t("General.Button.ExportExcel")}
                    </Button>
                ]}
            />
            <Collapse defaultActiveKey={['1']}>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        {dataFetched ?
                        <Row gutter={[24, 16]}>
                            <Col span={8}>
                                <Form.Item name="petropayAccountId"
                                           key={"petropayAccountId"}
                                           label={i18next.t("PetropayAccounts.SearchPanel.Label.petropayAccountId")}>
                                    <Select showSearch={true} allowClear={true} onChange={(e, option) => onOptionSelectChanged(e, option, "petropayAccountId")} >
                                        {petropayAccountOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateFrom"
                                           key={"dateFrom"}
                                           label={i18next.t("PetropayAccounts.SearchPanel.Label.dateFrom")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTo"
                                           key={"dateTo"}
                                           label={i18next.t("PetropayAccounts.SearchPanel.Label.dateTo")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateTo"))} />
                                </Form.Item>
                            </Col>
                        </Row>
                            :
                            <Row gutter={[24, 16]}>
                                <Col offset={11} span={8}>
                                    <Spin className={"spine"} size="large" />
                                </Col>
                            </Row>}
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
            <Table dataSource={viewModel?.petropayAccountList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky/>
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

            {/*<EditPetropayAccount />*/}
        </div>
    )
}));


export default PetropayAccountList;


