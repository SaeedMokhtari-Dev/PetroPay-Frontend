import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {useParams} from "react-router-dom";
import {Button, Col,
    DatePicker,
    Divider, Form, Input, InputNumber, message, Modal, PageHeader, Radio, Row, Select, Spin, Switch, Upload} from "antd";
import i18next from "i18next";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import TransferBalanceStore from "../../stores/TransferBalanceStore";
import { PasswordInput } from 'antd-password-input-strength';
import Countries from "../../../../app/constants/Countries";
import PaymentMethods from "../../../../app/constants/PaymentMethods";
import moment from 'moment';
import Constants from 'app/constants/Constants';
import TransferBalanceTypes from "../../../../app/constants/TransferBalanceTypes";
import UserContext from "../../../../identity/contexts/UserContext";
import AddTransferBalanceRequest from "../../handlers/add/AddTransferBalanceRequest";
const {useEffect} = React;

const { Option } = Select;

interface EditTransferBalanceProps {
    transferBalanceStore?: TransferBalanceStore;
    match?: any;
}

const EditTransferBalance: React.FC<EditTransferBalanceProps> = inject(Stores.transferBalanceStore)(observer(({transferBalanceStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [carOptions, setCarOptions] = React.useState([]);
    const [branchOptions, setBranchOptions] = React.useState([]);
    const [transferBalanceTypeOptions, setTransferBalanceTypeOptions] = React.useState([]);
    const [transferBalanceType, setTransferBalanceType] = React.useState(0);
    const [fromBalance, setFromBalance] = React.useState(0);
    const [toBalance, setToBalance] = React.useState(0);

    const [form] = Form.useForm();

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

    TransferBalanceTypes.forEach(w =>{ w.title = i18next.t(w.title) });

    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {
        transferBalanceStore.onTransferBalanceEditPageLoad();

        transferBalanceStore.editTransferBalanceViewModel.addTransferBalanceRequest = new AddTransferBalanceRequest();
        transferBalanceStore.editTransferBalanceViewModel.addTransferBalanceRequest.companyId = UserContext.info.id;

        await transferBalanceStore.listCarViewModel.getCarList(UserContext.info.id);
        await transferBalanceStore.listBranchViewModel.getBranchList(UserContext.info.id);

        let transferBalanceTypeOptions = [];
        for (let item of TransferBalanceTypes) {
            transferBalanceTypeOptions.push(<Option key={item.value} value={item.value}>{item.title}</Option>);
        }

        let carOptions = [];
        for (let item of transferBalanceStore.listCarViewModel.listCarResponse.items) {
            carOptions.push(<Option key={item.key} value={item.key} balance={item.balance}>{item.carNumber}</Option>);
        }

        let branchOptions = [];
        for (let item of transferBalanceStore.listBranchViewModel.listBranchResponse.items) {
            branchOptions.push(<Option key={item.key} value={item.key} balance={item.balance}>{item.title}</Option>);
        }

        setTransferBalanceTypeOptions(transferBalanceTypeOptions);
        setCarOptions(carOptions);
        setBranchOptions(branchOptions);
        setDataFetched(true);
    }
    let viewModel = transferBalanceStore.editTransferBalanceViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        await viewModel.addTransferBalance(viewModel.addTransferBalanceRequest);
        if(!viewModel.errorMessage)
        {
            viewModel.isProcessing = true;
            setTimeout(() => { window.location.reload(); }, 5000);
        }

    };

    function onUnload() {
        transferBalanceStore.onTransferBalanceEditPageUnload();
    }
    function onSelectChanged(e, propName){
        viewModel.addTransferBalanceRequest[`${propName}`] = e;
    }
    function onTransferBalanceTypeChanged(e){
        viewModel.addTransferBalanceRequest.transferBalanceType = +e;
        setTransferBalanceType(+e);
        if(+e === 100)
            setFromBalance(UserContext.info?.balance);
        if(+e === 500)
            setToBalance(UserContext.info?.balance);
    }
    function onChanged(e){
        viewModel.addTransferBalanceRequest[`${e.target.id}`] = e.target.value;
    }
    function onAmountChanged(e){
        viewModel.addTransferBalanceRequest.amount = e;
    }
    function onOptionSelectChanged(e, option, propName, isFrom) {
        debugger;
        viewModel.addTransferBalanceRequest[`${propName}`] = e;
        console.log(option);
        if(isFrom){
            setFromBalance(option.balance);
        }
        else{
            setToBalance(option.balance);
        }
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("TransferBalances.Page.Title")}
            />

            <Divider>{i18next.t("TransferBalances.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"transferBalanceForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col offset={8} span={8}>
                <Form.Item name="transferBalanceType"
                           key={"transferBalanceType"}
                           label={i18next.t("TransferBalances.Label.transferBalanceType")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("TransferBalances.Validation.Message.transferBalanceType.Required")
                               }
                           ]}>
                    <Select showSearch={true} onChange={(e) => onTransferBalanceTypeChanged(e)}>
                        {transferBalanceTypeOptions}
                    </Select>
                </Form.Item>
                    </Col>
                    {transferBalanceType === 100 ?
                        <React.Fragment>
                            <Divider>{i18next.t("General.TransferBalanceType.CompanyToBranch")}</Divider>
                            <Col offset={8} span={16}>
                                <Form.Item name="companyBalance"
                                           key={"companyBalance"}
                                           label={i18next.t("TransferBalances.Label.companyBalance")}>
                                    <h4>{fromBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="toBranch"
                                           key={"toBranch"}
                                           label={i18next.t("TransferBalances.Label.toBranch")}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: i18next.t("TransferBalances.Validation.Message.branch.Required")
                                               }
                                           ]}>
                                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option,"branchId", false)}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="branchBalance"
                                           key={"branchBalance"}
                                           label={i18next.t("TransferBalances.Label.branchBalance")}>
                                    <h4>{toBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                        </React.Fragment>
                    : ""
                    }
                    {transferBalanceType === 200 ?
                        <React.Fragment>
                            <Divider>{i18next.t("General.TransferBalanceType.BranchToCar")}</Divider>
                            <Col span={12}>
                                <Form.Item name="fromBranch"
                                           key={"fromBranch"}
                                           label={i18next.t("TransferBalances.Label.fromBranch")}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: i18next.t("TransferBalances.Validation.Message.branch.Required")
                                               }
                                           ]}>
                                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option,"branchId", true)}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="branchBalance"
                                           key={"branchBalance"}
                                           label={i18next.t("TransferBalances.Label.branchBalance")}>
                                    <h4>{fromBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="toCar"
                                           key={"toCar"}
                                           label={i18next.t("TransferBalances.Label.toCar")}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: i18next.t("TransferBalances.Validation.Message.car.Required")
                                               }
                                           ]}>
                                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option,"carId", false)}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="carBalance"
                                           key={"carBalance"}
                                           label={i18next.t("TransferBalances.Label.carBalance")}>
                                    <h4>{toBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                        </React.Fragment>
                    : ""
                    }
                    {transferBalanceType === 300 ?
                        <React.Fragment>
                            <Divider>{i18next.t("General.TransferBalanceType.CarToCar")}</Divider>
                            <Col span={12}>
                                <Form.Item name="fromCar"
                                           key={"fromCar"}
                                           label={i18next.t("TransferBalances.Label.fromCar")}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: i18next.t("TransferBalances.Validation.Message.car.Required")
                                               }
                                           ]}>
                                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option,"carId", true)}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="carBalance"
                                           key={"carBalance"}
                                           label={i18next.t("TransferBalances.Label.carBalance")}>
                                    <h4>{fromBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="toCar"
                                           key={"toCar"}
                                           label={i18next.t("TransferBalances.Label.toCar")}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: i18next.t("TransferBalances.Validation.Message.car.Required")
                                               }
                                           ]}>
                                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option,"destinationCarId", false)}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="carBalance"
                                           key={"carBalance"}
                                           label={i18next.t("TransferBalances.Label.carBalance")}>
                                    <h4>{toBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                        </React.Fragment>
                    : ""
                    }
                    {transferBalanceType === 400 ?
                        <React.Fragment>
                            <Divider>{i18next.t("General.TransferBalanceType.CarToBranch")}</Divider>
                            <Col span={12}>
                                <Form.Item name="fromCar"
                                           key={"fromCar"}
                                           label={i18next.t("TransferBalances.Label.fromCar")}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: i18next.t("TransferBalances.Validation.Message.car.Required")
                                               }
                                           ]}>
                                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option,"carId", true)}>
                                        {carOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="carBalance"
                                           key={"carBalance"}
                                           label={i18next.t("TransferBalances.Label.carBalance")}>
                                    <h4>{fromBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="toBranch"
                                           key={"toBranch"}
                                           label={i18next.t("TransferBalances.Label.toBranch")}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: i18next.t("TransferBalances.Validation.Message.branch.Required")
                                               }
                                           ]}>
                                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option,"branchId", false)}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="branchBalance"
                                           key={"branchBalance"}
                                           label={i18next.t("TransferBalances.Label.branchBalance")}>
                                    <h4>{toBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                        </React.Fragment>
                    : ""
                    }
                    {transferBalanceType === 500 ?
                        <React.Fragment>
                            <Divider>{i18next.t("General.TransferBalanceType.BranchToCompany")}</Divider>
                            <Col span={12}>
                                <Form.Item name="fromBranch"
                                           key={"fromBranch"}
                                           label={i18next.t("TransferBalances.Label.fromBranch")}
                                           rules={[
                                               {
                                                   required: true,
                                                   message: i18next.t("TransferBalances.Validation.Message.branch.Required")
                                               }
                                           ]}>
                                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option,"branchId", true)}>
                                        {branchOptions}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="branchBalance"
                                           key={"branchBalance"}
                                           label={i18next.t("TransferBalances.Label.branchBalance")}>
                                    <h4>{fromBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                            <Col offset={11} span={12}>
                                <Form.Item name="companyBalance"
                                           key={"companyBalance"}
                                           label={i18next.t("TransferBalances.Label.companyBalance")}>
                                    <h4>{toBalance?.toLocaleString()}</h4>
                                </Form.Item>
                            </Col>
                        </React.Fragment>
                        : ""
                    }
                    <Divider>{i18next.t("TransferBalances.Label.amount")}</Divider>
                    <Col offset={8} span={8}>
                        <Form.Item name="amount"
                                   key={"amount"}
                                   label={i18next.t("TransferBalances.Label.amount")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("TransferBalances.Validation.Message.amount.Required")
                                       }
                                   ]}>
                            <InputNumber min={1} max={fromBalance} style={{width: "100%"}} onChange={onAmountChanged} />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider></Divider>
                {viewModel.errorMessage && (
                    <div className='response-error-msg'>{viewModel.errorMessage}</div>
                )}
                    <PageHeader
                        ghost={false}
                        extra={[
                            <Button type="primary" loading={viewModel.isProcessing} key="submit" size={"large"} htmlType="submit">
                                {i18next.t("General.Add.SaveButton")}
                            </Button>
                        ]}
                    />

            </Form>
                :
                <Row gutter={[24, 16]}>
                    <Col offset={11} span={8}>
                        <Spin className={"spine"} size="large" />
                    </Col>
                </Row>
            }

        </div>
    )
}));

export default EditTransferBalance;
