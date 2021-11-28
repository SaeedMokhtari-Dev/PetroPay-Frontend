import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { useHistory } from "react-router-dom";
import "./StationUserList.scss";
import Stores from "app/constants/Stores";

import {
    Button,
    Pagination,
    Table, Modal, PageHeader, Collapse, Form, Row, Col, Select, Input, DatePicker, Alert
} from "antd";
import {
    EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined,
    ExclamationCircleOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import StationUserColumns from "./StationUserColumns";
import AddStationUserRequest from "../../handlers/add/AddStationUserRequest";
import Routes from "../../../../app/constants/Routes";
import NavigationService from "../../../../app/services/NavigationService";
import GetStationUserRequest from "../../handlers/get/GetStationUserRequest";
import StationUserStore from "../../stores/StationUserStore";
import UserContext from "../../../../identity/contexts/UserContext";
import GetStationReportRequest from "../../../../reports/StationReports/handlers/get/GetStationReportRequest";

const { confirm } = Modal;
const { Panel } = Collapse;
const { Option } = Select;

interface StationUserListProps {
    stationUserStore?: StationUserStore
}

const StationUserList: React.FC<StationUserListProps> = inject(Stores.stationUserStore)(observer(({stationUserStore}) => {

    const [petroStationOptions, setPetroStationOptions] = React.useState([]);

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
    };
    const [form] = Form.useForm();

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);


    StationUserColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    const columns: any[] = [...StationUserColumns, {
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

    async function onLoad() {
        stationUserStore.onStationUserGetPageLoad();
        
        //stationUserStore.onStationUserEditPageLoad();
        stationUserStore.getStationUserViewModel.pageIndex = 0;
        stationUserStore.getStationUserViewModel.pageSize = 20;

        stationUserStore.getStationUserViewModel.getStationUsersRequest = new GetStationUserRequest();
        stationUserStore.getStationUserViewModel.getStationUsersRequest.pageIndex = stationUserStore.getStationUserViewModel.pageIndex;
        stationUserStore.getStationUserViewModel.getStationUsersRequest.pageSize = stationUserStore.getStationUserViewModel.pageSize;
        if(UserContext.info.role === 10) {
            stationUserStore.getStationUserViewModel.getStationUsersRequest.stationCompanyId = UserContext.info.id;
            await stationUserStore.listPetroStationViewModel.getPetroStationList(UserContext.info.id);
            let petroStationOptions = [];
            if (stationUserStore.listPetroStationViewModel) {
                for (let item of stationUserStore.listPetroStationViewModel.listPetroStationResponse.items) {
                    petroStationOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                }
            }
            setPetroStationOptions(petroStationOptions);
        }

        if(UserContext.info.role === 15)
            stationUserStore.getStationUserViewModel.getStationUsersRequest.stationId = UserContext.info.id;

        await stationUserStore.getStationUserViewModel.getAllStationUser(stationUserStore.getStationUserViewModel.getStationUsersRequest);
    }


    async function showEditPage(e){
        //stationUserStore.editStationUserViewModel.key = e.key;
        if(e.key)
        {
            //await stationUserStore.editStationUserViewModel.getDetailStationUser(e.key);
            NavigationService.navigate(`/app/stationUser/edit/${e.key}`);
        }
        else{
            //stationUserStore.editStationUserViewModel.addStationUserRequest = new AddStationUserRequest();
            NavigationService.navigate(Routes.addStationUser);
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
    let viewModel = stationUserStore.getStationUserViewModel;

    if (!viewModel) return;

    async function onDelete(key: number){
        await viewModel.deleteStationUser(key);
    }


    function onUnload() {
        stationUserStore.onStationUserGetPageUnload();
    }

    async function onFinish(values: any) {
        viewModel.getStationUsersRequest.pageIndex = 0;
        await viewModel.getAllStationUser(viewModel.getStationUsersRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getStationUsersRequest.pageSize;
        viewModel.getStationUsersRequest = new GetStationUserRequest();
        viewModel.getStationUsersRequest.pageIndex = 0;
        viewModel.getStationUsersRequest.pageSize = pageSize;
        if(UserContext.info.role === 10){
            viewModel.getStationUsersRequest.stationCompanyId = UserContext.info.id;
        }
        if(UserContext.info.role === 15){
            viewModel.getStationUsersRequest.stationId = UserContext.info.id;
        }
        await viewModel.getAllStationUser(viewModel.getStationUsersRequest);
        form.resetFields();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.pageIndex = pageIndex - 1;
        viewModel.pageSize = pageSize;
        stationUserStore.getStationUserViewModel.getStationUsersRequest.pageIndex = viewModel.pageIndex;
        stationUserStore.getStationUserViewModel.getStationUsersRequest.pageSize = viewModel.pageSize;
        await stationUserStore.getStationUserViewModel.getAllStationUser(stationUserStore.getStationUserViewModel.getStationUsersRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.pageIndex = 0;
        viewModel.pageSize = pageSize;
        stationUserStore.getStationUserViewModel.getStationUsersRequest.pageIndex = viewModel.pageIndex;
        stationUserStore.getStationUserViewModel.getStationUsersRequest.pageSize = viewModel.pageSize;
        await stationUserStore.getStationUserViewModel.getAllStationUser(stationUserStore.getStationUserViewModel.getStationUsersRequest);
    }

    function onSelectChanged(e, propName){
        viewModel.getStationUsersRequest[`${propName}`] = e;

        /*if(propName === "stationId") {
            const filteredStationUsers = stationReportStore.listStationUserViewModel.listStationUserResponse.items.filter(w => w.stationId == e);
            let stationUserOptions = [];
            if (stationReportStore.listStationUserViewModel) {
                for (let item of filteredStationUsers) {
                    stationUserOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                }
            }
            setStationUserOptions(stationUserOptions);
        }*/
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("StationUsers.Page.Title")}
                subTitle={i18next.t("StationUsers.Page.SubTitle")}
                extra={[
                        <Button key={"Add"} type="primary" icon={<PlusCircleOutlined />} onClick={showEditPage}>
                            {i18next.t("General.Button.Add")}
                        </Button>
                    ,
                ]}
            />
            <Collapse defaultActiveKey={['1']}>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        <Row gutter={[24, 16]}>
                            {UserContext.info.role === 10 ?
                                <React.Fragment>
                                    <Col span={8}>
                                        <Form.Item name="stationWorkerId"
                                                   key={"stationWorkerId"}
                                                   label={i18next.t("StationReports.SearchPanel.Label.stationWorkerId")}>
                                            <Select style={{width: "100%", display:"block"}} allowClear={true}
                                                    showSearch={true} onChange={(e) => onSelectChanged(e, "stationId")}>
                                                {petroStationOptions}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </React.Fragment>: "" }
                        </Row>
                        <PageHeader
                            ghost={false}
                            subTitle={<div>
                                {viewModel?.errorMessage &&
                                <Alert message={viewModel?.errorMessage} type="error" />
                                }
                            </div>}
                            extra={[
                                <Button type="primary" loading={viewModel.isProcessing} onClick={onReset} danger key="reset" size={"large"} htmlType="reset">
                                    {i18next.t("General.SearchPanel.ResetButton")}
                                </Button>,
                                <Button type="primary" loading={viewModel.isProcessing} key="submit" size={"large"} htmlType="submit">
                                    {i18next.t("General.SearchPanel.SearchButton")}
                                </Button>
                            ]}
                        />
                    </Form>
                </Panel>
            </Collapse>
            <br/>
            <Table dataSource={viewModel?.stationUserList} columns={columns} loading={viewModel?.isProcessing}
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


export default StationUserList;


