import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {
    Button, Col,
    DatePicker,
    Modal,
    Divider, Form, Input, InputNumber, PageHeader, Radio, Row, Select, Skeleton, Space, Spin, Table
} from "antd";
import i18next from "i18next";
import DetailSubscriptionResponse from "../../handlers/detail/DetailSubscriptionResponse";
import AddSubscriptionRequest from "../../handlers/add/AddSubscriptionRequest";
import {
    ExclamationCircleOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import PaymentMethods from "../../../../app/constants/PaymentMethods";
import moment from 'moment';
import SubscriptionTypes from 'app/constants/SubscriptionTypes';
import SubscriptionStore from "../../stores/SubscriptionStore";
import CalculateSubscriptionRequest from "../../handlers/calculate/CalculateSubscriptionRequest";
import "./EditSubscription.scss";
import BundlesColumns from "../../../bundles/components/list/BundlesColumns";
import BundleItem from "../../../bundles/handlers/get/BundleItem";
const {useEffect} = React;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface EditSubscriptionProps {
    subscriptionStore?: SubscriptionStore;
    match?: any;
}

const EditSubscription: React.FC<EditSubscriptionProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore, match}) =>
{

    const dateFormat = 'YYYY-MM-DD';


    const [subscriptionType, setSubscriptionType] = React.useState("");
    const [subscriptionCost, setSubscriptionCost] = React.useState(0);
    const [calculateButtonDisable, setCalculateButtonDisable] = React.useState(true);
    const [startDatePickerDefault, setStartDatePickerDefault] = React.useState(moment());
    const [endDatePickerDefault, setEndDatePickerDefault] = React.useState(moment());
    const [dataFetched, setDataFetched] = React.useState(false);

    const [subscriptionId, setSubscriptionId] = React.useState(0);
    const [bundleId, setBundleId] = React.useState(0);
    const [carNumbersMinimum, setCarNumbersMinimum] = React.useState(0);
    const [carNumbersMaximum, setCarNumbersMaximum] = React.useState(0);
    const [payFromCompanyBalance, setPayFromCompanyBalance] = React.useState(true);
    const [petropayAccountOptions, setPetropayAccountOptions] = React.useState([]);

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

    BundlesColumns.forEach(w => {
        w.title = i18next.t(w.title)
    });
    const columns: any[] = [...BundlesColumns];
    columns.pop();
    /*PaymentMethods.forEach(w =>{ w.title = i18next.t(w.title) });
    const paymentMethodOptions = [...PaymentMethods];*/

    SubscriptionTypes.forEach(w =>{ w.title = i18next.t(w.title) });
    const subscriptionTypeOptions = [...SubscriptionTypes];

    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {

        subscriptionStore.onSubscriptionEditPageLoad();
        await subscriptionStore.listBundleViewModel.getAllBundles();
        await subscriptionStore.listPetropayAccountViewModel.getPetropayAccountList();
        let subscriptionIdParam = +match.params?.subscriptionId;

        if(subscriptionIdParam)
        {
            await subscriptionStore.editSubscriptionViewModel.getDetailSubscription(subscriptionIdParam);

            setSubscriptionCost(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionCost);
            setSubscriptionType(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionType);
            setStartDatePickerDefault(moment(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionStartDate));
            setEndDatePickerDefault(moment(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionEndDate));

            setBundleId(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.bundlesId);
            setPayFromCompanyBalance(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.payFromCompanyBalance);
        }
        else{
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest = new AddSubscriptionRequest();
            subscriptionStore.editSubscriptionViewModel.detailSubscriptionResponse = new DetailSubscriptionResponse();
            setPayFromCompanyBalance(true);
        }
        setSubscriptionId(subscriptionIdParam);

        debugger;
        let petropayAccountOptions = [];
        for (let item of subscriptionStore.listPetropayAccountViewModel.listPetropayAccountResponse.items) {
            petropayAccountOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
        }
        setPetropayAccountOptions(petropayAccountOptions);

        setDataFetched(true);

    }

    let viewModel = subscriptionStore.editSubscriptionViewModel;

    if(!viewModel) return;

    async function onFinish(values: any) {
        debugger;
        viewModel.errorMessage = "";
        if(!bundleId)
        {
            viewModel.errorMessage = i18next.t("Subscriptions.Validation.Message.bundlesId.Required");
            return;
        }
        if(subscriptionId)
        {
            if(!viewModel.editSubscriptionRequest.payFromCompanyBalance && !viewModel.editSubscriptionRequest.petropayAccountId){
                viewModel.errorMessage = i18next.t("Subscriptions.Validation.Message.subscriptionPaymentMethod.Required");
                return;
            }
            await viewModel.editSubscription(viewModel.editSubscriptionRequest);
        }
        else
        {
            if(!viewModel.addSubscriptionRequest.payFromCompanyBalance && !viewModel.addSubscriptionRequest.petropayAccountId){
                viewModel.errorMessage = i18next.t("Subscriptions.Validation.Message.subscriptionPaymentMethod.Required");
                return;
            }
            await viewModel.addSubscription(viewModel.addSubscriptionRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        subscriptionStore.onSubscriptionEditPageUnload();
    }
    function onSelectChanged(e, propName){

        if(subscriptionId)
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest[`${propName}`] = e;
        else
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest[`${propName}`] = e;

        if(propName == "subscriptionType"){
            setSubscriptionType(e);
        }
    }
    function onChanged(e){
        if(subscriptionId)
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest[`${e.target.id}`] = e.target.value;
        else
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest[`${e.target.id}`] = e.target.value;
    }
    function disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    function onDatePickerChanged(e, d){
        console.log(e);
        console.log(d);
        if(subscriptionId)
        {
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest.subscriptionStartDate = d[0];
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest.subscriptionEndDate = d[1];
        }
        else {
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest.subscriptionStartDate = d[0];
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest.subscriptionEndDate = d[1];
        }
        setCalculateButtonDisable(false);
    }
    async function calculate(){
        setSubscriptionCost(0);
        if(!bundleId)
        {
            viewModel.errorMessage = i18next.t("Subscriptions.Validation.Message.bundlesId.Required");
            return;
        }

        let request: CalculateSubscriptionRequest = new CalculateSubscriptionRequest();
        request.bundlesId = bundleId;
        if(subscriptionId){
            request.subscriptionCarNumbers = viewModel.editSubscriptionRequest.subscriptionCarNumbers;
            request.subscriptionType = viewModel.editSubscriptionRequest.subscriptionType;
            request.subscriptionStartDate = viewModel.editSubscriptionRequest.subscriptionStartDate;
            request.subscriptionEndDate = viewModel.editSubscriptionRequest.subscriptionEndDate;
        }
        else {
            request.subscriptionCarNumbers = viewModel.addSubscriptionRequest.subscriptionCarNumbers;
            request.subscriptionType = viewModel.addSubscriptionRequest.subscriptionType;
            request.subscriptionStartDate = viewModel.addSubscriptionRequest.subscriptionStartDate;
            request.subscriptionEndDate = viewModel.addSubscriptionRequest.subscriptionEndDate;
        }

        let result = await viewModel.calculateCost(request, subscriptionId);

        setSubscriptionCost(result);
    }
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: BundleItem[]) => {
            debugger;
            console.log(`selectedRowKeys: ${selectedRowKeys}`);
            setBundleId(+selectedRowKeys[0]);
            setCarNumbersMinimum(selectedRows[0]?.bundlesNumberFrom)
            setCarNumbersMaximum(selectedRows[0]?.bundlesNumberTo)
            if(subscriptionId)
            {
                viewModel.editSubscriptionRequest.bundlesId = bundleId;
            }
            else{
                viewModel.addSubscriptionRequest.bundlesId = bundleId;
            }
        }
    };

    function onNumberChanged(e){
        if(subscriptionId)
        {
            viewModel.editSubscriptionRequest.subscriptionCarNumbers = e;
        }
        else{
            viewModel.addSubscriptionRequest.subscriptionCarNumbers = e;
        }
    }
    function onRadioChange(e){
        debugger;
        setPayFromCompanyBalance(e.target.value);
        if(subscriptionId)
        {
            if(e.target.value)
            {
                viewModel.editSubscriptionRequest.subscriptionPaymentMethod = 'CompanyBalance';
                viewModel.editSubscriptionRequest.payFromCompanyBalance = true;
                viewModel.editSubscriptionRequest.petropayAccountId = null;
            }
            else{
                viewModel.editSubscriptionRequest.subscriptionPaymentMethod = 'other';
                viewModel.editSubscriptionRequest.payFromCompanyBalance = false;
            }
        }
        else{
            if(e.target.value)
            {
                viewModel.addSubscriptionRequest.subscriptionPaymentMethod = 'CompanyBalance';
                viewModel.addSubscriptionRequest.payFromCompanyBalance = true;
                viewModel.addSubscriptionRequest.petropayAccountId = null;
            }
            else{
                viewModel.addSubscriptionRequest.subscriptionPaymentMethod = 'other';
                viewModel.addSubscriptionRequest.payFromCompanyBalance = false;
            }
        }
    }
    const options = [
        { label: i18next.t("Subscriptions.subscriptionPaymentMethod.PayFromCompanyBalance"), value: true },
        { label: i18next.t("Subscriptions.subscriptionPaymentMethod.SelectOtherPayment"), value: false }
    ];
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={subscriptionId ? `${i18next.t("Subscriptions.Edit.HeaderText")} ${subscriptionId}` : i18next.t("Subscriptions.Add.HeaderText")}
            />
            <Divider>{i18next.t("Subscriptions.Section.BundleInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"subscriptionForm"}
                 scrollToFirstError>
                <Table dataSource={subscriptionStore.listBundleViewModel?.bundleList} columns={columns} loading={subscriptionStore.listBundleViewModel?.isProcessing}
                       bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                        rowSelection={{type: 'radio', ...rowSelection}}/>

                <Divider>{i18next.t("Subscriptions.Section.GeneralInformation")}</Divider>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                        <Form.Item name="subscriptionCarNumbers" initialValue={viewModel?.detailSubscriptionResponse?.subscriptionCarNumbers}
                                   key={"subscriptionCarNumbers"}
                                   label={i18next.t("Subscriptions.Label.subscriptionCarNumbers")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Subscriptions.Validation.Message.subscriptionCarNumbers.Required")
                                       }
                                   ]}>
                            <InputNumber style={{width: "100%"}} min={carNumbersMinimum} max={carNumbersMaximum} onChange={(e) => onNumberChanged(e)}/>
                        </Form.Item>
                    </Col>
                    {/*<Col span={8}>
                <Form.Item name="subscriptionPaymentMethod" initialValue={viewModel?.detailSubscriptionResponse?.subscriptionPaymentMethod}
                           key={"subscriptionPaymentMethod"}
                           label={i18next.t("Subscriptions.Label.subscriptionPaymentMethod")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Subscriptions.Validation.Message.subscriptionPaymentMethod.Required")
                               }
                           ]}>
                    <Select options={paymentMethodOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "subscriptionPaymentMethod")} />
                </Form.Item>
                    </Col>*/}
                    <Col span={8}>
                <Form.Item name="paymentReferenceNumber" initialValue={viewModel?.detailSubscriptionResponse?.paymentReferenceNumber}
                           key={"paymentReferenceNumber"}
                           label={i18next.t("Subscriptions.Label.paymentReferenceNumber")}
                           >
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}></Col>
                    <Col span={8}>
                <Form.Item name="subscriptionType" initialValue={viewModel?.detailSubscriptionResponse?.subscriptionType}
                           key={"subscriptionType"}
                           label={i18next.t("Subscriptions.Label.subscriptionType")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Subscriptions.Validation.Message.subscriptionType.Required")
                               }
                           ]}>
                    <Select options={subscriptionTypeOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "subscriptionType")} />
                </Form.Item>
                    </Col>
                    <Col span={8}>
                    {subscriptionType == "Monthly" ?
                        <RangePicker picker="month" disabledDate={disabledDate} format={dateFormat}
                                onChange={(e, d) => onDatePickerChanged(e, d)} defaultValue={[startDatePickerDefault, endDatePickerDefault]}/>
                         : ""
                    }
                    {subscriptionType == "Yearly" ?
                        <RangePicker picker="year" disabledDate={disabledDate} format={dateFormat}
                                onChange={(e, d) => onDatePickerChanged(e, d)} defaultValue={[startDatePickerDefault, endDatePickerDefault]}/>
                        : ""
                    }
                    </Col>
                    <Col span={8}>
                        <Button type="primary" loading={viewModel.calculating} size={"large"} disabled={calculateButtonDisable} onClick={calculate}>
                            {i18next.t("Subscriptions.Button.Calculate")}
                        </Button>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="payFromCompanyBalance" initialValue={viewModel?.detailSubscriptionResponse?.payFromCompanyBalance}
                                   key={"payFromCompanyBalance"}
                                   label={i18next.t("Subscriptions.Label.subscriptionPaymentMethod")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Subscriptions.Validation.Message.payFromCompany.Required")
                                       }
                                   ]}>
                        <Radio.Group key={"payFromCompanyBalance"} options={options}  onChange={onRadioChange}
                                     defaultValue={viewModel?.detailSubscriptionResponse?.payFromCompanyBalance}>
                        </Radio.Group>
                        </Form.Item>
                        {!payFromCompanyBalance &&
                        <Select style={{width: "100%", display:"block"}} defaultValue={viewModel?.detailSubscriptionResponse?.petropayAccountId}
                                key={"petropayAccountId"}
                                showSearch={true} onChange={(e) => onSelectChanged(e, "petropayAccountId")}>
                            {petropayAccountOptions}
                        </Select>
                        }
                    </Col>
                    <Col span={8}>
                        {subscriptionCost ?
                            <div>
                                <h2>{i18next.t("Subscriptions.Label.subscriptionCost")}</h2>
                                <h2>{subscriptionCost.toLocaleString()}</h2>
                            </div>
                            : ""
                        }
                    </Col>
                </Row>
                <Divider></Divider>
                {viewModel.errorMessage && (
                    <div className='response-error-msg'>{viewModel.errorMessage}</div>
                )}
                    <PageHeader
                        ghost={false}
                        title={payFromCompanyBalance ? i18next.t("Subscriptions.Alert.BeCareful") : ""}

                        extra={[
                            <Button type="primary" loading={viewModel.isProcessing} key="submit" disabled={!subscriptionCost} size={"large"} htmlType="submit">
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

export default EditSubscription;
