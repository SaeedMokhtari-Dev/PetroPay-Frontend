import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./OdometerRecordsList.scss";
import Stores from "app/constants/Stores";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import OdometerRecordsColumns from "./OdometerRecordsColumns";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetOdometerRecordRequest from "../../handlers/get/GetOdometerRecordRequest";
import OdometerRecordStore from "../../stores/OdometerRecordStore";
import UserContext from "../../../../identity/contexts/UserContext";

const { confirm } = Modal;

interface OdometerRecordsSidebarProps {
    odometerRecordStore?: OdometerRecordStore
}

const OdometerRecordsList: React.FC<OdometerRecordsSidebarProps> = inject(Stores.odometerRecordStore)(observer(({odometerRecordStore}) => {
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    OdometerRecordsColumns.forEach(w => {
       w.title = i18next.t(w.title)
    });
    const columns: any[] = [...OdometerRecordsColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">

                    <Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                            title={i18next.t("General.Button.Edit")} />
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                        title={i18next.t("General.Button.Delete")} />
            </div>
        )
    }];
    async function showEditPage(e){
        //odometerRecordStore.editOdometerRecordViewModel.key = e.key;
        if(e.key)
        {
            //await odometerRecordStore.editOdometerRecordViewModel.getDetailOdometerRecord(e.key);
            NavigationService.navigate(`/app/odometerRecord/edit/${e.key}`);
        }
        else{
            //odometerRecordStore.editOdometerRecordViewModel.addOdometerRecordRequest = new AddOdometerRecordRequest();
            NavigationService.navigate(Routes.addOdometerRecord);
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
        odometerRecordStore.onOdometerRecordGetPageLoad();
        //odometerRecordStore.onOdometerRecordEditPageLoad();
        odometerRecordStore.getOdometerRecordViewModel.pageIndex = 0;
        odometerRecordStore.getOdometerRecordViewModel.pageSize = 20;

        if(UserContext.info.role === 1)
            odometerRecordStore.getOdometerRecordViewModel.companyId = UserContext.info.id;
        if(UserContext.info.role === 5)
            odometerRecordStore.getOdometerRecordViewModel.branchId = UserContext.info.id;
        await odometerRecordStore.getOdometerRecordViewModel.getAllOdometerRecords(
            new GetOdometerRecordRequest(20, 0, odometerRecordStore.getOdometerRecordViewModel.companyId
            , odometerRecordStore.getOdometerRecordViewModel.branchId));
    }

    let viewModel = odometerRecordStore.getOdometerRecordViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteOdometerRecord(key);
    }

    function onUnload() {
        odometerRecordStore.onOdometerRecordGetPageUnload();
        //odometerRecordStore.onOdometerRecordEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;

        await odometerRecordStore.getOdometerRecordViewModel.getAllOdometerRecords(
            new GetOdometerRecordRequest(pageSize, pageIndex - 1, viewModel.companyId));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await odometerRecordStore.getOdometerRecordViewModel.getAllOdometerRecords(
            new GetOdometerRecordRequest(pageSize, 0, viewModel.companyId));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("OdometerRecords.Page.Title")}
                subTitle={i18next.t("OdometerRecords.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.odometerRecordList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false}  sticky/>
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


export default OdometerRecordsList;


