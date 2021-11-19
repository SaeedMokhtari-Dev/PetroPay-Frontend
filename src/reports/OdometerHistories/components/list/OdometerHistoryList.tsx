import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./OdometerHistoryList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Select, Alert, Spin
} from "antd";
import {
    FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetOdometerHistoryRequest from "../../handlers/get/GetOdometerHistoryRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import OdometerHistoryColumns from "./OdometerHistoryColumns";
import OdometerHistoryStore from "../../stores/OdometerHistoryStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import Constants from "../../../../app/constants/Constants";

const { Panel } = Collapse;
const { Option } = Select;

interface OdometerHistoryListProps {
    odometerHistoryStore?: OdometerHistoryStore
}

const OdometerHistoryList: React.FC<OdometerHistoryListProps> = inject(Stores.odometerHistoryStore)(observer(({odometerHistoryStore}) => {
    const [dataFetched, setDataFetched] = React.useState(false);
    const [carOptions, setCarOptions] = React.useState([]);
    const [branchOptions, setBranchOptions] = React.useState([]);
    const [companyOptions, setCompanyOptions] = React.useState([]);

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
    OdometerHistoryColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    //const companyColumn = {title: i18next.t("OdometerHistories.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};

    let columns: any[] = [...OdometerHistoryColumns];
    /*if(UserContext.info.role == 100)
    {
        columns.unshift(companyColumn);
    }*/

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        odometerHistoryStore.onOdometerHistoryGetPageLoad();
        odometerHistoryStore.getOdometerHistoryViewModel.getOdometerHistoriesRequest = new GetOdometerHistoryRequest();
        odometerHistoryStore.getOdometerHistoryViewModel.getOdometerHistoriesRequest.pageSize = 20;
        odometerHistoryStore.getOdometerHistoryViewModel.getOdometerHistoriesRequest.pageIndex = 0;
        if(UserContext.info.role == 1){
            odometerHistoryStore.getOdometerHistoryViewModel.getOdometerHistoriesRequest.companyId = UserContext.info.id;
        }

        try {
            if (UserContext.info.role === 100) {
                await odometerHistoryStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (odometerHistoryStore.listCompanyViewModel) {
                    for (let item of odometerHistoryStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }
            if(UserContext.info.role === 1) {
                await odometerHistoryStore.listBranchViewModel.getBranchList();
                let branchOptions = [];
                for (let item of odometerHistoryStore.listBranchViewModel.listBranchResponse.items) {
                    branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                }
                setBranchOptions(branchOptions);
            }

            await odometerHistoryStore.listCarViewModel.getCarList();

            let carOptions = [];
            if(UserContext.info.role !== 5) {
                for (let item of odometerHistoryStore.listCarViewModel.listCarResponse.items) {
                    carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
                }
            }
            else{
                const filteredCars = odometerHistoryStore.listCarViewModel.listCarResponse.items.filter(w => w.branchId == UserContext.info.id);
                for (let item of filteredCars) {
                    carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
                }
            }
            setCarOptions(carOptions);



            setDataFetched(true);
        }
        catch {

        }
    }

    let viewModel = odometerHistoryStore.getOdometerHistoryViewModel;

    if (!viewModel) return;

    function onUnload() {
        odometerHistoryStore.onOdometerHistoryGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getOdometerHistoriesRequest.pageSize = pageSize;
        viewModel.getOdometerHistoriesRequest.pageIndex = pageIndex - 1;
        await odometerHistoryStore.getOdometerHistoryViewModel.getAllOdometerHistory(viewModel.getOdometerHistoriesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getOdometerHistoriesRequest.pageSize = pageSize;
        viewModel.getOdometerHistoriesRequest.pageIndex = 0;
        await odometerHistoryStore.getOdometerHistoryViewModel.getAllOdometerHistory(viewModel.getOdometerHistoriesRequest);
    }
    function onChanged(e){
        viewModel.getOdometerHistoriesRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getOdometerHistoriesRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getOdometerHistoriesRequest.pageIndex = 0;
        await viewModel.getAllOdometerHistory(viewModel.getOdometerHistoriesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getOdometerHistoriesRequest.pageSize;
        viewModel.getOdometerHistoriesRequest = new GetOdometerHistoryRequest();
        viewModel.getOdometerHistoriesRequest.pageIndex = 0;
        viewModel.getOdometerHistoriesRequest.pageSize = pageSize;
        if(UserContext.info.role == 1){
            odometerHistoryStore.getOdometerHistoryViewModel.getOdometerHistoriesRequest.companyId = UserContext.info.id;
        }
        await viewModel.getAllOdometerHistory(viewModel.getOdometerHistoriesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.odometerHistoryExport = [];
        await viewModel.getAllOdometerHistory(viewModel.getOdometerHistoriesRequest, true);
        if(viewModel.odometerHistoryExport && viewModel?.odometerHistoryExport?.length > 0)
            ExportExcel(columns, viewModel?.odometerHistoryExport, "OdometerHistory");
    }
    function onSelectChanged(e, propName){
        viewModel.getOdometerHistoriesRequest[`${propName}`] = e;
        if(propName === "companyId") {
            let carOptions = [];
            const filteredCars = odometerHistoryStore.listCarViewModel.listCarResponse.items.filter(w => w.companyId == e);
            for (let item of filteredCars) {
                carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);

            let branchOptions = [];
            const filteredBranches = odometerHistoryStore.listBranchViewModel.listBranchResponse.items.filter(w => w.companyId == e);
            for (let item of filteredBranches) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);
        }
        if(propName === "companyBranchId") {
            let carOptions = [];
            const filteredCars = odometerHistoryStore.listCarViewModel.listCarResponse.items.filter(w => w.branchId == e);
            for (let item of filteredCars) {
                carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);
        }
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("OdometerHistories.Page.Title")}
                subTitle={i18next.t("OdometerHistories.Page.SubTitle")}
                extra={[
                    <Button key={"ExportExcel"} type="primary" loading={viewModel?.isProcessing} icon={<FileExcelOutlined />} onClick={ExportToExcel}>
                        {i18next.t("General.Button.ExportExcel")}
                    </Button>
                    ,
                ]}
            />

            <Collapse defaultActiveKey={['1']}>
                <Panel header={i18next.t("General.SearchPanel.Text")}  key="1">
                    <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                          key={"searchForm"}
                          scrollToFirstError>
                        {dataFetched ?
                            <Row gutter={[24, 16]}>
                                {UserContext.info.role == 100 ?
                                    <Col span={8}>
                                        <Form.Item name="companyId"
                                                   initialValue={viewModel?.getOdometerHistoriesRequest?.companyId}
                                                   key={"companyId"}
                                                   label={i18next.t("OdometerHistories.SearchPanel.Label.companyName")}>
                                            {/*<Input onChange={onChanged}/>*/}
                                            <Select style={{width: "100%", display: "block"}}
                                                    showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                                {companyOptions}
                                            </Select>
                                        </Form.Item>
                                    </Col> : ""}
                                {UserContext.info.role === 1 ?
                                <Col span={8}>
                                    <Form.Item name="companyBranchName"
                                               initialValue={viewModel?.getOdometerHistoriesRequest?.companyBranchName}
                                               key={"companyBranchName"}
                                               label={i18next.t("OdometerHistories.SearchPanel.Label.companyBranchName")}>
                                        {/*<Input onChange={onChanged}/>*/}
                                        <Select style={{width: "100%", display: "block"}}
                                                showSearch={true}
                                                onChange={(e) => onSelectChanged(e, "companyBranchId")}>
                                            {branchOptions}
                                        </Select>
                                    </Form.Item>
                                </Col> : ""}
                                <Col span={8}>
                                    <Form.Item name="carIdNumber"
                                               initialValue={viewModel?.getOdometerHistoriesRequest?.carIdNumber}
                                               key={"carIdNumber"}
                                               label={i18next.t("OdometerHistories.SearchPanel.Label.carIdNumber")}>
                                        {/*<Input onChange={onChanged}/>*/}
                                        <Select style={{width: "100%", display: "block"}}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "carIdNumber")}>
                                            {carOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            :
                            <Row gutter={[24, 16]}>
                                <Col offset={11} span={8}>
                                    <Spin className={"spine"} size="large"/>
                                </Col>
                            </Row>
                        }
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
            <Table dataSource={viewModel?.odometerHistoryList} columns={columns} loading={viewModel?.isProcessing}
                   bordered={true} pagination={false} sticky />
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


export default OdometerHistoryList;


