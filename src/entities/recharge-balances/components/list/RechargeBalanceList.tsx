import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import "./RechargeBalanceList.scss";
import Stores from "app/constants/Stores";
import { Link } from "react-router-dom";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader, Form, Select, Collapse, Row, Col, DatePicker, Alert
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckCircleOutlined, EyeOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import RechargeBalanceColumns from "./RechargeBalanceColumns";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetRechargeBalanceRequest from "../../handlers/get/GetRechargeBalanceRequest";
import RechargeBalanceStore from "../../stores/RechargeBalanceStore";
import UserContext from "../../../../identity/contexts/UserContext";
import SubscriptionStatus from "../../../../app/constants/SubscriptionStatus";
import Status from "../../../../app/constants/Status";
import GetSubscriptionRequest from "../../../Subscriptions/handlers/get/GetSubscriptionRequest";
import Constants from "../../../../app/constants/Constants";
import RechargeStatus from "../../../../app/constants/RechargeStatus";
import {getRechargeBalanceDetailRoute, getSubscriptionDetailRoute} from "../../../../app/utils/RouteHelper";

const { Panel } = Collapse;
const { confirm } = Modal;
const { Option } = Select;

interface RechargeBalanceListProps {
    rechargeBalanceStore?: RechargeBalanceStore
}

