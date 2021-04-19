import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./BundlesList.scss";
import Stores from "app/constants/Stores";
import BundlesStore from "entities/bundles/stores/BundlesStore";
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
import BundlesColumns from "./BundlesColumns";
import AddBundleRequest from "../../handlers/add/AddBundleRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetBundleRequest from "../../handlers/get/GetBundleRequest";


const { confirm } = Modal;


interface BundlesSidebarProps {
    bundlesStore?: BundlesStore
}



const BundlesList: React.FC<BundlesSidebarProps> = inject(Stores.bundlesStore)(observer(({bundlesStore}) => {
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    BundlesColumns.forEach(w => {
       w.title = i18next.t(w.title)
    });
    const columns: any[] = [...BundlesColumns, {
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
        bundlesStore.editBundleViewModel.key = e.key;
        if(e.key)
        {
            await bundlesStore.editBundleViewModel.getDetailBundle(e.key);
            NavigationService.navigate(`/app/bundle/edit/${e.key}`);
        }
        else{
            bundlesStore.editBundleViewModel.addBundleRequest = new AddBundleRequest();
            NavigationService.navigate(Routes.addBundle);
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
    let viewModel = bundlesStore.getBundleViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteBundle(key);
    }

    async function onLoad() {
        bundlesStore.onBundleGetPageLoad();
        bundlesStore.onBundleEditPageLoad();
        bundlesStore.getBundleViewModel.pageIndex = 0;
        bundlesStore.getBundleViewModel.pageSize = 20;
        await bundlesStore.getBundleViewModel.getAllBundles(new GetBundleRequest(20, 0));
    }

    function onUnload() {
        bundlesStore.onBundleGetPageUnload();
        bundlesStore.onBundleEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await bundlesStore.getBundleViewModel.getAllBundles(new GetBundleRequest(pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await bundlesStore.getBundleViewModel.getAllBundles(new GetBundleRequest(pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Bundles.Page.Title")}
                subTitle={i18next.t("Bundles.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.bundleList} columns={columns} loading={viewModel?.isProcessing}
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


export default BundlesList;


