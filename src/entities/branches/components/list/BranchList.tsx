import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./BranchList.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, CarOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import BranchColumns from "./BranchColumns";
import AddBranchRequest from "../../handlers/add/AddBranchRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetBranchRequest from "../../handlers/get/GetBranchRequest";
import BranchStore from "../../stores/BranchStore";
import UserContext from "../../../../identity/contexts/UserContext";


const { confirm } = Modal;


interface BranchListProps {
    branchStore?: BranchStore
    match?: any;
}



const BranchList: React.FC<BranchListProps> = inject(Stores.branchStore)(observer(({branchStore, match}) => {
    const [companyId, setCompanyId] = React.useState(0);

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    BranchColumns.forEach(w => {
       w.title = i18next.t(w.title);
       if(w.key == "companyBranchActiva")
       {
           w["render"] = (w) => {
               return  w ? <CheckOutlined /> : <CloseOutlined />
           }
       }
    });
    const columns: any[] = [...BranchColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                {UserContext.info.role == 100 && (!record.companyBranchActiva) &&
                (
                    <div>
                        <Button type="default"  icon={<CheckCircleOutlined />} onClick={() => showActivation(record)}
                                title={i18next.t("Subscriptions.Button.AcceptRequest")} style={{ background: "green", borderColor: "white" }}/>
                    </div>
                )}
                {record.companyBranchActiva &&
                    <div>
                        <Button type="default" icon={<CarOutlined/>} onClick={() => showCarPage(record)}
                                title={i18next.t("Branches.Button.CarList")}/>
                    </div>
                }
                {!record.companyBranchActiva &&
                <div>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                    title={i18next.t("General.Button.Edit")} />
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                    title={i18next.t("General.Button.Delete")} />
                </div>
                }
            </div>
        )
    }];
    async function onActive(key: number){
        await viewModel.activeBranch(key, companyId);
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
    function showCarPage(e){
        NavigationService.navigate(`/app/car/${e.key}/list`);
    }
    async function showEditPage(e){
        if(e.key)
        {
            //await branchStore.editBranchViewModel.getDetailBranch(e.key);
            NavigationService.navigate(`/app/branch/edit/${e.key}`);
        }
        else{
            //branchStore.editBranchViewModel.addBranchRequest = new AddBranchRequest();
            NavigationService.navigate(Routes.addBranch);
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
    let viewModel = branchStore.getBranchViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteBranch(key, companyId);
    }

    async function onLoad() {
        branchStore.onBranchGetPageLoad();
        //branchStore.onBranchEditPageLoad();

        let companyIdParam = 0;
        if(match.params?.companyId){
            companyIdParam = +match.params?.companyId;
        }
        else {
            companyIdParam = UserContext.info.id;
        }
        branchStore.getBranchViewModel.pageIndex = 0;
        branchStore.getBranchViewModel.pageSize = 20;
        await branchStore.getBranchViewModel.getAllBranch(new GetBranchRequest(
            companyIdParam,20, 0));

        setCompanyId(companyIdParam);
    }

    function onUnload() {
        branchStore.onBranchGetPageUnload();
        //branchStore.onBranchEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await branchStore.getBranchViewModel.getAllBranch(new GetBranchRequest(companyId,
            pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await branchStore.getBranchViewModel.getAllBranch(new GetBranchRequest(companyId,
            pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Branches.Page.Title")}
                subTitle={i18next.t("Branches.Page.SubTitle")}
                extra={[
                        <Button hidden={UserContext.info.role == 100} key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.branchList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                   rowClassName={(record, index) => (record.companyBranchActiva ? "green" : "red")}/>
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


export default BranchList;


