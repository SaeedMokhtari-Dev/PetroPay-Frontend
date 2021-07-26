import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./NewCustomersList.scss";
import Stores from "app/constants/Stores";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader, Collapse, Select, Form, Row, Col, DatePicker, Alert
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined, FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import NewCustomersColumns from "./NewCustomersColumns";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetNewCustomerRequest from "../../handlers/get/GetNewCustomerRequest";
import NewCustomerStore from "../../stores/NewCustomerStore";
import UserContext from "../../../../identity/contexts/UserContext";
import RechargeStatus from "../../../../app/constants/RechargeStatus";
import GetSubscriptionRequest from "../../../Subscriptions/handlers/get/GetSubscriptionRequest";
import Constants from "../../../../app/constants/Constants";
import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;
const { confirm } = Modal;
const { Option } = Select;

interface NewCustomersSidebarProps {
    newCustomerStore?: NewCustomerStore
}

const NewCustomersList: React.FC<NewCustomersSidebarProps> = inject(Stores.newCustomerStore)(observer(({newCustomerStore}) => {

    const [statusOptions, setStatusOptions] = React.useState([]);
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
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    NewCustomersColumns.forEach(w => {
       w.title = i18next.t(w.title);
        if(w.key === "custReqStatus")
        {
            w["render"] = (w) => {
                return  w ? <CheckOutlined /> : <CloseOutlined />
            }
        }
    });
    const columns: any[] = [...NewCustomersColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                {!record.custReqStatus &&
                <Button type="default" icon={<CheckCircleOutlined/>} onClick={() => showActivation(record)}
                        title={i18next.t("Subscriptions.Button.AcceptRequest")}
                        style={{background: "green", borderColor: "white"}}/>
                }
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                            title={i18next.t("General.Button.Edit")} />
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                        title={i18next.t("General.Button.Delete")} />
            </div>
        )
    }];
    async function showEditPage(e){
        //newCustomerStore.editNewCustomerViewModel.key = e.key;
        if(e.key)
        {
            //await newCustomerStore.editNewCustomerViewModel.getDetailNewCustomer(e.key);
            NavigationService.navigate(`/app/newCustomer/edit/${e.key}`);
        }
        else{
            //newCustomerStore.editNewCustomerViewModel.addNewCustomerRequest = new AddNewCustomerRequest();
            NavigationService.navigate(Routes.addNewCustomer);
        }
    }
    async function showDeleteConfirm(e) {
        console.log(e.key);
        confirm({
            title: i18next.t("General.Confirm.Delete"),
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                console.log(e.key);
                await onDelete(e.key);
            },
            onCancel() {},
        });
    }

    async function onLoad() {
        newCustomerStore.onNewCustomerGetPageLoad();
        newCustomerStore.getNewCustomerViewModel.pageIndex = 0;
        newCustomerStore.getNewCustomerViewModel.pageSize = 20;
        newCustomerStore.getNewCustomerViewModel.getNewCustomersRequest.pageIndex = 0;
        newCustomerStore.getNewCustomerViewModel.getNewCustomersRequest.pageSize = 20;
        newCustomerStore.getNewCustomerViewModel.getNewCustomersRequest.status = 2;

        await newCustomerStore.getNewCustomerViewModel.getAllNewCustomers(
            newCustomerStore.getNewCustomerViewModel.getNewCustomersRequest
        );

        let statusOptions = [];
        for (let item of RechargeStatus) {
            statusOptions.push(<Option key={item.value} value={item.value}>{i18next.t(item.title)}</Option>);
        }
        setStatusOptions(statusOptions);
    }


    let viewModel = newCustomerStore.getNewCustomerViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteNewCustomer(key);
    }


    function onUnload() {
        newCustomerStore.onNewCustomerGetPageUnload();
        //newCustomerStore.onNewCustomerEditPageUnload();
    }

    async function showActivation(e) {
        console.log(e.key);
        confirm({
            title: i18next.t("General.Confirm.Active"),
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                console.log(e.key);
                await onActive(e.key);
            },
            onCancel() {},
        });
    }
    async function onActive(key: number){
        await viewModel.activeNewCustomer(key);
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getNewCustomersRequest.pageIndex = pageIndex - 1;
        viewModel.getNewCustomersRequest.pageSize = pageSize;
        await newCustomerStore.getNewCustomerViewModel.getAllNewCustomers(viewModel.getNewCustomersRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getNewCustomersRequest.pageIndex = 0;
        viewModel.getNewCustomersRequest.pageSize = pageSize;
        await newCustomerStore.getNewCustomerViewModel.getAllNewCustomers(viewModel.getNewCustomersRequest);
    }
    async function onFinish(values: any) {
        viewModel.getNewCustomersRequest.pageIndex = 0;
        await viewModel.getAllNewCustomers(viewModel.getNewCustomersRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getNewCustomersRequest.pageSize;
        viewModel.getNewCustomersRequest = new GetNewCustomerRequest();
        viewModel.getNewCustomersRequest.pageIndex = 0;
        viewModel.getNewCustomersRequest.pageSize = pageSize;
        await viewModel.getAllNewCustomers(viewModel.getNewCustomersRequest);
        form.resetFields();
    }
    function onSelectChanged(e, propName){
        viewModel.getNewCustomersRequest[`${propName}`] = +e;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getNewCustomersRequest[`${prop}`] = dateString;
    }

    async function ExportToExcel(){
        viewModel.newCustomerExport = [];
        await viewModel.getAllNewCustomers(viewModel.getNewCustomersRequest, true);
        if(viewModel.newCustomerExport && viewModel?.newCustomerExport?.length > 0)
            ExportExcel(columns, viewModel?.newCustomerExport, "newCustomersExport");
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("NewCustomers.Page.Title")}
                subTitle={i18next.t("NewCustomers.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
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
                        <Row gutter={[24, 16]}>
                            <Col span={8}>
                                <Form.Item name="status"
                                           key={"status"}
                                           label={i18next.t("NewCustomers.SearchPanel.Label.status")}>
                                    <Select onChange={(e) => onSelectChanged(e, "status")} allowClear={true}>
                                        {statusOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateFrom"
                                           key={"dateFrom"}
                                           label={i18next.t("NewCustomers.SearchPanel.Label.dateFrom")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTo"
                                           key={"dateTo"}
                                           label={i18next.t("NewCustomers.SearchPanel.Label.dateTo")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateTo"))} />
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

            <Table dataSource={viewModel?.newCustomerList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky/>
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


export default NewCustomersList;


