import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./CompaniesList.scss";
import Stores from "app/constants/Stores";
import CompaniesStore from "companies/stores/CompaniesStore";
import {
    Button,
    Pagination,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import GetCompaniesRequest from "../../handlers/get/GetCompaniesRequest";
import i18next from "i18next";
import CompaniesColumns from "./ComaniesColumns";
import EditCompany from "../company/EditCompany";
import AddCompanyRequest from "../../handlers/add/AddCompanyRequest";
import Routes from "../../../app/constants/Routes";
import NavigationService from "../../../app/services/NavigationService";


const { confirm } = Modal;


interface CompaniesSidebarProps {
    companiesStore?: CompaniesStore
}



const CompaniesList: React.FC<CompaniesSidebarProps> = inject(Stores.companiesStore)(observer(({companiesStore}) => {
    const history = useHistory();
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    const columns: any[] = [...CompaniesColumns, {
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
        debugger;
        companiesStore.editCompanyViewModel.key = e.key;
        if(e.key)
        {
            debugger;
            await companiesStore.editCompanyViewModel.getDetailCompany(e.key);
        }
        else{
            companiesStore.editCompanyViewModel.addCompanyRequest = new AddCompanyRequest();
            history.push(Routes.addCompany);
        }
        history.push(`/app/company/edit/${e.key}`);
    }
    async function showDeleteConfirm(e) {
        console.log(e.key);
        debugger;
        confirm({
            title: i18next.t("General.Confirm.Delete"),
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                console.log(e.key);
                debugger;
                await onDelete(e.key);
            },
            onCancel() {},
        });
    }
    let viewModel = companiesStore.getCompanyViewModel;

    if (!viewModel) return;



    async function onDelete(key: number){
        debugger;
        await viewModel.deleteCompany(key);
    }

    async function onLoad() {
        companiesStore.onCompanyGetPageLoad();
        companiesStore.onCompanyEditPageLoad();
        companiesStore.getCompanyViewModel.pageIndex = 0;
        companiesStore.getCompanyViewModel.pageSize = 20;
        await companiesStore.getCompanyViewModel.getAllCompanies(new GetCompaniesRequest(20, 0));
    }

    function onUnload() {
        companiesStore.onCompanyGetPageUnload();
        companiesStore.onCompanyEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await companiesStore.getCompanyViewModel.getAllCompanies(new GetCompaniesRequest(pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await companiesStore.getCompanyViewModel.getAllCompanies(new GetCompaniesRequest(pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Company"
                subTitle="This is a subtitle"
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.companyList} columns={columns} loading={viewModel?.isProcessing}
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

            {/*<EditCompany />*/}
        </div>
    )
}));


export default CompaniesList;


