import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./CarList.scss";
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
import CarColumns from "./CarColumns";
import AddCarRequest from "../../handlers/add/AddCarRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetCarRequest from "../../handlers/get/GetCarRequest";
import CarStore from "../../stores/CarStore";
import UserContext from "../../../../identity/contexts/UserContext";


const { confirm } = Modal;


interface CarListProps {
    carStore?: CarStore;
    match?: any;
}



const CarList: React.FC<CarListProps> = inject(Stores.carStore)(observer(({carStore, match}) => {
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);
    const boolProps = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday",
        "carDriverActive", "carWorkWithApproval", "carApprovedOneTime", "workAllDays", "carNeedPlatePhoto"];
    CarColumns.forEach(w => {
       w.title = i18next.t(w.title);
       if(boolProps.includes(w.key))
       {
           w["render"] = (w) => {
               return  w ? <CheckOutlined /> : <CloseOutlined />
           }
       }
    });
    const columns: any[] = [...CarColumns, {
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
        carStore.editCarViewModel.key = e.key;
        if(e.key)
        {
            await carStore.editCarViewModel.getDetailCar(e.key);
            NavigationService.navigate(`/app/car/edit/${e.key}`);
        }
        else{
            carStore.editCarViewModel.addCarRequest = new AddCarRequest();
            NavigationService.navigate(`/app/car/add/${viewModel.companyBranchId}`);
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
    let viewModel = carStore.getCarViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteCar(key, +match.params.companyBranchId);
    }

    async function onLoad() {
        carStore.onCarGetPageLoad();
        carStore.onCarEditPageLoad();
        carStore.getCarViewModel.pageIndex = 0;
        carStore.getCarViewModel.pageSize = 20;
        const companyBranchId: number = +match.params.companyBranchId;
        carStore.getCarViewModel.companyBranchId = companyBranchId;
        await carStore.getCarViewModel.getAllCar(new GetCarRequest(
            companyBranchId,20, 0));
    }

    function onUnload() {
        carStore.onCarGetPageUnload();
        carStore.onCarEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await carStore.getCarViewModel.getAllCar(new GetCarRequest(viewModel.companyBranchId,
            pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await carStore.getCarViewModel.getAllCar(new GetCarRequest(viewModel.companyBranchId,
            pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Cars.Page.Title")}
                subTitle={i18next.t("Cars.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.carList} columns={columns} loading={viewModel?.isProcessing}
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


export default CarList;


