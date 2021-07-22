import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {useParams} from "react-router-dom";
import {
    Button,
    Col,
    Divider,
    Spin,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    PageHeader,
    Radio,
    Row,
    Switch,
    Select
} from "antd";
import i18next from "i18next";
import history from "../../../../app/utils/History";
import PetropayAccountStore from "../../stores/PetropayAccountStore";
import PaymentPetropayAccountRequest from "../../handlers/payment/PaymentPetropayAccountRequest";
const {useEffect} = React;
const { Option } = Select;
const { TextArea } = Input;

interface EditPetropayAccountProps {
    petropayAccountStore?: PetropayAccountStore;
    match?: any;
}

const PaymentPetropayAccount: React.FC<EditPetropayAccountProps> = inject(Stores.petropayAccountStore)(observer(({petropayAccountStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [petropayAccountOptions, setPetropayAccountOptions] = React.useState([]);
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


    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {
        petropayAccountStore.onPetropayAccountPaymentPageLoad();

        await petropayAccountStore.listPetropayAccountViewModel.getPetropayAccountList(false);
        //let petropayAccountIdParam = +match.params?.petropayAccountId;

        /*if(!petropayAccountIdParam)
            history.goBack();*/

        let petropayAccountOptions = [];
        for (let item of petropayAccountStore.listPetropayAccountViewModel.listPetropayAccountResponse.items) {
            petropayAccountOptions.push(<Option key={item.key} value={item.key} balance={item.balance}>{item.title}</Option>);
        }
        setPetropayAccountOptions(petropayAccountOptions);
        
        petropayAccountStore.paymentPetropayAccountViewModel.paymentPetropayAccountRequest = new PaymentPetropayAccountRequest();
        petropayAccountStore.paymentPetropayAccountViewModel.paymentPetropayAccountRequest.amount = 0;

        setDataFetched(true);
    }

    let viewModel = petropayAccountStore.paymentPetropayAccountViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        await viewModel.paymentPetropayAccount(viewModel.paymentPetropayAccountRequest);
        if(!viewModel.errorMessage)
            history.goBack();
    };
    function onAmountChanged(e){
        
        viewModel.paymentPetropayAccountRequest.amount = +e;
    }
    function onUnload() {
        petropayAccountStore.onPetropayAccountPaymentPageUnload();
    }
    function onChanged(e){
            viewModel.paymentPetropayAccountRequest[`${e.target.id}`] = e.target.value;
    }
    function onOptionSelectChanged(e, option, propName, isFrom) {
        
        viewModel.paymentPetropayAccountRequest[`${propName}`] = e;
        console.log(option);
        if(isFrom){
            setFromBalance(+option.balance);
        }
        else{
            setToBalance(+option.balance);
        }
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("PetropayAccounts.Payment.HeaderText")}
            />

            <Divider>{i18next.t("PetropayAccounts.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"petropayAccountForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={12}>
                <Form.Item name="fromPetroPayAccountId" initialValue={viewModel?.paymentPetropayAccountRequest?.fromPetroPayAccountId}
                           key={"fromPetroPayAccountId"}
                           label={i18next.t("PetropayAccounts.Label.fromPetroPayAccountId")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetropayAccounts.Validation.Message.fromPetroPayAccountId.Required")
                               }
                           ]}>
                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option, "fromPetroPayAccountId", true)} >
                        {petropayAccountOptions}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="fromPetroPayAccountBalance"
                                   key={"fromPetroPayAccountBalance"}
                                   label={i18next.t("PetropayAccounts.Label.fromPetroPayAccountBalance")}>
                            <h4>{fromBalance?.toLocaleString()}</h4>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                <Form.Item name="toPetroPayAccountId" initialValue={viewModel?.paymentPetropayAccountRequest?.toPetroPayAccountId}
                           key={"toPetroPayAccountId"}
                           label={i18next.t("PetropayAccounts.Label.toPetroPayAccountId")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetropayAccounts.Validation.Message.toPetroPayAccountId.Required")
                               }
                           ]}>
                    <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, option, "toPetroPayAccountId", false)} >
                        {petropayAccountOptions}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="toPetroPayAccountBalance"
                                   key={"toPetroPayAccountBalance"}
                                   label={i18next.t("PetropayAccounts.Label.toPetroPayAccountBalance")}>
                            <h4>{toBalance?.toLocaleString()}</h4>
                        </Form.Item>
                    </Col>
                    <Col offset={8} span={8}>
                        <Form.Item name="amount"
                                   key={"amount"}
                                   label={i18next.t("PetropayAccounts.Label.amount")}
                                   /*rules={[
                            {
                                required: true,
                                message: i18next.t("PetropayAccounts.Validation.Message.amount.Required")
                            }
                        ]}*/>
                            <InputNumber min={1} style={{width: "100%"}} onChange={onAmountChanged} /> {/*max={fromBalance}*/}
                        </Form.Item>
                    </Col>
                    <Col offset={8} span={8}>
                <Form.Item name="reference" initialValue={viewModel?.paymentPetropayAccountRequest?.reference}
                           key={"reference"}
                           label={i18next.t("PetropayAccounts.Label.reference")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetropayAccounts.Validation.Message.reference.Required")
                               }
                           ]}>
                    <Input maxLength={50} onChange={onChanged}/>
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

export default PaymentPetropayAccount;
