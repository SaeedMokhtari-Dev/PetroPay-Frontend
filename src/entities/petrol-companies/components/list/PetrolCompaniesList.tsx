import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./PetrolCompaniesList.scss";
import Stores from "app/constants/Stores";
import PetrolCompaniesStore from "entities/petrol-companies/stores/PetrolCompaniesStore";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, BranchesOutlined
} from '@ant-design/icons';
import GetPetrolCompaniesRequest from "../../handlers/get/GetPetrolCompaniesRequest";
import i18next from "i18next";
import PetrolCompaniesColumns from "./PetrolCompaniesColumns";
import Routes from "../../../../app/constants/Routes";
import { Link } from "react-router-dom";

const { confirm } = Modal;


interface PetrolCompaniesSidebarProps {
    petrolCompaniesStore?: PetrolCompaniesStore
}



const PetrolCompaniesList: React.FC<PetrolCompaniesSidebarProps> = inject(Stores.petrolCompaniesStore)(observer(({petrolCompaniesStore}) => {
    const history = useHistory();

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    PetrolCompaniesColumns.forEach(w => {
       w.title = i18next.t(w.title)
    });
    const columns: any[] = [...PetrolCompaniesColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                {/*<Link to={`/app/branch/${record.key}`} title={i18next.t("PetrolCompanies.Button.Branches")}>
                    <Button type="default" icon={<BranchesOutlined />}
                            title={i18next.t("PetrolCompanies.Button.Branches")} />
                </Link>*/}
                <Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                        title={i18next.t("General.Button.Edit")} />
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                        title={i18next.t("General.Button.Delete")} />
            </div>
        )
    }];
    async function showEditPage(e){
        //petrolCompaniesStore.editPetrolCompanyViewModel.key = e.key;
        if(e.key)
        {
            //await petrolCompaniesStore.editPetrolCompanyViewModel.getDetailPetrolCompany(e.key);
            history.push(`/app/petrolCompany/edit/${e.key}`);
        }
        else{
            //petrolCompaniesStore.editPetrolCompanyViewModel.addPetrolCompanyRequest = new AddPetrolCompanyRequest();
            history.push(Routes.addPetrolCompany);
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
    let viewModel = petrolCompaniesStore.getPetrolCompanyViewModel;

    if (!viewModel) return;



    async function onDelete(key: number){
        await viewModel.deletePetrolCompany(key);
    }

    async function onLoad() {
        petrolCompaniesStore.onPetrolCompanyGetPageLoad();
        //petrolCompaniesStore.onPetrolCompanyEditPageLoad();
        petrolCompaniesStore.getPetrolCompanyViewModel.pageIndex = 0;
        petrolCompaniesStore.getPetrolCompanyViewModel.pageSize = 20;
        await petrolCompaniesStore.getPetrolCompanyViewModel.getAllPetrolCompanies(new GetPetrolCompaniesRequest(20, 0));
    }

    function onUnload() {
        petrolCompaniesStore.onPetrolCompanyGetPageUnload();
        //petrolCompaniesStore.onPetrolCompanyEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await petrolCompaniesStore.getPetrolCompanyViewModel.getAllPetrolCompanies(new GetPetrolCompaniesRequest(pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await petrolCompaniesStore.getPetrolCompanyViewModel.getAllPetrolCompanies(new GetPetrolCompaniesRequest(pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("PetrolCompanies.Page.Title")}
                subTitle={i18next.t("PetrolCompanies.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.petrolCompanyList} columns={columns} loading={viewModel?.isProcessing}
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

            {/*<EditPetrolCompany />*/}
        </div>
    )
}));


export default PetrolCompaniesList;


