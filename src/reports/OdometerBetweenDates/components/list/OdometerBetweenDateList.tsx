import React, {useEffect, useState} from 'react';
import {inject, observer} from "mobx-react";
import { Link } from "react-router-dom";
import "./OdometerBetweenDateList.scss";
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
import GetOdometerBetweenDateRequest from "../../handlers/get/GetOdometerBetweenDateRequest";
import UserContext from "../../../../identity/contexts/UserContext";
import OdometerBetweenDateColumns from "./OdometerBetweenDateColumns";
import OdometerBetweenDateStore from "../../stores/OdometerBetweenDateStore";
import ExportExcel from "../../../../app/utils/ExportExcel";
import Constants from "../../../../app/constants/Constants";

const { Panel } = Collapse;
const { Option } = Select;

interface OdometerBetweenDateListProps {
    odometerBetweenDateStore?: OdometerBetweenDateStore
}

const OdometerBetweenDateList: React.FC<OdometerBetweenDateListProps> = inject(Stores.odometerBetweenDateStore)(observer(({odometerBetweenDateStore}) => {

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
    OdometerBetweenDateColumns.forEach(w => {
       w.title = i18next.t(w.title);
    });
    //const companyColumn = {title: i18next.t("OdometerBetweenDates.Label.companyName"), dataIndex: "companyName", key: "companyName", responsive: ['md']};

    let columns: any[] = [...OdometerBetweenDateColumns];
    /*if(UserContext.info.role == 100)
    {
        columns.unshift(companyColumn);
    }*/

    useEffect(() => {
        onLoad();

        return onUnload;
    }, []);

    async function onLoad() {
        odometerBetweenDateStore.onOdometerBetweenDateGetPageLoad();
        odometerBetweenDateStore.getOdometerBetweenDateViewModel.getOdometerBetweenDatesRequest = new GetOdometerBetweenDateRequest();
        odometerBetweenDateStore.getOdometerBetweenDateViewModel.getOdometerBetweenDatesRequest.pageSize = 20;
        odometerBetweenDateStore.getOdometerBetweenDateViewModel.getOdometerBetweenDatesRequest.pageIndex = 0;
        /*if(UserContext.info.role == 1){
            odometerBetweenDateStore.getOdometerBetweenDateViewModel.getOdometerBetweenDatesRequest.companyId = UserContext.info.id;
        }*/

        try {
            /*if (UserContext.info.role === 100) {
                await odometerBetweenDateStore.listCompanyViewModel.getCompanyList();
                let companyOptions = [];
                if (odometerBetweenDateStore.listCompanyViewModel) {
                    for (let item of odometerBetweenDateStore.listCompanyViewModel.listCompanyResponse.items) {
                        companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
                    }
                }
                setCompanyOptions(companyOptions);
            }*/

            //await odometerBetweenDateStore.listBranchViewModel.getBranchList();
            await odometerBetweenDateStore.listCarViewModel.getCarList();


            //await odometerBetweenDateStore.getOdometerBetweenDateViewModel.getAllOdometerBetweenDate(odometerBetweenDateStore.getOdometerBetweenDateViewModel.getOdometerBetweenDatesRequest);

            let carOptions = [];
            if(UserContext.info.role !== 5) {
                for (let item of odometerBetweenDateStore.listCarViewModel.listCarResponse.items) {
                    carOptions.push(<Option key={item.key} value={item.key}>{item.carNumber}</Option>);
                }
            }
            else{
                const filteredCars = odometerBetweenDateStore.listCarViewModel.listCarResponse.items.filter(w => w.branchId == UserContext.info.id);
                for (let item of filteredCars) {
                    carOptions.push(<Option key={item.key} value={item.carNumber}>{item.carNumber}</Option>);
                }
            }
            setCarOptions(carOptions);

            /*let branchOptions = [];
            for (let item of odometerBetweenDateStore.listBranchViewModel.listBranchResponse.items) {
                branchOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branchOptions);*/
        }
        catch {

        }
    }

    let viewModel = odometerBetweenDateStore.getOdometerBetweenDateViewModel;

    if (!viewModel) return;

    function onUnload() {
        odometerBetweenDateStore.onOdometerBetweenDateGetPageUnload();
    }

    async function pageIndexChanged(pageIndex, pageSize){
        viewModel.getOdometerBetweenDatesRequest.pageSize = pageSize;
        viewModel.getOdometerBetweenDatesRequest.pageIndex = pageIndex - 1;
        await odometerBetweenDateStore.getOdometerBetweenDateViewModel.getAllOdometerBetweenDate(viewModel.getOdometerBetweenDatesRequest);
    }
    async function pageSizeChanged(current, pageSize){
        viewModel.getOdometerBetweenDatesRequest.pageSize = pageSize;
        viewModel.getOdometerBetweenDatesRequest.pageIndex = 0;
        await odometerBetweenDateStore.getOdometerBetweenDateViewModel.getAllOdometerBetweenDate(viewModel.getOdometerBetweenDatesRequest);
    }
    function onChanged(e){
        viewModel.getOdometerBetweenDatesRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString, prop) {
        viewModel.getOdometerBetweenDatesRequest[`${prop}`] = dateString;
    }
    async function onFinish(values: any) {
        viewModel.getOdometerBetweenDatesRequest.pageIndex = 0;
        await viewModel.getAllOdometerBetweenDate(viewModel.getOdometerBetweenDatesRequest);
    }
    async function onReset(){
        const pageSize = viewModel.getOdometerBetweenDatesRequest.pageSize;
        viewModel.getOdometerBetweenDatesRequest = new GetOdometerBetweenDateRequest();
        viewModel.getOdometerBetweenDatesRequest.pageIndex = 0;
        viewModel.getOdometerBetweenDatesRequest.pageSize = pageSize;
        /*if(UserContext.info.role == 1){
            odometerBetweenDateStore.getOdometerBetweenDateViewModel.getOdometerBetweenDatesRequest.companyId = UserContext.info.id;
        }*/
        await viewModel.getAllOdometerBetweenDate(viewModel.getOdometerBetweenDatesRequest);
        form.resetFields();
    }
    async function ExportToExcel(){
        viewModel.odometerBetweenDateExport = [];
        await viewModel.getAllOdometerBetweenDate(viewModel.getOdometerBetweenDatesRequest, true);
        if(viewModel.odometerBetweenDateExport && viewModel?.odometerBetweenDateExport?.length > 0)
            ExportExcel(columns, viewModel?.odometerBetweenDateExport, "OdometerBetweenDate");
    }
    function onSelectChanged(e, propName){
        viewModel.getOdometerBetweenDatesRequest[`${propName}`] = e;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("OdometerBetweenDates.Page.Title")}
                subTitle={i18next.t("OdometerBetweenDates.Page.SubTitle")}
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
                                    <Form.Item name="companyId" initialValue={viewModel?.getOdometerBetweenDatesRequest?.companyId}
                                               key={"companyId"}
                                               label={i18next.t("OdometerBetweenDates.SearchPanel.Label.companyName")}>
                                        <Input onChange={onChanged}/>
                                        <Select style={{width: "100%", display:"block"}}
                                                showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                            {companyOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>: ""}*/}
                            {/*<Col span={8}>
                                <Form.Item name="companyBranchName" initialValue={viewModel?.getOdometerBetweenDatesRequest?.companyBranchName}
                                           key={"companyBranchName"}
                                           label={i18next.t("OdometerBetweenDates.SearchPanel.Label.companyBranchName")}>
                                    <Input onChange={onChanged}/>
                                    <Select style={{width: "100%", display:"block"}}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "companyBranchId")}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>*/}
                            <Col span={8}>
                                <Form.Item name="carId" initialValue={viewModel?.getOdometerBetweenDatesRequest?.carId}
                                           key={"carId"}
                                           label={i18next.t("OdometerBetweenDates.SearchPanel.Label.carId")}>
                                    {/*<Input onChange={onChanged}/>*/}
                                    <Select style={{width: "100%", display:"block"}} allowClear={true}
                                            showSearch={true} onChange={(e) => onSelectChanged(e, "carId")}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTimeFrom" initialValue={viewModel?.getOdometerBetweenDatesRequest?.dateTimeFrom}
                                           key={"dateTimeFrom"}
                                           label={i18next.t("OdometerBetweenDates.SearchPanel.Label.dateTimeFrom")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateTimeFrom"))} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="dateTimeTo" initialValue={viewModel?.getOdometerBetweenDatesRequest?.dateTimeTo}
                                           key={"dateTimeTo"}
                                           label={i18next.t("OdometerBetweenDates.SearchPanel.Label.dateTimeTo")}>
                                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "dateTimeTo"))} />
                                </Form.Item>
                            </Col>
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
            <Table dataSource={viewModel?.odometerBetweenDateList} columns={columns} loading={viewModel?.isProcessing}
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


export default OdometerBetweenDateList;


