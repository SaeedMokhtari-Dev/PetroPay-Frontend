import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./PromotionCouponsList.scss";
import Stores from "app/constants/Stores";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import PromotionCouponsColumns from "./PromotionCouponsColumns";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetPromotionCouponRequest from "../../handlers/get/GetPromotionCouponRequest";
import PromotionCouponStore from "../../stores/PromotionCouponStore";


const { confirm } = Modal;


interface PromotionCouponsSidebarProps {
    promotionCouponStore?: PromotionCouponStore
}



const PromotionCouponsList: React.FC<PromotionCouponsSidebarProps> = inject(Stores.promotionCouponStore)(observer(({promotionCouponStore}) => {
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    PromotionCouponsColumns.forEach(w => {
       w.title = i18next.t(w.title);
        if(w.key === "couponActive")
        {
            w["render"] = (w) => {
                return  w ? <CheckOutlined /> : <CloseOutlined />
            }
        }
    });
    const columns: any[] = [...PromotionCouponsColumns, {
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
        //promotionCouponStore.editPromotionCouponViewModel.key = e.key;
        
        if(e.key)
        {
            //await promotionCouponStore.editPromotionCouponViewModel.getDetailPromotionCoupon(e.key);
            NavigationService.navigate(`/app/promotionCoupon/edit/${e.key}`);
        }
        else{
            //promotionCouponStore.editPromotionCouponViewModel.addPromotionCouponRequest = new AddPromotionCouponRequest();
            NavigationService.navigate(Routes.addPromotionCoupon);
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
    let viewModel = promotionCouponStore.getPromotionCouponViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deletePromotionCoupon(key);
    }

    async function onLoad() {
        promotionCouponStore.onPromotionCouponGetPageLoad();
        //promotionCouponStore.onPromotionCouponEditPageLoad();
        promotionCouponStore.getPromotionCouponViewModel.pageIndex = 0;
        promotionCouponStore.getPromotionCouponViewModel.pageSize = 20;
        await promotionCouponStore.getPromotionCouponViewModel.getAllPromotionCoupons(new GetPromotionCouponRequest(20, 0));
    }

    function onUnload() {
        promotionCouponStore.onPromotionCouponGetPageUnload();
        //promotionCouponStore.onPromotionCouponEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await promotionCouponStore.getPromotionCouponViewModel.getAllPromotionCoupons(new GetPromotionCouponRequest(pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await promotionCouponStore.getPromotionCouponViewModel.getAllPromotionCoupons(new GetPromotionCouponRequest(pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("PromotionCoupons.Page.Title")}
                subTitle={i18next.t("PromotionCoupons.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.promotionCouponList} columns={columns} loading={viewModel?.isProcessing}
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


export default PromotionCouponsList;


