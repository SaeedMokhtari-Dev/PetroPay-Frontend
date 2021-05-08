import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {Button, Col,
    DatePicker,
    Descriptions,
    Divider, Form, Input, PageHeader, Row, Select, Skeleton, Spin} from "antd";
import i18next from "i18next";
import DetailSubscriptionResponse from "../../handlers/detail/DetailSubscriptionResponse";
import AddSubscriptionRequest from "../../handlers/add/AddSubscriptionRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import PaymentMethods from "../../../../app/constants/PaymentMethods";
import moment from 'moment';
import SubscriptionTypes from 'app/constants/SubscriptionTypes';
import SubscriptionStore from "../../stores/SubscriptionStore";
import CalculateSubscriptionRequest from "../../handlers/calculate/CalculateSubscriptionRequest";
import "./EditSubscription.scss";
const {useEffect} = React;
const { RangePicker } = DatePicker;

interface EditSubscriptionProps {
    subscriptionStore?: SubscriptionStore;
    match?: any;
}

const EditSubscription: React.FC<EditSubscriptionProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore, match}) =>
{

    const dateFormat = 'YYYY-MM-DD';

    debugger;
    const [subscriptionType, setSubscriptionType] = React.useState("");
    const [subscriptionCost, setSubscriptionCost] = React.useState(0);
    const [calculateButtonDisable, setCalculateButtonDisable] = React.useState(true);
    const [startDatePickerDefault, setStartDatePickerDefault] = React.useState(moment());
    const [endDatePickerDefault, setEndDatePickerDefault] = React.useState(moment());
    const [dataFetched, setDataFetched] = React.useState(false);

    const [subscriptionId, setSubscriptionId] = React.useState(0);

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

    PaymentMethods.forEach(w =>{ w.title = i18next.t(w.title) });
    const paymentMethodOptions = [...PaymentMethods];

    SubscriptionTypes.forEach(w =>{ w.title = i18next.t(w.title) });
    const subscriptionTypeOptions = [...SubscriptionTypes];

    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {
        debugger;
        subscriptionStore.onSubscriptionEditPageLoad();
        let subscriptionIdParam = +match.params?.subscriptionId;

        if(subscriptionIdParam)
        {
            await subscriptionStore.editSubscriptionViewModel.getDetailSubscription(subscriptionIdParam);

            setSubscriptionCost(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionCost);
            setSubscriptionType(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionType);
            setStartDatePickerDefault(moment(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionStartDate));
            setEndDatePickerDefault(moment(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionEndDate));
        }
        else{
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest = new AddSubscriptionRequest();
            subscriptionStore.editSubscriptionViewModel.detailSubscriptionResponse = new DetailSubscriptionResponse();
        }
        setSubscriptionId(subscriptionIdParam);
        setDataFetched(true);
    }

    let viewModel = subscriptionStore.editSubscriptionViewModel;

    if(!viewModel) return;



    async function onFinish(values: any) {
        debugger;
        if(subscriptionId)
        {
            await viewModel.editSubscription(viewModel.editSubscriptionRequest);
        }
        else
        {
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
        let request: CalculateSubscriptionRequest = new CalculateSubscriptionRequest();
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
        debugger;
        setSubscriptionCost(result);
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={subscriptionId ? `${i18next.t("Subscriptions.Edit.HeaderText")} ${subscriptionId}` : i18next.t("Subscriptions.Add.HeaderText")}
            />
            <Divider>General Information</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"subscriptionForm"}
                 scrollToFirstError>
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
                            <Input type={"number"} onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
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
                    </Col>
                    <Col span={8}>
                <Form.Item name="paymentReferenceNumber" initialValue={viewModel?.detailSubscriptionResponse?.paymentReferenceNumber}
                           key={"paymentReferenceNumber"}
                           label={i18next.t("Subscriptions.Label.paymentReferenceNumber")}
                           >
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
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
                    <Col offset={8} span={8}>
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
