import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./CarKmConsumptionList.scss";
import Stores from "app/constants/Stores";

import {
    Button, Collapse, Col, Row,
    Pagination, Input, Form,
    Table, PageHeader, Space, DatePicker, Select, Alert
} from "antd";
import {
    FileExcelOutlined
} from '@ant-design/icons';
import i18next from "i18next";
import GetCarKmConsumptionRequest from "../../handlers/get/GetCarKmConsumptionRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import CarKmConsumptionColumns from "./CarKmConsumptionColumns";
import CarKmConsumptionStore from "../../stores/CarKmConsumptionStore";
import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;
const { Option } = Select;

interface CarKmConsumptionListProps {
    carKmConsumptionStore?: CarKmConsumptionStore
}

const CarKmConsumptionList: React.FC<CarKmConsumptionListProps> = inject(Stores.carKmConsumptionStore)(observer(({carKmConsumptionStore}) => {

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
    CarKmConsumptionColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    //const companyColumn = {title: i18next.t("CarKmConsumptions.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};

    let columns: any[] = [...CarKmConsumptionColumns];
    /*if(UserContext.info.role == 100)
    {
        columns.unshift(companyColumn);
    }*/

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        carKmConsumptionStore.onCarKmConsumptionGetPageLoad();
        carKmConsumptionStore.getCarKmConsumptionViewModel.getCarKmConsumptionsRequest = new GetCarKmConsumptionRequest();
        carKmConsumptionStore.getCarKmConsumptionViewModel.getCarKmConsumptionsRequest.pageSize = 20;
        carKmConsumptionStore.getCarKmConsumptionViewModel.getCarKmConsumptionsRequest.pageIndex = 0;
        /*if(UserContext.info.role == 1){
            carKmConsumptionStore.getCarKmConsumptionViewModel.getCarKmConsumptionsRequest.companyId = UserContext.info.id;
        }*/

        try {
            /*if (UserContext.info.role === 100) {
                await carKmConsumptionStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (carKmConsumptionStore.listCompanyViewModel) {
                    for (let item of carKmConsumptionStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }*/

            //await carKmConsumptionStore.listBranchViewModel.getBranchList();
            await carKmConsumptionStore.listCarViewModel.getCarList();


            //await carKmConsumptionStore.getCarKmConsumptionViewModel.getAllCarKmConsumption(carKmConsumptionStore.getCarKmConsumptionViewModel.getCarKmConsumptionsRequest);

            let carOptions = [];
            for (let item of carKmConsumptionStore.listCarViewModel.listCarResponse.items) {
                carOptions.push(<Option key={item.key} value={item.key}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);

            /*let branchOptions = [];
            for (let item of carKmConsumptionStore.listBranchViewModel.listBranchResponse.items) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);*/
        }
        catch {

        }
    }

    let viewModel = carKmConsumptionStore.getCarKmConsumptionViewModel;

    if (!viewModel) return;

    function onUnload() {
        carKmConsumptionStore.onCarKmConsumptionGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getCarKmConsumptionsRequest.pageSize = pageSize;
        viewModel.getCarKmConsumptionsRequest.pageIndex = pageIndex - 1;
        await carKmConsumptionStore.getCarKmConsumptionViewModel.getAllCarKmConsumption(viewModel.getCarKmConsumptionsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getCarKmConsumptionsRequest.pageSize = pageSize;
        viewModel.getCarKmConsumptionsRequest.pageIndex = 0;
        await carKmConsumptionStore.getCarKmConsumptionViewModel.getAllCarKmConsumption(viewModel.getCarKmConsumptionsRequest);
    }
    function onChanged(e){
        viewModel.getCarKmConsumptionsRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getCarKmConsumptionsRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getCarKmConsumptionsRequest.pageIndex = 0;
        await viewModel.getAllCarKmConsumption(viewModel.getCarKmConsumptionsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getCarKmConsumptionsRequest.pageSize;
        viewModel.getCarKmConsumptionsRequest = new GetCarKmConsumptionRequest();
        viewModel.getCarKmConsumptionsRequest.pageIndex = 0;
        viewModel.getCarKmConsumptionsRequest.pageSize = pageSize;
        /*if(UserContext.info.role == 1){
            carKmConsumptionStore.getCarKmConsumptionViewModel.getCarKmConsumptionsRequest.companyId = UserContext.info.id;
        }*/
        await viewModel.getAllCarKmConsumption(viewModel.getCarKmConsumptionsRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.carKmConsumptionExport = [];
        await viewModel.getAllCarKmConsumption(viewModel.getCarKmConsumptionsRequest, true);
        if(viewModel.carKmConsumptionExport && viewModel?.carKmConsumptionExport?.length > 0)
            ExportExcel(columns, viewModel?.carKmConsumptionExport, "CarKmConsumption");
    }
    function onSelectChanged(e, propName){
        viewModel.getCarKmConsumptionsRequest[`${propName}`] = e;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("CarKmConsumptions.Page.Title")}
                subTitle={i18next.t("CarKmConsumptions.Page.SubTitle")}
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
                        <Row gutter={[24, 16]}>
                            {/*{UserContext.info.role == 100 ?
                                <Col span={8}>
                                    <Form.Item name="companyId" initialValue={viewModel?.getCarKmConsumptionsRequest?.companyId}
                                               key={"companyId"}
                                               label={i18next.t("CarKmConsumptions.SearchPanel.Label.companyName")}>
                                        <Input onChange={onChanged}/>
                                        <Select style={{width: "100%", display:"block"}}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                            {companyOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>: ""}*/}
                            {/*<Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getCarKmConsumptionsRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("CarKmConsumptions.SearchPanel.Label.companyBranchName")}>
                                    <Input onChange={onChanged}/>
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "companyBranchId")}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>*/}
                            <Col span={8}>
                                <Form.Item name="carId" initialValue={viewModel?.getCarKmConsumptionsRequest?.carId}
                                           key={"carId"}
                                           label={i18next.t("CarKmConsumptions.SearchPanel.Label.carId")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "carId")}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                           {/* <Col span={8}>
                                <Form.Item name="transDateFrom" initialValue={viewModel?.getCarKmConsumptionsRequest?.transDateFrom}
                                           key={"transDateFrom"}
                                           label={i18next.t("CarKmConsumptions.SearchPanel.Label.transDateFrom")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "transDateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="transDateTo" initialValue={viewModel?.getCarKmConsumptionsRequest?.transDateTo}
                                           key={"transDateTo"}
                                           label={i18next.t("CarKmConsumptions.SearchPanel.Label.transDateTo")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "transDateTo"))} />
                                </Form.Item>
                            </Col>*/}
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
            <Table dataSource={viewModel?.carKmConsumptionList} columns={columns} loading={viewModel?.isProcessing}
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


export default CarKmConsumptionList;


