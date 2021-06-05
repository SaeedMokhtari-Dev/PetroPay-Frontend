import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import "./PetrolStationListList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker
} from "antd";
import {
    CheckOutlined, CloseOutlined,
    FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetPetrolStationListRequest from "../../handlers/get/GetPetrolStationListRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import PetrolStationListColumns from "./PetrolStationListColumns";
import PetrolStationListStore from "../../stores/PetrolStationListStore";
import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;

interface PetrolStationListListProps {
    petrolStationListStore?: PetrolStationListStore
}

const PetrolStationListList: React.FC<PetrolStationListListProps> = inject(Stores.petrolStationListStore)(observer(({petrolStationListStore}) => {

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
    PetrolStationListColumns.forEach(w => {
       w.title = i18next.t(w.title);
        if(w.key == "stationDiesel")
        {
            w["render"] = (w) => {
                return  w ? <CheckOutlined /> : <CloseOutlined />
            }
        }
    });

    const columns: any[] = [...PetrolStationListColumns];

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        petrolStationListStore.onPetrolStationListGetPageLoad();
        petrolStationListStore.getPetrolStationListViewModel.getPetrolStationListsRequest = new GetPetrolStationListRequest();
        petrolStationListStore.getPetrolStationListViewModel.getPetrolStationListsRequest.pageSize = 20;
        petrolStationListStore.getPetrolStationListViewModel.getPetrolStationListsRequest.pageIndex = 0;

        await petrolStationListStore.getPetrolStationListViewModel.getAllPetrolStationList(petrolStationListStore.getPetrolStationListViewModel.getPetrolStationListsRequest);
    }

    let viewModel = petrolStationListStore.getPetrolStationListViewModel;

    if (!viewModel) return;

    function onUnload() {
        petrolStationListStore.onPetrolStationListGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getPetrolStationListsRequest.pageSize = pageSize;
        viewModel.getPetrolStationListsRequest.pageIndex = pageIndex - 1;
        await petrolStationListStore.getPetrolStationListViewModel.getAllPetrolStationList(viewModel.getPetrolStationListsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getPetrolStationListsRequest.pageSize = pageSize;
        viewModel.getPetrolStationListsRequest.pageIndex = 0;
        await petrolStationListStore.getPetrolStationListViewModel.getAllPetrolStationList(viewModel.getPetrolStationListsRequest);
    }
    function onChanged(e){
        viewModel.getPetrolStationListsRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getPetrolStationListsRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getPetrolStationListsRequest.pageIndex = 0;
        await viewModel.getAllPetrolStationList(viewModel.getPetrolStationListsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getPetrolStationListsRequest.pageSize;
        viewModel.getPetrolStationListsRequest = new GetPetrolStationListRequest();
        viewModel.getPetrolStationListsRequest.pageIndex = 0;
        viewModel.getPetrolStationListsRequest.pageSize = pageSize;

        await viewModel.getAllPetrolStationList(viewModel.getPetrolStationListsRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        await viewModel.getAllPetrolStationList(viewModel.getPetrolStationListsRequest, true);
        ExportExcel(columns, viewModel?.petrolStationListExport, "PetrolStationList");
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("PetrolStationList.Page.Title")}
                subTitle={i18next.t("PetrolStationList.Page.SubTitle")}
                extra={[
                    <Button key={"ExportExcel"} type="primary" loading={viewModel?.isProcessing} icon={<FileExcelOutlined />} onClick={ExportToExcel}>
                        {i18next.t("General.Button.ExportExcel")}
                    </Button>
                    ,
                ]}
            />

            <Collapse>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        <Row gutter={[24, 16]}>
                            {UserContext.info.role === 100 || UserContext.info.role === 1 ?
                                <Col span={8}>
                                    <Form.Item name="region" initialValue={viewModel?.getPetrolStationListsRequest?.region}
                                               key={"region"}
                                               label={i18next.t("PetrolStationLists.SearchPanel.Label.region")}>
                                        <Input onChange={onChanged}/>
                                    </Form.Item>
                                </Col>: ""}
                        </Row>
                        <PageHeader
                            ghost={false}
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
            <Table dataSource={viewModel?.petrolStationListList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} scroll={{ x: 1500 }} sticky />
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


export default PetrolStationListList;


