import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
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
import TransferBonusStore from "../../stores/TransferBonusStore";
import AddTransferBonusRequest from "../../handlers/add/AddTransferBonusRequest";
import UserContext from "../../../../identity/contexts/UserContext";
const {useEffect} = React;
const { Option } = Select;

interface EditTransferBonusProps {
    transferBonusStore?: TransferBonusStore;
}

const AddTransferBonus: React.FC<EditTransferBonusProps> = inject(Stores.transferBonusStore)(observer(({transferBonusStore}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [stationBonus, setStationBonus] = React.useState(0);
    const [rate, setRate] = React.useState(0);
    const [calcBalance, setCalcBalance] = React.useState(0);
    const [stationOptions, setStationOptions] = React.useState([]);

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
        transferBonusStore.onTransferBonusAddPageLoad();

        await transferBonusStore.listPetroStationViewModel.getPetroStationList();

        transferBonusStore.addTransferBonusViewModel.addTransferBonusRequest = new AddTransferBonusRequest();
        transferBonusStore.addTransferBonusViewModel.addTransferBonusRequest.amount = 0;

        if(UserContext.info.role === 10){
            transferBonusStore.addTransferBonusViewModel.addTransferBonusRequest.stationId = UserContext.info.id;
            const petro = transferBonusStore.listPetroStationViewModel.listPetroStationResponse?.items?.find(w => w.key === UserContext.info.id);
            debugger;
            setStationBonus(petro.bonus);
        }
        else {
            let stationOptions = [];
            for (let item of transferBonusStore.listPetroStationViewModel.listPetroStationResponse.items) {
                stationOptions.push(<Option key={item.key} value={item.key}
                                                  bonus={item.bonus}>{item.title}</Option>);
            }
            setStationOptions(stationOptions);
        }
        await transferBonusStore.editAppSettingViewModel.getDetailAppSetting();
        setRate(transferBonusStore.editAppSettingViewModel?.detailAppSettingResponse?.bonusMoneyRate ?? 0);
        setDataFetched(true);
    }

    let viewModel = transferBonusStore.addTransferBonusViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        await viewModel.addTransferBonus(viewModel.addTransferBonusRequest);
        if(!viewModel.errorMessage)
            history.goBack();
    };
    function onAmountChanged(e){
        setCalcBalance(e / rate);
        viewModel.addTransferBonusRequest.amount = +e;
    }
    function onUnload() {
        transferBonusStore.onTransferBonusAddPageUnload();
    }
    function onChanged(e){
            viewModel.addTransferBonusRequest[`${e.target.id}`] = e.target.value;
    }
    function onOptionSelectChanged(e, option, propName) {
        
        viewModel.addTransferBonusRequest[`${propName}`] = e;
        console.log(option);
        setStationBonus(+option.bonus);
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("TransferBonuses.Add.HeaderText")}
            />

            <Divider>{i18next.t("TransferBonuses.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"transferBonusForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    {UserContext.info.role === 100 &&
                    <Col offset={8} span={8}>
                        <Form.Item name="stationId" initialValue={viewModel?.addTransferBonusRequest?.stationId}
                                   key={"stationId"}
                                   label={i18next.t("TransferBonuses.Label.stationId")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("TransferBonuses.Validation.Message.stationId.Required")
                                       }
                                   ]}>
                            <Select showSearch={true}
                                    onChange={(e, option) => onOptionSelectChanged(e, option, "stationId")}>
                                {stationOptions}
                            </Select>
                        </Form.Item>
                    </Col>
                    }
                    <Col offset={8} span={8}>
                        <Form.Item name="stationBonus"
                                   key={"stationBonus"}
                                   label={i18next.t("TransferBonuses.Label.stationBonus")}>
                            <h4>{stationBonus?.toLocaleString()}</h4>
                        </Form.Item>
                    </Col>
                    <Col offset={8} span={8}>
                        <Form.Item name="amount"
                                   key={"amount"}
                                   label={i18next.t("TransferBonuses.Label.amount")}
                                 /*  rules={[
                            {
                                required: true,
                                message: i18next.t("TransferBonuses.Validation.Message.amount.Required")
                            }
                        ]}*/>
                            <InputNumber min={1} max={stationBonus} style={{width: "100%"}} onChange={onAmountChanged} /> {/*max={fromBalance}*/}
                        </Form.Item>
                    </Col>
                    <Col offset={8} span={8}>
                        <Form.Item name="calcBalance"
                                   key={"calcBalance"}
                                   label={i18next.t("TransferBonuses.Label.calcBalance")}>
                            <h4>{calcBalance?.toLocaleString()}</h4>
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

export default AddTransferBonus;
