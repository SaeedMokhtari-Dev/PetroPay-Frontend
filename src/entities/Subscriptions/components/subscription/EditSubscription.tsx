import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {
    Button, Col,
    DatePicker,
    Divider, Form, Input, InputNumber, PageHeader, Radio, Row, Select, Spin, Table, message, Upload, Descriptions
} from "antd";
import i18next from "i18next";
import DetailSubscriptionResponse from "../../handlers/detail/DetailSubscriptionResponse";
import AddSubscriptionRequest from "../../handlers/add/AddSubscriptionRequest";
import {
    PlusOutlined
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import moment from 'moment';
import SubscriptionTypes from 'app/constants/SubscriptionTypes';
import SubscriptionStore from "../../stores/SubscriptionStore";
import CalculateSubscriptionRequest from "../../handlers/calculate/CalculateSubscriptionRequest";
import "./EditSubscription.scss";
import BundlesColumns from "../../../bundles/components/list/BundlesColumns";
import CalculateSubscriptionResponse from "../../handlers/calculate/CalculateSubscriptionResponse";
const {useEffect} = React;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface EditSubscriptionProps {
    subscriptionStore?: SubscriptionStore;
    match?: any;
}

const EditSubscription: React.FC<EditSubscriptionProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore, match}) =>
{

    const dateFormat = 'DD/MM/YYYY';

    const [subscriptionType, setSubscriptionType] = React.useState("");
    const [subscriptionCost, setSubscriptionCost] = React.useState(new CalculateSubscriptionResponse());
    const [calculateButtonDisable, setCalculateButtonDisable] = React.useState(true);
    const [subscriptionEndDate, setSubscriptionEndDate] = React.useState("");
    const [dataFetched, setDataFetched] = React.useState(false);

    const [subscriptionId, setSubscriptionId] = React.useState(0);
    const [bundleId, setBundleId] = React.useState(0);
    const [carNumbersMinimum, setCarNumbersMinimum] = React.useState(0);
    const [carNumbersMaximum, setCarNumbersMaximum] = React.useState(0);
    const [payFromCompanyBalance, setPayFromCompanyBalance] = React.useState(true);
    const [petropayAccountOptions, setPetropayAccountOptions] = React.useState([]);
    const [imageUrl, setImageUrl] = React.useState("");

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

    SubscriptionTypes.forEach(w =>{ w.title = i18next.t(w.title) });
    const subscriptionTypeOptions = [...SubscriptionTypes];

    const rowSelection = {
        order: 2,
        onChange: (selectedRowKeys: React.Key[]) => {

            console.log(`selectedRowKeys: ${selectedRowKeys}`);
            try {
                setBundleId(+selectedRowKeys[0]);
                let bundle = subscriptionStore.listBundleViewModel?.bundleList?.find(w => w.key == +selectedRowKeys[0]);

                setCarNumbersMinimum(bundle?.bundlesNumberFrom)
                setCarNumbersMaximum(bundle?.bundlesNumberTo)
                if (subscriptionId) {
                    viewModel.editSubscriptionRequest.bundlesId = +selectedRowKeys[0];
                } else {
                    viewModel.addSubscriptionRequest.bundlesId = +selectedRowKeys[0];
                }
            }
            catch {}
        }
    };

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

        setSubscriptionId(subscriptionIdParam);
        if(subscriptionIdParam)
        {
            await subscriptionStore.editSubscriptionViewModel.getDetailSubscription(subscriptionIdParam);

            //setSubscriptionCost(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionCost);
            setSubscriptionType(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionType);
            setSubscriptionEndDate(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionEndDate);

            setBundleId(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.bundlesId);
            setPayFromCompanyBalance(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.payFromCompanyBalance);
            setImageUrl(subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionPaymentDocPhoto);
            rowSelection.onChange([subscriptionStore.editSubscriptionViewModel?.detailSubscriptionResponse?.bundlesId]);
        }
        else{
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest = new AddSubscriptionRequest();
            subscriptionStore.editSubscriptionViewModel.detailSubscriptionResponse = new DetailSubscriptionResponse();
            setPayFromCompanyBalance(true);
        }

        let petropayAccountOptions = [];
        for (let item of subscriptionStore.listPetropayAccountViewModel.listPetropayAccountResponse.items) {
            petropayAccountOptions.push(<Option key={item.key} value={item.title}>{item.title}</Option>);
        }
        setPetropayAccountOptions(petropayAccountOptions);

        setDataFetched(true);
    }

    let viewModel = subscriptionStore.editSubscriptionViewModel;

    if(!viewModel) return;

    async function onFinish(values: any) {
        
        viewModel.errorMessage = "";
        if(!bundleId)
        {
            viewModel.errorMessage = i18next.t("Subscriptions.Validation.Message.bundlesId.Required");
            return;
        }
        if(subscriptionId)
        {
            if(!viewModel.editSubscriptionRequest.payFromCompanyBalance && !viewModel.editSubscriptionRequest.subscriptionPaymentMethod){
                viewModel.errorMessage = i18next.t("Subscriptions.Validation.Message.subscriptionPaymentMethod.Required");
                return;
            }
            await viewModel.editSubscription(viewModel.editSubscriptionRequest);
        }
        else
        {
            if(!viewModel.addSubscriptionRequest.payFromCompanyBalance && !viewModel.addSubscriptionRequest.subscriptionPaymentMethod){
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
            viewModel.editSubscriptionRequest[`${propName}`] = e;
        else
            viewModel.addSubscriptionRequest[`${propName}`] = e;

        if(propName == "subscriptionType"){
            setSubscriptionType(e);
        }
    }
    function onChanged(e){
        if(subscriptionId)
            viewModel.editSubscriptionRequest[`${e.target.id}`] = e.target.value;
        else
            viewModel.addSubscriptionRequest[`${e.target.id}`] = e.target.value;

        if(e.target.id === "couponCode")
            setCalculateButtonDisable(false);
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
            viewModel.editSubscriptionRequest.subscriptionStartDate = d[0];
            viewModel.editSubscriptionRequest.subscriptionEndDate = d[1];
        }
        else {
            viewModel.addSubscriptionRequest.subscriptionStartDate = d[0];
            viewModel.addSubscriptionRequest.subscriptionEndDate = d[1];
        }
        setCalculateButtonDisable(false);
    }
    function onEditDatePickerChanged(e, d){
        
        console.log(e);
        console.log(d);
        if(subscriptionId) {
            viewModel.editSubscriptionRequest.subscriptionStartDate = d;
            viewModel.editSubscriptionRequest.subscriptionEndDate = moment(viewModel.editSubscriptionRequest.subscriptionStartDate, dateFormat)
                .add(viewModel.editSubscriptionRequest.numberOfDateDiff,
                viewModel.editSubscriptionRequest.subscriptionType === "Yearly" ? 'y' : 'M').format(dateFormat).toString();
            viewModel.detailSubscriptionResponse.subscriptionEndDate = viewModel.editSubscriptionRequest.subscriptionEndDate;
            setSubscriptionEndDate(viewModel.editSubscriptionRequest.subscriptionEndDate);
        }
        else{
            viewModel.addSubscriptionRequest.subscriptionStartDate = d;
            viewModel.addSubscriptionRequest.subscriptionEndDate = moment(viewModel.addSubscriptionRequest.subscriptionStartDate, dateFormat)
                .add(viewModel.addSubscriptionRequest.numberOfDateDiff,
                    viewModel.addSubscriptionRequest.subscriptionType === "Yearly" ? 'y' : 'M').format(dateFormat).toString();
            viewModel.detailSubscriptionResponse.subscriptionEndDate = viewModel.addSubscriptionRequest.subscriptionEndDate;
            setSubscriptionEndDate(viewModel.addSubscriptionRequest.subscriptionEndDate);
        }
        setCalculateButtonDisable(false);
    }
    function DateTimeChange(e){

        viewModel.editSubscriptionRequest.subscriptionEndDate =
            moment(viewModel.editSubscriptionRequest.subscriptionStartDate).add(e,
                viewModel.editSubscriptionRequest.subscriptionType === "Yearly" ? 'y' : 'M').format(dateFormat).toString();
        setCalculateButtonDisable(false);
    }
    async function calculate(){
        setSubscriptionCost(new CalculateSubscriptionResponse());
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
            request.couponCode = viewModel.editSubscriptionRequest.couponCode;
            request.numberOfDateDiff = viewModel.editSubscriptionRequest.numberOfDateDiff;
        }
        else {
            request.subscriptionCarNumbers = viewModel.addSubscriptionRequest.subscriptionCarNumbers;
            request.subscriptionType = viewModel.addSubscriptionRequest.subscriptionType;
            request.subscriptionStartDate = viewModel.addSubscriptionRequest.subscriptionStartDate;
            request.subscriptionEndDate = viewModel.addSubscriptionRequest.subscriptionEndDate;
            request.couponCode = viewModel.addSubscriptionRequest.couponCode;
            request.numberOfDateDiff = viewModel.addSubscriptionRequest.numberOfDateDiff;
        }
        debugger;
        let result = await viewModel.calculateCost(request, subscriptionId);

        setSubscriptionCost(result);
    }


    function onNumberChanged(e){
        if(subscriptionId)
        {
            viewModel.editSubscriptionRequest.subscriptionCarNumbers = e;
        }
        else{
            viewModel.addSubscriptionRequest.subscriptionCarNumbers = e;
        }
    }
    function onNumberOfDateDiffChanged(e){
        
        if(subscriptionId)
        {
            viewModel.editSubscriptionRequest.numberOfDateDiff = e;
            if(viewModel.editSubscriptionRequest?.subscriptionStartDate)
            {
                viewModel.editSubscriptionRequest.subscriptionEndDate = moment(viewModel.editSubscriptionRequest.subscriptionStartDate, dateFormat)
                    .add(e,
                        viewModel.editSubscriptionRequest.subscriptionType === "Yearly" ? 'y' : 'M').format(dateFormat).toString();
                viewModel.detailSubscriptionResponse.subscriptionEndDate = viewModel.editSubscriptionRequest.subscriptionEndDate;
                setSubscriptionEndDate(viewModel.editSubscriptionRequest.subscriptionEndDate);
            }
        }
        else{
            viewModel.addSubscriptionRequest.numberOfDateDiff = e;
            if(viewModel.addSubscriptionRequest?.subscriptionStartDate)
            {
                viewModel.addSubscriptionRequest.subscriptionEndDate = moment(viewModel.addSubscriptionRequest.subscriptionStartDate, dateFormat)
                    .add(e,
                        viewModel.addSubscriptionRequest.subscriptionType === "Yearly" ? 'y' : 'M').format(dateFormat).toString();
                viewModel.detailSubscriptionResponse.subscriptionEndDate = viewModel.addSubscriptionRequest.subscriptionEndDate;
                setSubscriptionEndDate(viewModel.addSubscriptionRequest.subscriptionEndDate);
            }
        }
    }
    function onRadioChange(e){
        
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

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file) {
        viewModel.uploadLoading = true;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error(i18next.t("General.Image.JustImage"));
            viewModel.uploadLoading = false;
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error(i18next.t("General.Image.LessThan2MB"));
            viewModel.uploadLoading = false;
            return false;
        }
        getBase64(file, imageUrl => {

            viewModel.uploadLoading = false;
            if(subscriptionId){
                viewModel.editSubscriptionRequest.subscriptionPaymentDocPhoto = imageUrl;
                setImageUrl(imageUrl);
            }
            else {
                setImageUrl(imageUrl);
                viewModel.addSubscriptionRequest.subscriptionPaymentDocPhoto = imageUrl;
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
                title={subscriptionId ? `${i18next.t("Subscriptions.Edit.HeaderText")} ${subscriptionId}` : i18next.t("Subscriptions.Add.HeaderText")}
            />
            <Divider>{i18next.t("Subscriptions.Section.BundleInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"subscriptionForm"}
                 scrollToFirstError>
                <Table dataSource={subscriptionStore.listBundleViewModel?.bundleList} columns={columns} loading={subscriptionStore.listBundleViewModel?.isProcessing}
                       bordered={true} pagination={false} scroll={{ x: 1500 }} sticky
                       rowKey = {record => record.key}
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
                    <Col span={8}>
                <Form.Item name="paymentReferenceNumber" initialValue={viewModel?.detailSubscriptionResponse?.paymentReferenceNumber}
                           key={"paymentReferenceNumber"}
                           label={i18next.t("Subscriptions.Label.paymentReferenceNumber")}
                           >
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}></Col>
                    <Col span={4}>
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
                    <Col span={6}>
                        <Form.Item name="numberOfDateDiff" initialValue={viewModel?.detailSubscriptionResponse?.numberOfDateDiff}
                                   key={"numberOfDateDiff"}
                                   label={i18next.t("Subscriptions.Label.numberOfDateDiff")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Subscriptions.Validation.Message.numberOfDateDiff.Required")
                                       }
                                   ]}>
                            <InputNumber min={1} onChange={(e) => onNumberOfDateDiffChanged(e)} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="subscriptionStartDate" initialValue={viewModel?.detailSubscriptionResponse?.subscriptionStartDate
                            ? moment(viewModel.detailSubscriptionResponse.subscriptionStartDate, dateFormat): ""}
                                   key={"subscriptionStartDate"}
                                   label={i18next.t("Subscriptions.Label.subscriptionStartDate")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Subscriptions.Validation.Message.subscriptionStartDate.Required")
                                       }
                                   ]}>
                            <DatePicker disabledDate={disabledDate} format={dateFormat}
                                        onChange={(e, d) => onEditDatePickerChanged(e, d)} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="subscriptionEndDate" initialValue={viewModel.detailSubscriptionResponse?.subscriptionEndDate}
                                   key={"subscriptionEndDate"}
                                   label={i18next.t("Subscriptions.Label.subscriptionEndDate")}>
                            {subscriptionEndDate}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="couponCode" initialValue={viewModel?.detailSubscriptionResponse?.couponCode}
                                   key={"couponCode"}
                                   label={i18next.t("Subscriptions.Label.couponCode")}
                        >
                            <Input maxLength={10} onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" loading={viewModel.calculating} size={"large"} disabled={calculateButtonDisable} onClick={calculate}>
                            {i18next.t("Subscriptions.Button.Calculate")}
                        </Button>
                    </Col>
                    <Col span={9}>
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
                        <Select style={{width: "100%", display:"block"}} defaultValue={viewModel?.detailSubscriptionResponse?.subscriptionPaymentMethod}
                                key={"subscriptionPaymentMethod"}
                                showSearch={true} onChange={(e) => onSelectChanged(e, "subscriptionPaymentMethod")}>
                            {petropayAccountOptions}
                        </Select>
                        }
                    </Col>
                    <Col offset={7} span={8}>
                        {subscriptionCost.subscriptionCost ?
                            <Descriptions title={i18next.t("Subscriptions.Invoice")} bordered>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.subTotal")} span={3}>
                                    {subscriptionCost.subTotal}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.discount")} span={3}>
                                    {subscriptionCost.discount}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.taxRate")} span={3}>
                                    {subscriptionCost.taxRate} %
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.tax")} span={3}>
                                    {subscriptionCost.tax}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.vatRate")} span={3}>
                                    {subscriptionCost.vatRate} %
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.vat")} span={3}>
                                    {subscriptionCost.vat}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                                <Descriptions.Item label={i18next.t("Subscriptions.Invoice.Label.total")} span={3}>
                                    {subscriptionCost.subscriptionCost}  {i18next.t("General.Currency.Symbol")}
                                </Descriptions.Item>
                            </Descriptions>
                            : ""
                        }
                    </Col>

                    <Divider>{i18next.t("Subscriptions.Label.subscriptionPaymentDocPhoto")}</Divider>
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
