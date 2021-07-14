import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./NewCustomersList.scss";
import Stores from "app/constants/Stores";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import NewCustomersColumns from "./NewCustomersColumns";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetNewCustomerRequest from "../../handlers/get/GetNewCustomerRequest";
import NewCustomerStore from "../../stores/NewCustomerStore";

const { confirm } = Modal;

interface NewCustomersSidebarProps {
    newCustomerStore?: NewCustomerStore
}

const NewCustomersList: React.FC<NewCustomersSidebarProps> = inject(Stores.newCustomerStore)(observer(({newCustomerStore}) => {
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
                    {/*<Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                            title={i18next.t("General.Button.Edit")} />
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                        title={i18next.t("General.Button.Delete")} />*/}
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
    let viewModel = newCustomerStore.getNewCustomerViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteNewCustomer(key);
    }

    async function onLoad() {
        newCustomerStore.onNewCustomerGetPageLoad();
        newCustomerStore.getNewCustomerViewModel.pageIndex = 0;
        newCustomerStore.getNewCustomerViewModel.pageSize = 20;
        await newCustomerStore.getNewCustomerViewModel.getAllNewCustomers(new GetNewCustomerRequest(20, 0));
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
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await newCustomerStore.getNewCustomerViewModel.getAllNewCustomers(new GetNewCustomerRequest(pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await newCustomerStore.getNewCustomerViewModel.getAllNewCustomers(new GetNewCustomerRequest(pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("NewCustomers.Page.Title")}
                subTitle={i18next.t("NewCustomers.Page.SubTitle")}
                /*extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}*/
            />

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


