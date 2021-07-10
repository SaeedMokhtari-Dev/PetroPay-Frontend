import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./EmployeesList.scss";
import Stores from "app/constants/Stores";
import EmployeeStore from "entities/employees/stores/EmployeeStore";
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
import EmployeesColumns from "./EmployeesColumns";
import AddEmployeeRequest from "../../handlers/add/AddEmployeeRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetEmployeeRequest from "../../handlers/get/GetEmployeeRequest";


const { confirm } = Modal;


interface EmployeesSidebarProps {
    employeeStore?: EmployeeStore
}



const EmployeesList: React.FC<EmployeesSidebarProps> = inject(Stores.employeeStore)(observer(({employeeStore}) => {
    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    EmployeesColumns.forEach(w => {
       w.title = i18next.t(w.title)
    });
    const columns: any[] = [...EmployeesColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">

                    {/*<Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                            title={i18next.t("General.Button.Edit")} />
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                        title={i18next.t("General.Button.Delete")} />*/}
            </div>
        )
    }];
    async function showEditPage(e){
        //employeeStore.editEmployeeViewModel.key = e.key;
        if(e.key)
        {
            //await employeeStore.editEmployeeViewModel.getDetailEmployee(e.key);
            NavigationService.navigate(`/app/employee/edit/${e.key}`);
        }
        else{
            //employeeStore.editEmployeeViewModel.addEmployeeRequest = new AddEmployeeRequest();
            NavigationService.navigate(Routes.addEmployee);
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
    let viewModel = employeeStore.getEmployeeViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteEmployee(key);
    }

    async function onLoad() {
        employeeStore.onEmployeeGetPageLoad();
        //employeeStore.onEmployeeEditPageLoad();
        employeeStore.getEmployeeViewModel.pageIndex = 0;
        employeeStore.getEmployeeViewModel.pageSize = 20;
        await employeeStore.getEmployeeViewModel.getAllEmployees(new GetEmployeeRequest(20, 0));
    }

    function onUnload() {
        employeeStore.onEmployeeGetPageUnload();
        //employeeStore.onEmployeeEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await employeeStore.getEmployeeViewModel.getAllEmployees(new GetEmployeeRequest(pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await employeeStore.getEmployeeViewModel.getAllEmployees(new GetEmployeeRequest(pageSize, 0));
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Emplyees.Page.Title")}
                subTitle={i18next.t("Emplyees.Page.SubTitle")}
               /* extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}*/
            />

            <Table dataSource={viewModel?.employeeList} columns={columns} loading={viewModel?.isProcessing}
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


export default EmployeesList;


