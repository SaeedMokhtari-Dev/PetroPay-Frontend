import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { BrowserRouter as Router,
    Switch,
    Route,
    Link } from "react-router-dom";
import "./SubscriptionList.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckCircleOutlined, CarOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import AddSubscriptionRequest from "../../handlers/add/AddSubscriptionRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetSubscriptionRequest from "../../handlers/get/GetSubscriptionRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import SubscriptionStore from 'entities/Subscriptions/stores/SubscriptionStore';
import SubscriptionColumns from "./SubscriptionColumns";


const { confirm } = Modal;

interface SubscriptionListProps {
    subscriptionStore?: SubscriptionStore
}



const SubscriptionList: React.FC<SubscriptionListProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore}) => {
    SubscriptionColumns.forEach(w => {
       w.title = i18next.t(w.title);
        if(w.key == "subscriptionActive")
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
                {UserContext.info.role == 100 && (!record.subscriptionActive) &&
                (
                    <div>
                        <Button type="default"  icon={<CheckCircleOutlined />} onClick={() => showActivation(record)}
                                title={i18next.t("Subscriptions.Button.AcceptRequest")} style={{ background: "green", borderColor: "white" }}/>
                    </div>
                )}
                {!record.subscriptionActive &&
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
                {UserContext.info.role == 1 && record.subscriptionActive ?
                       <Link to={`/app/subscription/carAdd/${record.key}`}>
                           <Button type="default" icon={<CarOutlined/>}
                                   title={i18next.t("Subscriptions.Button.CarList")}/>
                       </Link>
                    : ""
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
        subscriptionStore.getSubscriptionViewModel.pageSize = 20;

        if(UserContext.info.role == 100) {
            await subscriptionStore.getSubscriptionViewModel.getAllSubscription(new GetSubscriptionRequest(
                20, 0));
        }
        else if(UserContext.info.role == 1)
            await subscriptionStore.getSubscriptionViewModel.getAllSubscription(new GetSubscriptionRequest(
                20, 0, UserContext.info.id));
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


    async function onDelete(key: number){
        await viewModel.deleteSubscription(key);
    }

    async function onActive(key: number){
        await viewModel.activeSubscription(key);
    }

    function onUnload() {
        subscriptionStore.onSubscriptionGetPageUnload();
        //subscriptionStore.onSubscriptionEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        if(UserContext.info.role == 100)
            await subscriptionStore.getSubscriptionViewModel.getAllSubscription(new GetSubscriptionRequest(
                pageSize, pageIndex - 1));
        else if(UserContext.info.role == 1)
            await subscriptionStore.getSubscriptionViewModel.getAllSubscription(new GetSubscriptionRequest(
                pageSize, pageIndex - 1, UserContext.info.id));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        if(UserContext.info.role == 100)
            await subscriptionStore.getSubscriptionViewModel.getAllSubscription(new GetSubscriptionRequest(
                pageSize, 0));
        else if(UserContext.info.role == 1)
            await subscriptionStore.getSubscriptionViewModel.getAllSubscription(new GetSubscriptionRequest(
                pageSize, 0, UserContext.info.id));
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


