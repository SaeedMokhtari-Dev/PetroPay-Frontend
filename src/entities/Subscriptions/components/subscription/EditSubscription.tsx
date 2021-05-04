import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {useParams} from "react-router-dom";
import {Button, Col,
    DatePicker,
    Divider, Form, Input, InputNumber, message, Modal, PageHeader, Radio, Row, Select, Spin, Switch, Transfer, Upload} from "antd";
import i18next from "i18next";
import EditSubscriptionRequest from "../../handlers/edit/EditSubscriptionRequest";
import DetailSubscriptionResponse from "../../handlers/detail/DetailSubscriptionResponse";
import AddSubscriptionRequest from "../../handlers/add/AddSubscriptionRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import SubscriptionStore from "../../stores/SubscriptionStore";
import { PasswordInput } from 'antd-password-input-strength';
import Countries from "../../../../app/constants/Countries";
import PaymentMethods from "../../../../app/constants/PaymentMethods";
import ListCarViewModel from "../../../cars/view-models/ListCarViewModel";
import UserContext from "../../../../identity/contexts/UserContext";
const {useEffect} = React;

interface EditSubscriptionProps {
    subscriptionStore?: SubscriptionStore;
    match?: any;
}

const EditSubscription: React.FC<EditSubscriptionProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore, match}) =>
{
    let state = {
        targetKeys: [],
        selectedKeys: [],
        disabled: false,
    };

    const [imageUrl, setImageUrl] = React.useState("");

    const [dataSource, setDataSource] = React.useState([]);

    let { subscriptionId } = useParams();

    let viewModel = subscriptionStore.editSubscriptionViewModel;

    if(!viewModel) return;

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

    async function onFinish(values: any) {

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

    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);
    let listCarViewModel: ListCarViewModel;
    async function onLoad()
    {
        subscriptionStore.onSubscriptionEditPageLoad();

        if(match.params?.subscriptionId)
        {
            await subscriptionStore.editSubscriptionViewModel.getDetailSubscription(+match.params.subscriptionId);
            this.setState({ targetKeys: subscriptionStore.editSubscriptionViewModel.detailSubscriptionResponse.subscriptionCarNumbers});
        }
        else{
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest = new AddSubscriptionRequest();
            subscriptionStore.editSubscriptionViewModel.detailSubscriptionResponse = new DetailSubscriptionResponse();
        }

        listCarViewModel = new ListCarViewModel();
        debugger;
        let ww;
        if(UserContext.info.role == 100)
        {
            ww = await listCarViewModel.getCarList(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.companyId);
        }
        else if (UserContext.info.role == 1)
        {
            let role1 = await listCarViewModel.getCarList(UserContext.info.id);
            setDataSource(role1);
        }

    }

    function onUnload() {
        subscriptionStore.onSubscriptionEditPageUnload();
    }
    function onSelectChanged(e, propName){
        debugger;
        if(subscriptionId)
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest[`${propName}`] = e;
        else
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest[`${propName}`] = e;
    }
    function onChanged(e){
        if(subscriptionId)
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest[`${e.target.id}`] = e.target.value;
        else
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest[`${e.target.id}`] = e.target.value;
    }
    /*function onDateChange(date, dateString){
        debugger;
        if(subscriptionId)
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest.bankTransactionDate = dateString;
        else
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest.bankTransactionDate = dateString;
    }*/

    function handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={subscriptionId ? `${i18next.t("Subscriptions.Edit.HeaderText")} ${subscriptionId}` : i18next.t("Subscriptions.Add.HeaderText")}
            />

            <Divider>General Information</Divider>
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"subscriptionForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={16}>
                        <Transfer
                            dataSource={dataSource}
                            titles={['Source', 'Target']}
                            onSelectChange={handleSelectChange}
                            render={item => item.title}
                            oneWay
                            style={{ marginBottom: 16 }}
                        />
                    </Col>
                    {/*<Col span={8}>
                <Form.Item name="rechargePaymentMethod" initialValue={viewModel?.detailSubscriptionResponse?.rechargePaymentMethod}
                           key={"rechargePaymentMethod"}
                           label={i18next.t("Subscriptions.Label.rechargePaymentMethod")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Subscriptions.Validation.Message.rechargePaymentMethod.Required")
                               }
                           ]}>
                    <Select options={paymentMethodOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "rechargePaymentMethod")} />
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="bankName" initialValue={viewModel?.detailSubscriptionResponse?.bankName}
                                   key={"bankName"}
                                   label={i18next.t("Subscriptions.Label.bankName")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="bankTransactionDate" initialValue={viewModel?.detailSubscriptionResponse?.bankTransactionDate}
                                   key={"bankTransactionDate"}
                                   label={i18next.t("Subscriptions.Label.bankTransactionDate")}>
                            <DatePicker onChange={onDateChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="transactionPersonName" initialValue={viewModel?.detailSubscriptionResponse?.transactionPersonName}
                                   key={"transactionPersonName"}
                                   label={i18next.t("Subscriptions.Label.transactionPersonName")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Subscriptions.Label.rechargeDocumentPhoto")}</Divider>
                    <Col offset={8} span={8}>
                        <Upload
                            key={"uploader"}
                            className={"avatar-uploader"}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            customRequest= {customRequest}
                            showUploadList={false}
                        >
                            {imageUrl ? (
                                <div>
                                    <img src={imageUrl} alt="logo"
                                         style={{width: '100%', height: '150px'}}/>
                                    <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                </div>
                            ) : uploadButton}
                        </Upload>
                    </Col>*/}
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

        </div>
    )
}));

export default EditSubscription;
