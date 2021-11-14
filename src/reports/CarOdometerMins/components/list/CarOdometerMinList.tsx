import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./CarOdometerMinList.scss";
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
import GetCarOdometerMinRequest from "../../handlers/get/GetCarOdometerMinRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import CarOdometerMinColumns from "./CarOdometerMinColumns";
import CarOdometerMinStore from "../../stores/CarOdometerMinStore";
import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;
const { Option } = Select;

interface CarOdometerMinListProps {
    carOdometerMinStore?: CarOdometerMinStore
}

const CarOdometerMinList: React.FC<CarOdometerMinListProps> = inject(Stores.carOdometerMinStore)(observer(({carOdometerMinStore}) => {

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
    CarOdometerMinColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    //const companyColumn = {title: i18next.t("CarOdometerMins.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};

    let columns: any[] = [...CarOdometerMinColumns];
    /*if(UserContext.info.role == 100)
    {
        columns.unshift(companyColumn);
    }*/

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        carOdometerMinStore.onCarOdometerMinGetPageLoad();
        carOdometerMinStore.getCarOdometerMinViewModel.getCarOdometerMinsRequest = new GetCarOdometerMinRequest();
        carOdometerMinStore.getCarOdometerMinViewModel.getCarOdometerMinsRequest.pageSize = 20;
        carOdometerMinStore.getCarOdometerMinViewModel.getCarOdometerMinsRequest.pageIndex = 0;
        /*if(UserContext.info.role == 1){
            carOdometerMinStore.getCarOdometerMinViewModel.getCarOdometerMinsRequest.companyId = UserContext.info.id;
        }*/

        try {
            /*if (UserContext.info.role === 100) {
                await carOdometerMinStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (carOdometerMinStore.listCompanyViewModel) {
                    for (let item of carOdometerMinStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }*/

            //await carOdometerMinStore.listBranchViewModel.getBranchList();
            await carOdometerMinStore.listCarViewModel.getCarList();


            //await carOdometerMinStore.getCarOdometerMinViewModel.getAllCarOdometerMin(carOdometerMinStore.getCarOdometerMinViewModel.getCarOdometerMinsRequest);

            let carOptions = [];
            for (let item of carOdometerMinStore.listCarViewModel.listCarResponse.items) {
                carOptions.push(<Option key={item.key} value={item.key}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);

            /*let branchOptions = [];
            for (let item of carOdometerMinStore.listBranchViewModel.listBranchResponse.items) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);*/
        }
        catch {

        }
    }

    let viewModel = carOdometerMinStore.getCarOdometerMinViewModel;

    if (!viewModel) return;

    function onUnload() {
        carOdometerMinStore.onCarOdometerMinGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getCarOdometerMinsRequest.pageSize = pageSize;
        viewModel.getCarOdometerMinsRequest.pageIndex = pageIndex - 1;
        await carOdometerMinStore.getCarOdometerMinViewModel.getAllCarOdometerMin(viewModel.getCarOdometerMinsRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getCarOdometerMinsRequest.pageSize = pageSize;
        viewModel.getCarOdometerMinsRequest.pageIndex = 0;
        await carOdometerMinStore.getCarOdometerMinViewModel.getAllCarOdometerMin(viewModel.getCarOdometerMinsRequest);
    }
    function onChanged(e){
        viewModel.getCarOdometerMinsRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getCarOdometerMinsRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getCarOdometerMinsRequest.pageIndex = 0;
        await viewModel.getAllCarOdometerMin(viewModel.getCarOdometerMinsRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getCarOdometerMinsRequest.pageSize;
        viewModel.getCarOdometerMinsRequest = new GetCarOdometerMinRequest();
        viewModel.getCarOdometerMinsRequest.pageIndex = 0;
        viewModel.getCarOdometerMinsRequest.pageSize = pageSize;
        /*if(UserContext.info.role == 1){
            carOdometerMinStore.getCarOdometerMinViewModel.getCarOdometerMinsRequest.companyId = UserContext.info.id;
        }*/
        await viewModel.getAllCarOdometerMin(viewModel.getCarOdometerMinsRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.carOdometerMinExport = [];
        await viewModel.getAllCarOdometerMin(viewModel.getCarOdometerMinsRequest, true);
        if(viewModel.carOdometerMinExport && viewModel?.carOdometerMinExport?.length > 0)
            ExportExcel(columns, viewModel?.carOdometerMinExport, "CarOdometerMin");
    }
    function onSelectChanged(e, propName){
        viewModel.getCarOdometerMinsRequest[`${propName}`] = e;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("CarOdometerMins.Page.Title")}
                subTitle={i18next.t("CarOdometerMins.Page.SubTitle")}
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
                                    <Form.Item name="companyId" initialValue={viewModel?.getCarOdometerMinsRequest?.companyId}
                                               key={"companyId"}
                                               label={i18next.t("CarOdometerMins.SearchPanel.Label.companyName")}>
                                        <Input onChange={onChanged}/>
                                        <Select style={{width: "100%", display:"block"}}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                            {companyOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>: ""}*/}
                            {/*<Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getCarOdometerMinsRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("CarOdometerMins.SearchPanel.Label.companyBranchName")}>
                                    <Input onChange={onChanged}/>
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "companyBranchId")}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>*/}
                            <Col span={8}>
                                <Form.Item name="carId" initialValue={viewModel?.getCarOdometerMinsRequest?.carId}
                                           key={"carId"}
                                           label={i18next.t("CarOdometerMins.SearchPanel.Label.carId")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}} allowClear={true}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "carId")}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                           {/* <Col span={8}>
                                <Form.Item name="transDateFrom" initialValue={viewModel?.getCarOdometerMinsRequest?.transDateFrom}
                                           key={"transDateFrom"}
                                           label={i18next.t("CarOdometerMins.SearchPanel.Label.transDateFrom")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "transDateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="transDateTo" initialValue={viewModel?.getCarOdometerMinsRequest?.transDateTo}
                                           key={"transDateTo"}
                                           label={i18next.t("CarOdometerMins.SearchPanel.Label.transDateTo")}>
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
            <Table dataSource={viewModel?.carOdometerMinList} columns={columns} loading={viewModel?.isProcessing}
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


export default CarOdometerMinList;


