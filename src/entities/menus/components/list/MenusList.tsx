import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./MenusList.scss";
import Stores from "app/constants/Stores";
import MenuStore from "entities/menus/stores/MenuStore";
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
import MenusColumns from "./MenusColumns";
import AddMenuRequest from "../../handlers/add/AddMenuRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetMenuRequest from "../../handlers/get/GetMenuRequest";


const { confirm } = Modal;

interface MenusSidebarProps {
    menuStore?: MenuStore
}

const MenusList: React.FC<MenusSidebarProps> = inject(Stores.menuStore)(observer(({menuStore}) => {
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    MenusColumns.forEach(w => {
       w.title = i18next.t(w.title)
        if(w.key === "isActive")
        {
            w["render"] = (w) => {
                return  w ? <CheckOutlined /> : <CloseOutlined />
            }
        }
    });
    const columns: any[] = [...MenusColumns, {
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
        //menuStore.editMenuViewModel.key = e.key;
        if(e.key)
        {
            //await menuStore.editMenuViewModel.getDetailMenu(e.key);
            NavigationService.navigate(`/app/menu/edit/${e.key}`);
        }
        else{
            //menuStore.editMenuViewModel.addMenuRequest = new AddMenuRequest();
            NavigationService.navigate(Routes.addMenu);
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
    let viewModel = menuStore.getMenuViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteMenu(key);
    }

    async function onLoad() {
        menuStore.onMenuGetPageLoad();
        //menuStore.onMenuEditPageLoad();
        menuStore.getMenuViewModel.pageIndex = 0;
        menuStore.getMenuViewModel.pageSize = 20;
        await menuStore.getMenuViewModel.getAllMenus(new GetMenuRequest(20, 0));
    }

    function onUnload() {
        menuStore.onMenuGetPageUnload();
        //menuStore.onMenuEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await menuStore.getMenuViewModel.getAllMenus(new GetMenuRequest(pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await menuStore.getMenuViewModel.getAllMenus(new GetMenuRequest(pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Menus.Page.Title")}
                subTitle={i18next.t("Menus.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.menuList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky/>
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


export default MenusList;


