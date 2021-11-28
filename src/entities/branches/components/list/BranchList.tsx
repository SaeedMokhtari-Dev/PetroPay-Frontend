import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./BranchList.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Pagination, Form, InputNumber,
    Table, Modal, PageHeader
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, CarOutlined, DollarOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import BranchColumns from "./BranchColumns";
import AddBranchRequest from "../../handlers/add/AddBranchRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetBranchRequest from "../../handlers/get/GetBranchRequest";
import BranchStore from "../../stores/BranchStore";
import UserContext from "../../../../identity/contexts/UserContext";
import ChangeUserPasswordHandler from "../../../../auth/common/handlers/change-user-password/ChangeUserPasswordHandler";
import ChangeUserPasswordRequest from "../../../../auth/common/handlers/change-user-password/ChangeUserPasswordRequest";
import ChargeBalanceBranchHandler from "../../handlers/chargeBalance/ChargeBalanceBranchHandler";


const { confirm } = Modal;


interface BranchListProps {
    branchStore?: BranchStore;
    match?: any;
}



const BranchList: React.FC<BranchListProps> = inject(Stores.branchStore)(observer(({branchStore, match}) => {
    const [companyId, setCompanyId] = React.useState(0);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [selectedBranchId, setSelectedBranchId] = React.useState(0);
    const [increaseAmount, setIncreaseAmount] = React.useState(0);
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    BranchColumns.forEach(w => {
       w.title = i18next.t(w.title);
       if(w.key === "companyBranchActiva")
       {
           w["render"] = (w) => {
               return  w ? <CheckOutlined /> : <CloseOutlined />
           }
       }
    });
    const columns: any[] = [...BranchColumns, {
        title: i18next.t("General.Column.Action"),
        dataIndex: 'operation',
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
            <div className="inline">
                {(!record.companyBranchActiva) &&
                (
                    <div>
                        <Button type="default"  icon={<CheckCircleOutlined />} onClick={() => showActivation(record)}
                                title={i18next.t("Subscriptions.Button.AcceptRequest")} style={{ background: "green", borderColor: "white" }}/>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                                title={i18next.t("General.Button.Edit")} />
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                                title={i18next.t("General.Button.Delete")} />
                    </div>
                )}
                {record.companyBranchActiva &&
                    <div>
                        <Button type="default" icon={<CarOutlined/>} onClick={() => showCarPage(record)}
                                title={i18next.t("Branches.Button.CarList")}/>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => showEditPage(record)}
                                title={i18next.t("General.Button.Edit")} />
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)}
                                title={i18next.t("General.Button.Delete")} />
                        {/*<Button type="primary" icon={<DollarOutlined/>} onClick={() => showChargeBalanceBranchModal(record)}
                                title={i18next.t("Branches.Button.ChargeBalanceBranch")}/>*/}
                    </div>
                }
            </div>
        )
    }];
    function showChargeBalanceBranchModal(e){
        setSelectedBranchId(e.key);
        setModalVisible(true);
    }
    async function onActive(key: number){
        await viewModel.activeBranch(key, companyId);
    }
    async function showActivation(e) {
        console.log(e.key);
        confirm({
            title: i18next.t("General.Confirm.Active"),
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                console.log(e.key);
                await onActive(e.key);
            },
            onCancel() {},
        });
    }
    function showCarPage(e){
        NavigationService.navigate(`/app/car/${e.key}/list`);
    }
    async function showEditPage(e){
        if(e.key)
        {
            //await branchStore.editBranchViewModel.getDetailBranch(e.key);
            NavigationService.navigate(`/app/branch/edit/${e.key}`);
        }
        else{
            //branchStore.editBranchViewModel.addBranchRequest = new AddBranchRequest();
            NavigationService.navigate(Routes.addBranch);
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
    let viewModel = branchStore.getBranchViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteBranch(key, companyId);
    }

    async function onLoad() {
        branchStore.onBranchGetPageLoad();
        //branchStore.onBranchEditPageLoad();

        let companyIdParam = 0;
        if(match.params?.companyId){
            companyIdParam = +match.params?.companyId;
        }
        else {
            companyIdParam = UserContext.info.id;
        }
        branchStore.getBranchViewModel.pageIndex = 0;
        branchStore.getBranchViewModel.pageSize = 20;
        await branchStore.getBranchViewModel.getAllBranch(new GetBranchRequest(
            companyIdParam,20, 0));

        setCompanyId(companyIdParam);
    }

    function onUnload() {
        branchStore.onBranchGetPageUnload();
        setCompanyId(0);
        setModalVisible(false);
        setLoading(false);
        setSelectedBranchId(0);
        setIncreaseAmount(0);
        //branchStore.onBranchEditPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        await branchStore.getBranchViewModel.getAllBranch(new GetBranchRequest(companyId,
            pageSize, pageIndex - 1));
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        await branchStore.getBranchViewModel.getAllBranch(new GetBranchRequest(companyId,
            pageSize, 0));
    }
    async function handleChargeBalanceBranch(){
        setLoading(true);
        await viewModel?.ChargeBalanceBranch(selectedBranchId, increaseAmount, companyId);
        setLoading(false);
        if(!viewModel.errorMessage)
            setModalVisible(false)
    }
    function handleCancel(){
        
        setSelectedBranchId(0);
        setIncreaseAmount(0);
        setModalVisible(false)
    }
    function onIncreaseAmountChanged(e){
        
        setIncreaseAmount(e);
        //pageStore.changeUserPasswordRequest.currentPassword = e.target.value;
        //bundlesStore.editBundleViewModel.editBundleRequest[`${e.target.id}`] = e.target.value;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("Branches.Page.Title")}
                subTitle={i18next.t("Branches.Page.SubTitle")}
                extra={[
                        <Button hidden={UserContext.info.role == 100} key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />

            <Table dataSource={viewModel?.branchList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky
                   rowClassName={(record, index) => (record.companyBranchActiva ? "green" : "red")}/>
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

            <Modal
                title={i18next.t("Branches.Button.ChargeBalanceBranch")}
                centered
                visible={modalVisible}
                destroyOnClose={true}
                closable={false}
                footer={[
                    <Button type={"default"} loading={isLoading} danger key="cancel" onClick={handleCancel}>
                        {i18next.t("General.Add.CancelButton")}
                    </Button>,
                    <Button type={"primary"} loading={isLoading} form="ChargeBalanceBranchForm" key="submit" htmlType="submit">
                        {i18next.t("Branches.Button.Charge")}
                    </Button>
                ]}
            >
                <Form {...layout} form={form} onFinish={handleChargeBalanceBranch}
                      key={"ChargeBalanceBranchForm"} id={"ChargeBalanceBranchForm"}>
                    <Form.Item name="increaseAmount" initialValue={increaseAmount}
                               key={"increaseAmount"}
                               label={i18next.t("Branches.Label.increaseAmount")}
                               rules={[
                                   {
                                       required: true,
                                       message: i18next.t("Branches.Validation.Message.increaseAmount.Required")
                                   }
                               ]}>
                        <InputNumber
                            max = {UserContext?.info?.balance}
                            precision={2}
                            style={{width: '100%'}}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={onIncreaseAmountChanged}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}));


export default BranchList;