const RechargeBalanceList: React.FC<RechargeBalanceListProps> = inject(Stores.rechargeBalanceStore)(observer(({rechargeBalanceStore}) => {
    const [rechargeStatusOptions, setRechargeStatusOptions] = React.useState([]);
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

    RechargeBalanceColumns.forEach(w => {
       w.title = i18next.t(w.title);
        if(w.key === "rechargeRequstConfirmed")
        {
            w["render"] = (w) => {
                return  w ? <CheckOutlined /> : <CloseOutlined />
            }
        }
    });
    const companyColumns = [
        {title: i18next.t("RechargeBalances.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']},
        {title: i18next.t("RechargeBalances.Label.companyId"), dataIndex: "companyId", key: "companyId", width: "100px"}
    ];
    const columns: any[] = [...RechargeBalanceColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                <Link to={getRechargeBalanceDetailRoute(record.key)}>
                    <Button type="primary"  icon={<EyeOutlined />}
                            title={i18next.t("RechargeBalances.Button.Details")}/>
                </Link>
                {UserContext.info.role == 1 && (!record.rechargeRequstConfirmed) &&
                    (
                               <div>
                                   <Button type="primary" icon={<EditOutlined/>} onClick={() => showEditPage(record)}
                                           title={i18next.t("General.Button.Edit")}/>
                                   <Button type="primary" danger icon={<DeleteOutlined/>}
                                   onClick={() => showDeleteConfirm(record)}
                                   title={i18next.t("General.Button.Delete")}/>
                               </div>
                     )
                }
                {UserContext.info.role == 100 && (!record.rechargeRequstConfirmed) &&
                (
                    <div>
                        <Button type="default"  icon={<CheckCircleOutlined />} onClick={() => showConfirmation(record)}
                                title={i18next.t("RechargeBalances.Button.ConfirmRequest")} style={{ background: "green", borderColor: "white" }}/>
                        <Button type="primary" icon={<EditOutlined/>} onClick={() => showEditPage(record)}
                                title={i18next.t("General.Button.Edit")}/>
                        <Button type="primary" danger icon={<DeleteOutlined/>}
                                onClick={() => showDeleteConfirm(record)}
                                title={i18next.t("General.Button.Delete")}/>
                    </div>
                )
                }
            </div>
        )
    }];
    if(UserContext.info.role == 100)
    {
        companyColumns.forEach(w => {
            columns.unshift(w);
        });

    }
    async function showEditPage(e){
        //rechargeBalanceStore.editRechargeBalanceViewModel.key = e.key;
        if(e.key)
        {
            //await rechargeBalanceStore.editRechargeBalanceViewModel.getDetailRechargeBalance(e.key);
            NavigationService.navigate(`/app/rechargeBalance/edit/${e.key}`);
        }
        else{
            //rechargeBalanceStore.editRechargeBalanceViewModel.addRechargeBalanceRequest = new AddRechargeBalanceRequest();
            NavigationService.navigate(Routes.addRechargeBalance);
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
    async function showConfirmation(e) {
        console.log(e.key);
        confirm({
            title: i18next.t("General.Confirm.Accept"),
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                console.log(e.key);
                await onConfirm(e.key);
            },
            onCancel() {},
        });
    }

    async function onLoad() {
        rechargeBalanceStore.onRechargeBalanceGetPageLoad();
        //rechargeBalanceStore.onRechargeBalanceEditPageLoad();
        rechargeBalanceStore.getRechargeBalanceViewModel.getRechargeBalancesRequest.pageIndex = 0;
        rechargeBalanceStore.getRechargeBalanceViewModel.getRechargeBalancesRequest.pageSize = 10;
        rechargeBalanceStore.getRechargeBalanceViewModel.getRechargeBalancesRequest.status = 2;
        if(UserContext.info.role == 1)
            rechargeBalanceStore.getRechargeBalanceViewModel.getRechargeBalancesRequest.companyId = UserContext.info.id;

        await rechargeBalanceStore.getRechargeBalanceViewModel.getAllRechargeBalance(
            rechargeBalanceStore.getRechargeBalanceViewModel.getRechargeBalancesRequest
        );

        let rechargeStatusOptions = [];
        for (let item of RechargeStatus) {
            rechargeStatusOptions.push(<Option key={item.value} value={item.value}>{i18next.t(item.title)}</Option>);
        }
        setRechargeStatusOptions(rechargeStatusOptions);
    }

    let viewModel = rechargeBalanceStore.getRechargeBalanceViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteRechargeBalance(key);
    }

    async function onConfirm(key: number){
        await viewModel.confirmRechargeBalance(key);
    }

    function onUnload() {
        rechargeBalanceStore.onRechargeBalanceGetPageUnload();
        //rechargeBalanceStore.onRechargeBalanceEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getRechargeBalancesRequest.pageSize = pageSize;
        viewModel.getRechargeBalancesRequest.pageIndex = pageIndex - 1;
        await viewModel.getAllRechargeBalance(viewModel.getRechargeBalancesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getRechargeBalancesRequest.pageSize = pageSize;
        viewModel.getRechargeBalancesRequest.pageIndex = 0;
        await viewModel.getAllRechargeBalance(viewModel.getRechargeBalancesRequest);
    }
    async function onFinish(values: any) {
        viewModel.getRechargeBalancesRequest.pageIndex = 0;
        await viewModel.getAllRechargeBalance(viewModel.getRechargeBalancesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getRechargeBalancesRequest.pageSize;
        viewModel.getRechargeBalancesRequest = new GetSubscriptionRequest();
        viewModel.getRechargeBalancesRequest.pageIndex = 0;
        viewModel.getRechargeBalancesRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            viewModel.getRechargeBalancesRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllRechargeBalance(viewModel.getRechargeBalancesRequest);
        form.resetFields();
    }
    function onSelectChanged(e, propName){
        viewModel.getRechargeBalancesRequest[`${propName}`] = +e;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getRechargeBalancesRequest[`${prop}`] = dateString;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("RechargeBalances.Page.Title")}
                subTitle={i18next.t("RechargeBalances.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
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
                                           label={i18next.t("RechargeBalances.SearchPanel.Label.status")}>
                                    <Select onChange={(e) => onSelectChanged(e, "status")} allowClear={true}>
                                        {rechargeStatusOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateFrom"
                                           key={"dateFrom"}
                                           label={i18next.t("RechargeBalances.SearchPanel.Label.dateFrom")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTo"
                                           key={"dateTo"}
                                           label={i18next.t("RechargeBalances.SearchPanel.Label.dateTo")}>
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

            <Table dataSource={viewModel?.rechargeBalanceList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                   rowClassName={(record, index) => (record.rechargeRequstConfirmed ? "green" : "red")}/>
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


export default RechargeBalanceList;


