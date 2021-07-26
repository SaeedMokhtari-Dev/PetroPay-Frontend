import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./SubscriptionList.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Pagination,
    Table, Modal, PageHeader, Badge, Tag, Form, Row, Col, Select, Input, DatePicker, Spin, Alert, Collapse
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, StopOutlined, EyeOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckCircleOutlined, CarOutlined, BookOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetSubscriptionRequest from "../../handlers/get/GetSubscriptionRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import SubscriptionStore from 'entities/Subscriptions/stores/SubscriptionStore';
import SubscriptionColumns from "./SubscriptionColumns";
import {
    getRechargeBalanceDetailRoute,
    getSubscriptionDetailRoute,
    getSubscriptionInvoiceRoute
} from "../../../../app/utils/RouteHelper";
import Constants from "../../../../app/constants/Constants";
import SubscriptionStatus from "../../../../app/constants/SubscriptionStatus";

const { Panel } = Collapse;
const { confirm } = Modal;
const { Option } = Select;

interface SubscriptionListProps {
    subscriptionStore?: SubscriptionStore
}



const SubscriptionList: React.FC<SubscriptionListProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore}) => {

    const [subscriptionStatusOptions, setSubscriptionStatusOptions] = React.useState([]);
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


    SubscriptionColumns.forEach(w => {
       w.title = i18next.t(w.title);
        if(w.key === "subscriptionActive")
        {
            w["render"] = (w) => {
                return  w ? <CheckOutlined /> : <CloseOutlined />
            }
        }
    });

    let columns: any[] = [...SubscriptionColumns,
        {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                <Link to={getSubscriptionDetailRoute(record.key)}>
                    <Button type="primary"  icon={<EyeOutlined />}
                            title={i18next.t("Subscriptions.Button.Details")}/>
                </Link>
                {!record.rejected && UserContext.info.role == 100 && (!record.subscriptionActive) &&
                (
                    <Button type="default"  icon={<CheckCircleOutlined />} onClick={() => showActivation(record)}
                            title={i18next.t("Subscriptions.Button.AcceptRequest")} style={{ background: "green", borderColor: "white" }}/>
                )}
                {!record.rejected && !record.subscriptionActive &&
                    (
                       <React.Fragment>
                           <Button type="primary" icon={<EditOutlined/>} onClick={() => showEditPage(record)}
                                   title={i18next.t("General.Button.Edit")}/>
                           <Button type="primary" danger icon={<DeleteOutlined/>}
                           onClick={() => showDeleteConfirm(record)}
                           title={i18next.t("General.Button.Delete")}/>
                       </React.Fragment>
                     )
                }
                {!record.rejected && UserContext.info.role == 100 && !record.subscriptionActive &&
                    <Button type="primary" danger icon={<StopOutlined/>} onClick={() => showRejection(record)}
                            title={i18next.t("Subscriptions.Button.RejectRequest")}/>
                }
                {!record.rejected && UserContext.info.role == 1 && record.subscriptionActive && !record.expired ?
                       <Link to={`/app/subscription/carAdd/${record.key}`}>
                           <Button type="default" icon={<CarOutlined/>}
                                   title={i18next.t("Subscriptions.Button.CarList")}/>
                       </Link>
                    : ""
                }

                {!record.rejected && record.subscriptionInvoiceNumber &&
                (
                    <Link to={getSubscriptionInvoiceRoute(record.subscriptionInvoiceNumber)}>
                        <Button type="dashed" icon={<BookOutlined />}
                                title={i18next.t("Subscriptions.Invoice")}/>
                    </Link>
                )
                }

                {record.rejected &&
                (
                    <Tag color="red">Rejected</Tag>
                )
                }
            </div>
        )
    }];
    const companyColumn = {title: i18next.t("Subscriptions.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};
    if(UserContext.info.role == 100){
        columns.unshift(companyColumn);
    }

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        subscriptionStore.onSubscriptionGetPageLoad();
        //subscriptionStore.onSubscriptionEditPageLoad();
        subscriptionStore.getSubscriptionViewModel.pageIndex = 0;
        subscriptionStore.getSubscriptionViewModel.pageSize = 10;

        subscriptionStore.getSubscriptionViewModel.getSubscriptionsRequest.pageIndex = 0;
        subscriptionStore.getSubscriptionViewModel.getSubscriptionsRequest.pageSize = 10;
        subscriptionStore.getSubscriptionViewModel.getSubscriptionsRequest.status = 3;
        if(UserContext.info.role == 1)
            subscriptionStore.getSubscriptionViewModel.getSubscriptionsRequest.companyId = UserContext.info.id;

        await subscriptionStore.getSubscriptionViewModel.getAllSubscription(
            subscriptionStore.getSubscriptionViewModel.getSubscriptionsRequest
        );

        let subscriptionStatusOptions = [];
        for (let item of SubscriptionStatus) {
            subscriptionStatusOptions.push(<Option key={item.value} value={item.value}>{i18next.t(item.title)}</Option>);
        }
        setSubscriptionStatusOptions(subscriptionStatusOptions);
    }

    let viewModel = subscriptionStore.getSubscriptionViewModel;

    if (!viewModel) return;

    function showEditPage(e){

        if(e.key)
        {
            //await subscriptionStore.editSubscriptionViewModel.getDetailSubscription(e.key);
            NavigationService.navigate(`/app/subscription/edit/${e.key}`);
        }
        else{
            //subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest = new AddSubscriptionRequest();
            NavigationService.navigate(Routes.addSubscription);
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
    async function showRejection(e) {
        console.log(e.key);
        confirm({
            title: i18next.t("General.Confirm.Reject"),
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                console.log(e.key);
                await onReject(e.key);
            },
            onCancel() {},
        });
    }


    async function onDelete(key: number){
        await viewModel.deleteSubscription(key);
    }

    async function onActive(key: number){
        await viewModel.activeSubscription(key);
    }
    async function onReject(key: number){
        await viewModel.rejectSubscription(key);
    }

    function onUnload() {
        subscriptionStore.onSubscriptionGetPageUnload();
        //subscriptionStore.onSubscriptionEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getSubscriptionsRequest.pageSize = pageSize;
        viewModel.getSubscriptionsRequest.pageIndex = pageIndex - 1;
        await viewModel.getAllSubscription(viewModel.getSubscriptionsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getSubscriptionsRequest.pageSize = pageSize;
        viewModel.getSubscriptionsRequest.pageIndex = 0;
        await viewModel.getAllSubscription(viewModel.getSubscriptionsRequest);
    }
    async function onFinish(values: any) {
        viewModel.getSubscriptionsRequest.pageIndex = 0;
        await viewModel.getAllSubscription(viewModel.getSubscriptionsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getSubscriptionsRequest.pageSize;
        viewModel.getSubscriptionsRequest = new GetSubscriptionRequest();
        viewModel.getSubscriptionsRequest.pageIndex = 0;
        viewModel.getSubscriptionsRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            viewModel.getSubscriptionsRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllSubscription(viewModel.getSubscriptionsRequest);
        form.resetFields();
    }
    function onSelectChanged(e, propName){
        viewModel.getSubscriptionsRequest[`${propName}`] = e;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getSubscriptionsRequest[`${prop}`] = dateString;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Subscriptions.Page.Title")}
                subTitle={i18next.t("Subscriptions.Page.SubTitle")}
                extra={[
                        <Button hidden={UserContext.info.role == 100} key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
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
                            <Col span={8}>
                                <Form.Item name="status"
                                           key={"status"}
                                           label={i18next.t("Subscriptions.SearchPanel.Label.status")}>
                                    <Select onChange={(e) => onSelectChanged(e, "status")} allowClear={true}>
                                        {subscriptionStatusOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateFrom"
                                           key={"dateFrom"}
                                           label={i18next.t("Subscriptions.SearchPanel.Label.dateFrom")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTo"
                                           key={"dateTo"}
                                           label={i18next.t("Subscriptions.SearchPanel.Label.dateTo")}>
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
            <Table dataSource={viewModel?.subscriptionList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                   rowClassName={(record, index) => (record.subscriptionActive ? "green" : "red")}/>
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


export default SubscriptionList;


