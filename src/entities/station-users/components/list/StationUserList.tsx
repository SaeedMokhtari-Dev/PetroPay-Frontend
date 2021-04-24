import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./StationUserList.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import StationUserColumns from "./StationUserColumns";
import AddStationUserRequest from "../../handlers/add/AddStationUserRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetStationUserRequest from "../../handlers/get/GetStationUserRequest";
import StationUserStore from "../../stores/StationUserStore";
import UserContext from "../../../../identity/contexts/UserContext";


const { confirm } = Modal;


interface StationUserListProps {
    stationUserStore?: StationUserStore
}



const StationUserList: React.FC<StationUserListProps> = inject(Stores.stationUserStore)(observer(({stationUserStore}) => {
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    StationUserColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    const columns: any[] = [...StationUserColumns, {
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
        stationUserStore.editStationUserViewModel.key = e.key;
        if(e.key)
        {
            await stationUserStore.editStationUserViewModel.getDetailStationUser(e.key);
            NavigationService.navigate(`/app/stationUser/edit/${e.key}`);
        }
        else{
            stationUserStore.editStationUserViewModel.addStationUserRequest = new AddStationUserRequest();
            NavigationService.navigate(Routes.addStationUser);
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
    let viewModel = stationUserStore.getStationUserViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteStationUser(key);
    }

    async function onLoad() {
        stationUserStore.onStationUserGetPageLoad();
        stationUserStore.onStationUserEditPageLoad();
        stationUserStore.getStationUserViewModel.pageIndex = 0;
        stationUserStore.getStationUserViewModel.pageSize = 20;
        await stationUserStore.getStationUserViewModel.getAllStationUser(new GetStationUserRequest(
            UserContext.info.id,20, 0));
    }

    function onUnload() {
        stationUserStore.onStationUserGetPageUnload();
        stationUserStore.onStationUserEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await stationUserStore.getStationUserViewModel.getAllStationUser(new GetStationUserRequest(UserContext.info.id,
            pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await stationUserStore.getStationUserViewModel.getAllStationUser(new GetStationUserRequest(UserContext.info.id,
            pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("StationUsers.Page.Title")}
                subTitle={i18next.t("StationUsers.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.stationUserList} columns={columns} loading={viewModel?.isProcessing}
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


export default StationUserList;


