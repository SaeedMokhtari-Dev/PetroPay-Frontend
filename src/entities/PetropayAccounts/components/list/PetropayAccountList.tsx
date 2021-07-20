import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./PetropayAccountList.scss";
import Stores from "app/constants/Stores";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, BranchesOutlined
} from '@ant-design/icons';
import GetPetropayAccountsRequest from "../../handlers/get/GetPetropayAccountsRequest";
import i18next from "i18next";
import PetropayAccountsColumns from "./PetropayAccountColumns";
import Routes from "../../../../app/constants/Routes";
import { Link } from "react-router-dom";
import PetropayAccountStore from "../../stores/PetropayAccountStore";

const { confirm } = Modal;


interface PetropayAccountsSidebarProps {
    petropayAccountStore?: PetropayAccountStore
}

const PetropayAccountList: React.FC<PetropayAccountsSidebarProps> = inject(Stores.petropayAccountStore)(observer(({petropayAccountStore}) => {

    PetropayAccountsColumns.forEach(w => {
        w.title = i18next.t(w.title)
    });
    const columns: any[] = [...PetropayAccountsColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        petropayAccountStore.onPetropayAccountGetPageLoad();
        //petropayAccountStore.onPetropayAccountEditPageLoad();
        petropayAccountStore.getPetropayAccountViewModel.pageIndex = 0;
        petropayAccountStore.getPetropayAccountViewModel.pageSize = 20;
        await petropayAccountStore.getPetropayAccountViewModel.getAllPetropayAccounts(new GetPetropayAccountsRequest(20, 0));
    }

    let viewModel = petropayAccountStore.getPetropayAccountViewModel;

    if (!viewModel) return;

    function onUnload() {
        petropayAccountStore.onPetropayAccountGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await petropayAccountStore.getPetropayAccountViewModel.getAllPetropayAccounts(new GetPetropayAccountsRequest(pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await petropayAccountStore.getPetropayAccountViewModel.getAllPetropayAccounts(new GetPetropayAccountsRequest(pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("PetropayAccounts.Page.Title")}
                subTitle={i18next.t("PetropayAccounts.Page.SubTitle")}
                extra={[
                    <Link to={Routes.paymentTransferAccount}>
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} >
                            {i18next.t("General.Button.Add")}
                        </Button>
                    </Link>
                ]}
            />

            <Table dataSource={viewModel?.petropayAccountList} columns={columns} loading={viewModel?.isProcessing}
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

            {/*<EditPetropayAccount />*/}
        </div>
    )
}));


export default PetropayAccountList;


