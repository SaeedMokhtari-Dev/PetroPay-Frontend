import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import "./RechargeBalanceList.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import RechargeBalanceColumns from "./RechargeBalanceColumns";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetRechargeBalanceRequest from "../../handlers/get/GetRechargeBalanceRequest";
import RechargeBalanceStore from "../../stores/RechargeBalanceStore";
import UserContext from "../../../../identity/contexts/UserContext";

const { confirm } = Modal;

interface RechargeBalanceListProps {
    rechargeBalanceStore?: RechargeBalanceStore
}

const RechargeBalanceList: React.FC<RechargeBalanceListProps> = inject(Stores.rechargeBalanceStore)(observer(({rechargeBalanceStore}) => {
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
        {title: i18next.t("RechargeBalances.Label.companyId"), dataIndex: "companyId", key: "companyId", responsive: ['md']}
    ];
    const columns: any[] = [...RechargeBalanceColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
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
    let viewModel = rechargeBalanceStore.getRechargeBalanceViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteRechargeBalance(key);
    }

    async function onConfirm(key: number){
        await viewModel.confirmRechargeBalance(key);
    }

    async function onLoad() {
        rechargeBalanceStore.onRechargeBalanceGetPageLoad();
        //rechargeBalanceStore.onRechargeBalanceEditPageLoad();
        rechargeBalanceStore.getRechargeBalanceViewModel.pageIndex = 0;
        rechargeBalanceStore.getRechargeBalanceViewModel.pageSize = 20;
        if(UserContext.info.role == 100)
            await rechargeBalanceStore.getRechargeBalanceViewModel.getAllRechargeBalance(new GetRechargeBalanceRequest(
                20, 0));
        else if(UserContext.info.role == 1)
            await rechargeBalanceStore.getRechargeBalanceViewModel.getAllRechargeBalance(new GetRechargeBalanceRequest(
                20, 0, UserContext.info.id));
    }

    function onUnload() {
        rechargeBalanceStore.onRechargeBalanceGetPageUnload();
        //rechargeBalanceStore.onRechargeBalanceEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        if(UserContext.info.role == 100)
            await rechargeBalanceStore.getRechargeBalanceViewModel.getAllRechargeBalance(new GetRechargeBalanceRequest(
                pageSize, pageIndex - 1));
        else if(UserContext.info.role == 1)
            await rechargeBalanceStore.getRechargeBalanceViewModel.getAllRechargeBalance(new GetRechargeBalanceRequest(
                pageSize, pageIndex - 1, UserContext.info.id));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        if(UserContext.info.role == 100)
            await rechargeBalanceStore.getRechargeBalanceViewModel.getAllRechargeBalance(new GetRechargeBalanceRequest(
                pageSize, 0));
        else if(UserContext.info.role == 1)
            await rechargeBalanceStore.getRechargeBalanceViewModel.getAllRechargeBalance(new GetRechargeBalanceRequest(
                pageSize, 0, UserContext.info.id));
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


