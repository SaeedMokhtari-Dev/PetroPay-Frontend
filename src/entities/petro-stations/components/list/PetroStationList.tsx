import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./PetroStationList.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CarOutlined, DollarOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import PetroStationColumns from "./PetroStationColumns";
import AddPetroStationRequest from "../../handlers/add/AddPetroStationRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetPetroStationRequest from "../../handlers/get/GetPetroStationRequest";
import PetroStationStore from "../../stores/PetroStationStore";
import UserContext from "../../../../identity/contexts/UserContext";


const { confirm } = Modal;


interface PetroStationListProps {
    petroStationStore?: PetroStationStore;
    match?: any;
}

const PetroStationList: React.FC<PetroStationListProps> = inject(Stores.petroStationStore)(observer(({petroStationStore, match}) => {
    const [petrolCompanyId, setPetrolCompanyId] = React.useState(0);
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    PetroStationColumns.forEach(w => {
       w.title = i18next.t(w.title);
       if(["stationDiesel", "stationServiceActive", "stationServiceDeposit"].includes(w.key))
       {
           w["render"] = (w) => {
               return  w ? <CheckOutlined /> : <CloseOutlined />
           }
       }
    });

    const columns: any[] = [...PetroStationColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                <Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                        title={i18next.t("General.Button.Edit")} />
                {UserContext.info.role === 100 ?
                    <React.Fragment>
                        <Link to={`/app/petroStation/payment/${record.key}`}>
                            <Button type="default" icon={<DollarOutlined/>}
                                    title={i18next.t("PetroStations.Button.Payment")}/>
                        </Link>
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                                title={i18next.t("General.Button.Delete")} />
                    </React.Fragment>
                    : "" }
            </div>
        )
    }];
    async function showEditPage(e){
        //petroStationStore.editPetroStationViewModel.key = e.key;
        if(e.key)
        {
            //await petroStationStore.editPetroStationViewModel.getDetailPetroStation(e.key);
            NavigationService.navigate(`/app/petroStation/edit/${e.key}`);
        }
        else{
            //petroStationStore.editPetroStationViewModel.addPetroStationRequest = new AddPetroStationRequest();
            NavigationService.navigate(Routes.addPetroStation);
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
    let viewModel = petroStationStore.getPetroStationViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deletePetroStation(key);
    }

    async function onLoad() {
        petroStationStore.onPetroStationGetPageLoad();

        petroStationStore.getPetroStationViewModel.pageIndex = 0;
        petroStationStore.getPetroStationViewModel.pageSize = 20;

        let petrolCompanyIdParam: number = null;
        if(match.params?.petrolCompanyId){
            petrolCompanyIdParam = +match.params?.petrolCompanyId;
        }
        if(UserContext.info.role === 10) {
            petrolCompanyIdParam = UserContext.info.id;
        }

        await petroStationStore.getPetroStationViewModel.getAllPetroStation(new GetPetroStationRequest(
            20, 0, petrolCompanyIdParam));

        setPetrolCompanyId(petrolCompanyIdParam);
    }

    function onUnload() {
        petroStationStore.onPetroStationGetPageUnload();
        //petroStationStore.onPetroStationEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await petroStationStore.getPetroStationViewModel.getAllPetroStation(new GetPetroStationRequest(
            pageSize, pageIndex - 1, petrolCompanyId));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await petroStationStore.getPetroStationViewModel.getAllPetroStation(new GetPetroStationRequest(
            pageSize, 0, petrolCompanyId));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("PetroStations.Page.Title")}
                subTitle={i18next.t("PetroStations.Page.SubTitle")}
                extra={[
                    UserContext.info.role === 100 ? <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button> : ""
                    ,
                ]}
            />

            <Table dataSource={viewModel?.petroStationList} columns={columns} loading={viewModel?.isProcessing}
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


export default PetroStationList;


