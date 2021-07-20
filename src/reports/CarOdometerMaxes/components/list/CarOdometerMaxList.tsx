import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./CarOdometerMaxList.scss";
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
import GetCarOdometerMaxRequest from "../../handlers/get/GetCarOdometerMaxRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import CarOdometerMaxColumns from "./CarOdometerMaxColumns";
import CarOdometerMaxStore from "../../stores/CarOdometerMaxStore";
import ExportExcel from "../../../../app/utils/ExportExcel";

const { Panel } = Collapse;
const { Option } = Select;

interface CarOdometerMaxListProps {
    carOdometerMaxStore?: CarOdometerMaxStore
}

const CarOdometerMaxList: React.FC<CarOdometerMaxListProps> = inject(Stores.carOdometerMaxStore)(observer(({carOdometerMaxStore}) => {

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
    CarOdometerMaxColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    //const companyColumn = {title: i18next.t("CarOdometerMaxes.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};

    let columns: any[] = [...CarOdometerMaxColumns];
    /*if(UserContext.info.role == 100)
    {
        columns.unshift(companyColumn);
    }*/

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        carOdometerMaxStore.onCarOdometerMaxGetPageLoad();
        carOdometerMaxStore.getCarOdometerMaxViewModel.getCarOdometerMaxesRequest = new GetCarOdometerMaxRequest();
        carOdometerMaxStore.getCarOdometerMaxViewModel.getCarOdometerMaxesRequest.pageSize = 20;
        carOdometerMaxStore.getCarOdometerMaxViewModel.getCarOdometerMaxesRequest.pageIndex = 0;
        /*if(UserContext.info.role == 1){
            carOdometerMaxStore.getCarOdometerMaxViewModel.getCarOdometerMaxesRequest.companyId = UserContext.info.id;
        }*/

        try {
            /*if (UserContext.info.role === 100) {
                await carOdometerMaxStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (carOdometerMaxStore.listCompanyViewModel) {
                    for (let item of carOdometerMaxStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }*/

            //await carOdometerMaxStore.listBranchViewModel.getBranchList();
            await carOdometerMaxStore.listCarViewModel.getCarList();


            //await carOdometerMaxStore.getCarOdometerMaxViewModel.getAllCarOdometerMax(carOdometerMaxStore.getCarOdometerMaxViewModel.getCarOdometerMaxesRequest);

            let carOptions = [];
            for (let item of carOdometerMaxStore.listCarViewModel.listCarResponse.items) {
                carOptions.push(<Option key={item.key} value={item.key}>{item.carNumber}</Option>);
            }
            setCarOptions(carOptions);

           /* let branchOptions = [];
            for (let item of carOdometerMaxStore.listBranchViewModel.listBranchResponse.items) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);*/
        }
        catch {

        }
    }

    let viewModel = carOdometerMaxStore.getCarOdometerMaxViewModel;

    if (!viewModel) return;

    function onUnload() {
        carOdometerMaxStore.onCarOdometerMaxGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getCarOdometerMaxesRequest.pageSize = pageSize;
        viewModel.getCarOdometerMaxesRequest.pageIndex = pageIndex - 1;
        await carOdometerMaxStore.getCarOdometerMaxViewModel.getAllCarOdometerMax(viewModel.getCarOdometerMaxesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getCarOdometerMaxesRequest.pageSize = pageSize;
        viewModel.getCarOdometerMaxesRequest.pageIndex = 0;
        await carOdometerMaxStore.getCarOdometerMaxViewModel.getAllCarOdometerMax(viewModel.getCarOdometerMaxesRequest);
    }
    function onChanged(e){
        viewModel.getCarOdometerMaxesRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getCarOdometerMaxesRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getCarOdometerMaxesRequest.pageIndex = 0;
        await viewModel.getAllCarOdometerMax(viewModel.getCarOdometerMaxesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getCarOdometerMaxesRequest.pageSize;
        viewModel.getCarOdometerMaxesRequest = new GetCarOdometerMaxRequest();
        viewModel.getCarOdometerMaxesRequest.pageIndex = 0;
        viewModel.getCarOdometerMaxesRequest.pageSize = pageSize;
        /*if(UserContext.info.role == 1){
            carOdometerMaxStore.getCarOdometerMaxViewModel.getCarOdometerMaxesRequest.companyId = UserContext.info.id;
        }*/
        await viewModel.getAllCarOdometerMax(viewModel.getCarOdometerMaxesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.carOdometerMaxExport = [];
        await viewModel.getAllCarOdometerMax(viewModel.getCarOdometerMaxesRequest, true);
        if(viewModel.carOdometerMaxExport && viewModel?.carOdometerMaxExport?.length > 0)
            ExportExcel(columns, viewModel?.carOdometerMaxExport, "CarOdometerMax");
    }
    function onSelectChanged(e, propName){
        viewModel.getCarOdometerMaxesRequest[`${propName}`] = e;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("CarOdometerMaxes.Page.Title")}
                subTitle={i18next.t("CarOdometerMaxes.Page.SubTitle")}
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
                                    <Form.Item name="companyId" initialValue={viewModel?.getCarOdometerMaxesRequest?.companyId}
                                               key={"companyId"}
                                               label={i18next.t("CarOdometerMaxes.SearchPanel.Label.companyName")}>
                                        <Input onChange={onChanged}/>
                                        <Select style={{width: "100%", display:"block"}}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                            {companyOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>: ""}*/}
                            {/*<Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getCarOdometerMaxesRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("CarOdometerMaxes.SearchPanel.Label.companyBranchName")}>
                                    <Input onChange={onChanged}/>
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "companyBranchId")}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>*/}
                            <Col span={8}>
                                <Form.Item name="carId" initialValue={viewModel?.getCarOdometerMaxesRequest?.carId}
                                           key={"carId"}
                                           label={i18next.t("CarOdometerMaxes.SearchPanel.Label.carId")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "carId")}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                           {/* <Col span={8}>
                                <Form.Item name="transDateFrom" initialValue={viewModel?.getCarOdometerMaxesRequest?.transDateFrom}
                                           key={"transDateFrom"}
                                           label={i18next.t("CarOdometerMaxes.SearchPanel.Label.transDateFrom")}>
                                    <DatePicker onChange={((date, dateString) => onDateChange(date, dateString, "transDateFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="transDateTo" initialValue={viewModel?.getCarOdometerMaxesRequest?.transDateTo}
                                           key={"transDateTo"}
                                           label={i18next.t("CarOdometerMaxes.SearchPanel.Label.transDateTo")}>
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
            <Table dataSource={viewModel?.carOdometerMaxList} columns={columns} loading={viewModel?.isProcessing}
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


export default CarOdometerMaxList;


