import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";

import {
    Button,
    Col, DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    PageHeader,
    Radio,
    Row,
    Select,
    Spin,
    Upload
} from "antd";
import i18next from "i18next";
import DetailOdometerRecordResponse from "../../handlers/detail/DetailOdometerRecordResponse";
import AddOdometerRecordRequest from "../../handlers/add/AddOdometerRecordRequest";
import history from "../../../../app/utils/History";
import OdometerRecordStore from "../../stores/OdometerRecordStore";
import UserContext from "../../../../identity/contexts/UserContext";
import moment from "moment";
import Constants from "../../../../app/constants/Constants";

const {useEffect} = React;
const { Option } = Select;

interface EditOdometerRecordProps {
    odometerRecordStore?: OdometerRecordStore;
    match?: any;
}

const EditOdometerRecord: React.FC<EditOdometerRecordProps> = inject(Stores.odometerRecordStore)(observer(({odometerRecordStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [odometerRecordId, setOdometerRecordId] = React.useState(0);
    const [carOptions, setCarOptions] = React.useState([]);

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
        odometerRecordStore.onOdometerRecordEditPageLoad();
        let odometerRecordIdParam = +match.params?.odometerRecordId;

        if(odometerRecordIdParam)
        {
            await odometerRecordStore.editOdometerRecordViewModel.getDetailOdometerRecord(odometerRecordIdParam);
        }
        else{
            odometerRecordStore.editOdometerRecordViewModel.addOdometerRecordRequest = new AddOdometerRecordRequest();
            odometerRecordStore.editOdometerRecordViewModel.detailOdometerRecordResponse = new DetailOdometerRecordResponse();
        }
        if(UserContext.info.role === 100)
            await odometerRecordStore.listCarViewModel.getCarList(UserContext.info.id);
        else
            await odometerRecordStore.listCarViewModel.getCarList();

        let carOptions = [];
        for (let item of odometerRecordStore.listCarViewModel.listCarResponse.items) {
            carOptions.push(<Option key={item.key} value={item.key} balance={item.balance}>{item.carNumber}</Option>);
        }

        setCarOptions(carOptions);
        setOdometerRecordId(odometerRecordIdParam);
        setDataFetched(true);
    }

    let viewModel = odometerRecordStore.editOdometerRecordViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(odometerRecordId)
        {
            await viewModel.editOdometerRecord(viewModel.editOdometerRecordRequest);
        }
        else
        {
            await viewModel.addOdometerRecord(viewModel.addOdometerRecordRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        odometerRecordStore.onOdometerRecordEditPageUnload();
        setDataFetched(false);
        setOdometerRecordId(0);
    }
    function onChanged(e){
        if(odometerRecordId)
            viewModel.editOdometerRecordRequest[`${e.target.id}`] = e.target.value;
        else
            viewModel.addOdometerRecordRequest[`${e.target.id}`] = e.target.value;
    }
    function onOptionSelectChanged(e, propName){
        if(odometerRecordId)
            viewModel.editOdometerRecordRequest[`${propName}`] = e;
        else
            viewModel.addOdometerRecordRequest[`${propName}`] = e;
    }
    function onNumberChanged(e){
        if(odometerRecordId)
            viewModel.editOdometerRecordRequest.odometerValue = e;
        else
            viewModel.addOdometerRecordRequest.odometerValue = e;
    }

    function onDateChange(date, dateString, prop) {
        if(odometerRecordId)
            viewModel.editOdometerRecordRequest[`${prop}`] = dateString;
        else
            viewModel.addOdometerRecordRequest[`${prop}`] = dateString;
    }

    function disabledDate(current) {
        // Can not select days before today and today

        return current && current < moment().endOf('day');
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={odometerRecordId ? `${i18next.t("OdometerRecords.Edit.HeaderText")} ${odometerRecordId}` : i18next.t("OdometerRecords.Add.HeaderText")}
            />

            <Divider>{i18next.t("OdometerRecords.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"odometerRecordForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                        <Form.Item name="carId" initialValue={viewModel?.detailOdometerRecordResponse?.carId}
                                   key={"carId"}
                                   label={i18next.t("OdometerRecords.Label.carId")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("OdometerRecords.Validation.Message.carId.Required")
                                       }
                                   ]}>
                            <Select showSearch={true} onChange={(e, option) => onOptionSelectChanged(e, "carId")}>
                                {carOptions}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="odometerRecordDate" initialValue={viewModel?.detailOdometerRecordResponse?.odometerRecordDate ? moment(viewModel.detailOdometerRecordResponse.odometerRecordDate, Constants.dateFormat) : "" }
                                   key={"odometerRecordDate"}
                                   label={i18next.t("OdometerRecords.Label.odometerRecordDate")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("OdometerRecords.Validation.Message.odometerRecordDate.Required")
                                       }
                                   ]}
                        >
                            {/*<Input type={"number"} onChange={onChanged}/>*/}
                            <DatePicker disabledDate={disabledDate} format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "odometerRecordDate"))} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="odometerValue" initialValue={viewModel?.detailOdometerRecordResponse?.odometerValue}
                                   key={"odometerValue"}
                                   label={i18next.t("OdometerRecords.Label.odometerValue")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("OdometerRecords.Validation.Message.odometerValue.Required")
                                       }
                                   ]}>
                            <InputNumber min={1} style={{width: "100%"}} onChange={onNumberChanged} />
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

export default EditOdometerRecord;
