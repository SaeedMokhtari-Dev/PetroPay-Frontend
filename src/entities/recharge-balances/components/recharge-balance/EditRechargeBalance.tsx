import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {useParams} from "react-router-dom";
import {Button, Col,
    DatePicker,
    Divider, Form, Input, InputNumber, message, Modal, PageHeader, Radio, Row, Select, Spin, Switch, Upload} from "antd";
import i18next from "i18next";
import EditRechargeBalanceRequest from "../../handlers/edit/EditRechargeBalanceRequest";
import DetailRechargeBalanceResponse from "../../handlers/detail/DetailRechargeBalanceResponse";
import AddRechargeBalanceRequest from "../../handlers/add/AddRechargeBalanceRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import RechargeBalanceStore from "../../stores/RechargeBalanceStore";
import { PasswordInput } from 'antd-password-input-strength';
import Countries from "../../../../app/constants/Countries";
import PaymentMethods from "../../../../app/constants/PaymentMethods";
import moment from 'moment';
import Constants from 'app/constants/Constants';
const {useEffect} = React;

interface EditRechargeBalanceProps {
    rechargeBalanceStore?: RechargeBalanceStore;
    match?: any;
}

const EditRechargeBalance: React.FC<EditRechargeBalanceProps> = inject(Stores.rechargeBalanceStore)(observer(({rechargeBalanceStore, match}) =>
{
    const [imageUrl, setImageUrl] = React.useState("");
    const [dataFetched, setDataFetched] = React.useState(false);

    const [rechargeBalanceId, setRechargeBalanceId] = React.useState(0);

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


    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {
        rechargeBalanceStore.onRechargeBalanceEditPageLoad();
        let rechargeBalanceIdParam = +match.params?.rechargeBalanceId;

        if(rechargeBalanceIdParam)
        {
            await rechargeBalanceStore.editRechargeBalanceViewModel.getDetailRechargeBalance(rechargeBalanceIdParam);
            setImageUrl(rechargeBalanceStore?.editRechargeBalanceViewModel?.detailRechargeBalanceResponse?.rechargeDocumentPhoto);
        }
        else{
            rechargeBalanceStore.editRechargeBalanceViewModel.addRechargeBalanceRequest = new AddRechargeBalanceRequest();
            rechargeBalanceStore.editRechargeBalanceViewModel.detailRechargeBalanceResponse = new DetailRechargeBalanceResponse();
        }
        setRechargeBalanceId(rechargeBalanceIdParam);
        setDataFetched(true);
    }
    let viewModel = rechargeBalanceStore.editRechargeBalanceViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(rechargeBalanceId)
        {
            await viewModel.editRechargeBalance(viewModel.editRechargeBalanceRequest);
        }
        else
        {
            await viewModel.addRechargeBalance(viewModel.addRechargeBalanceRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        rechargeBalanceStore.onRechargeBalanceEditPageUnload();
    }
    function onSelectChanged(e, propName){

        if(rechargeBalanceId)
            rechargeBalanceStore.editRechargeBalanceViewModel.editRechargeBalanceRequest[`${propName}`] = e;
        else
            rechargeBalanceStore.editRechargeBalanceViewModel.addRechargeBalanceRequest[`${propName}`] = e;
    }
    function onChanged(e){
        if(rechargeBalanceId)
            rechargeBalanceStore.editRechargeBalanceViewModel.editRechargeBalanceRequest[`${e.target.id}`] = e.target.value;
        else
            rechargeBalanceStore.editRechargeBalanceViewModel.addRechargeBalanceRequest[`${e.target.id}`] = e.target.value;
    }
    function onDateChange(date, dateString){

        if(rechargeBalanceId)
            rechargeBalanceStore.editRechargeBalanceViewModel.editRechargeBalanceRequest.bankTransactionDate = dateString;
        else
            rechargeBalanceStore.editRechargeBalanceViewModel.addRechargeBalanceRequest.bankTransactionDate = dateString;
    }

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file) {
        viewModel.uploadLoading = true;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            viewModel.uploadLoading = false;
            return false;
        }
        /*const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false;
        }*/
        getBase64(file, imageUrl => {

            viewModel.uploadLoading = false;
            if(rechargeBalanceId){
                viewModel.editRechargeBalanceRequest.rechargeDocumentPhoto = imageUrl;
                setImageUrl(imageUrl);
            }
            else {
                setImageUrl(imageUrl);
                viewModel.addRechargeBalanceRequest.rechargeDocumentPhoto = imageUrl;
            }
        });
        return true;
    }
    const uploadButton = (
        /*<div>
        {!viewModel?.detailCompanyResponse?.companyCommercialPhoto &&
            (*/
        <div className={"btn-uploader"}>
            {viewModel.uploadLoading ? <Spin /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
        /*  )
      }
      </div>*/
    );
    function customRequest(){

        return true;
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={rechargeBalanceId ? `${i18next.t("RechargeBalances.Edit.HeaderText")} ${rechargeBalanceId}` : i18next.t("RechargeBalances.Add.HeaderText")}
            />

            <Divider>{i18next.t("RechargeBalances.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"rechargeBalanceForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="rechargeAmount" initialValue={viewModel?.detailRechargeBalanceResponse?.rechargeAmount}
                           key={"rechargeAmount"}
                           label={i18next.t("RechargeBalances.Label.rechargeAmount")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("RechargeBalances.Validation.Message.rechargeAmount.Required")
                               }
                           ]}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="rechargePaymentMethod" initialValue={viewModel?.detailRechargeBalanceResponse?.rechargePaymentMethod}
                           key={"rechargePaymentMethod"}
                           label={i18next.t("RechargeBalances.Label.rechargePaymentMethod")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("RechargeBalances.Validation.Message.rechargePaymentMethod.Required")
                               }
                           ]}>
                    <Select options={paymentMethodOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "rechargePaymentMethod")} />
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="bankName" initialValue={viewModel?.detailRechargeBalanceResponse?.bankName}
                                   key={"bankName"}
                                   label={i18next.t("RechargeBalances.Label.bankName")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="bankTransactionDate"
                                   initialValue={viewModel?.detailRechargeBalanceResponse?.bankTransactionDate ? moment(viewModel?.detailRechargeBalanceResponse?.bankTransactionDate, Constants.dateFormat) : ""}
                                   key={"bankTransactionDate"}
                                   label={i18next.t("RechargeBalances.Label.bankTransactionDate")}>
                            <DatePicker onChange={onDateChange} format={Constants.dateFormat}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="transactionPersonName" initialValue={viewModel?.detailRechargeBalanceResponse?.transactionPersonName}
                                   key={"transactionPersonName"}
                                   label={i18next.t("RechargeBalances.Label.transactionPersonName")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("RechargeBalances.Label.rechargeDocumentPhoto")}</Divider>
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

export default EditRechargeBalance;
