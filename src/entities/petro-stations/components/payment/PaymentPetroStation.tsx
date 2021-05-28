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
import EditPetroStationRequest from "../../handlers/edit/EditPetroStationRequest";
import DetailPetroStationResponse from "../../handlers/detail/DetailPetroStationResponse";
import AddPetroStationRequest from "../../handlers/add/AddPetroStationRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import PetroStationStore from "../../stores/PetroStationStore";
import { PasswordInput } from 'antd-password-input-strength';
import MaskedInput from "antd-mask-input";
import Regions from "../../../../app/constants/Regions";
import PaymentPetroStationRequest from "../../handlers/payment/PaymentPetroStationRequest";
const {useEffect} = React;
const { Option } = Select;
const { TextArea } = Input;

interface EditPetroStationProps {
    petroStationStore?: PetroStationStore;
    match?: any;
}

const PaymentPetroStation: React.FC<EditPetroStationProps> = inject(Stores.petroStationStore)(observer(({petroStationStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
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


    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {
        petroStationStore.onPetroStationPaymentPageLoad();
        await petroStationStore.listPetropayAccountViewModel.getPetropayAccountList();
        let petroStationIdParam = +match.params?.petroStationId;

        if(!petroStationIdParam)
            history.goBack();

        let petropayAccountOptions = [];
        for (let item of petroStationStore.listPetropayAccountViewModel.listPetropayAccountResponse.items) {
            petropayAccountOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
        }
        setPetropayAccountOptions(petropayAccountOptions);

        petroStationStore.paymentPetroStationViewModel.paymentPetroStationRequest = new PaymentPetroStationRequest();
        petroStationStore.paymentPetroStationViewModel.paymentPetroStationRequest.stationId = petroStationIdParam;
        petroStationStore.paymentPetroStationViewModel.paymentPetroStationRequest.amount = 0;

        setDataFetched(true);
    }

    let viewModel = petroStationStore.paymentPetroStationViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        await viewModel.paymentPetroStation(viewModel.paymentPetroStationRequest);
        if(!viewModel.errorMessage)
            history.goBack();
    };
    function onAmountChanged(e){
        debugger;
        viewModel.paymentPetroStationRequest.amount = +e;
    }
    function onUnload() {
        petroStationStore.onPetroStationPaymentPageUnload();
    }
    function onChanged(e){
            viewModel.paymentPetroStationRequest[`${e.target.id}`] = e.target.value;
    }
    function onMaskChanged(e){
            viewModel.paymentPetroStationRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
    }
    function onSelectChanged(e, propName){
            viewModel.paymentPetroStationRequest[`${propName}`] = e;
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("PetroStations.Payment.HeaderText")}
            />

            <Divider>{i18next.t("PetroStations.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"petroStationForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col offset={8} span={8}>
                <Form.Item name="petroPayAccountId" initialValue={viewModel?.paymentPetroStationRequest?.petroPayAccountId}
                           key={"petroPayAccountId"}
                           label={i18next.t("PetroStations.Label.petroPayAccountId")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetroStations.Validation.Message.petroPayAccountId.Required")
                               }
                           ]}>
                    <Select showSearch={true} onChange={(e) => onSelectChanged(e, "petroPayAccountId")} >
                        {petropayAccountOptions}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col offset={8} span={8}>
                        <Form.Item name="amount"
                                   key={"amount"}
                                   label={i18next.t("PetroStations.Label.amount")}
                                   /*rules={[
                            {
                                required: true,
                                message: i18next.t("PetroStations.Validation.Message.amount.Required")
                            }
                        ]}*/>
                            <InputNumber min={1} style={{width: "100%"}} onChange={onAmountChanged} /> {/*max={fromBalance}*/}
                        </Form.Item>
                    </Col>
                    <Col offset={8} span={8}>
                <Form.Item name="reference" initialValue={viewModel?.paymentPetroStationRequest?.reference}
                           key={"reference"}
                           label={i18next.t("PetroStations.Label.reference")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetroStations.Validation.Message.reference.Required")
                               }
                           ]}>
                    <TextArea onChange={onChanged}/>
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

export default PaymentPetroStation;
