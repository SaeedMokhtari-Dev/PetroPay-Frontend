import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Image,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    PageHeader,
    Radio,
    Row,
    Spin, Switch,
    Upload
} from "antd";
import i18next from "i18next";
import DetailAppSettingResponse from "../../handlers/detail/DetailAppSettingResponse";
import AddAppSettingRequest from "../../handlers/add/AddAppSettingRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import AppSettingStore from "../../stores/AppSettingStore";
import moment from "moment";
import Constants from "../../../../app/constants/Constants";
import ImageConstants from "../../../../app/constants/ImageConstants";
const {useEffect} = React;

interface EditAppSettingProps {
    appSettingStore?: AppSettingStore;
}

const EditAppSetting: React.FC<EditAppSettingProps> = inject(Stores.appSettingStore)(observer(({appSettingStore}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);

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
        appSettingStore.onAppSettingEditPageLoad();
        await appSettingStore.editAppSettingViewModel.getDetailAppSetting();

        if(appSettingStore.editAppSettingViewModel?.detailAppSettingResponse)
        {
            setIsEdit(true);
        }
        else{
            appSettingStore.editAppSettingViewModel.addAppSettingRequest = new AddAppSettingRequest();
            appSettingStore.editAppSettingViewModel.detailAppSettingResponse = new DetailAppSettingResponse();
        }

        setDataFetched(true);
    }

    let viewModel = appSettingStore.editAppSettingViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(isEdit)
        {
            await viewModel.editAppSetting(viewModel.editAppSettingRequest);
        }
        else
        {
            await viewModel.addAppSetting(viewModel.addAppSettingRequest);
        }
        /*if(!viewModel.errorMessage)
            history.goBack();*/
    };

    function onUnload() {
        appSettingStore.onAppSettingEditPageUnload();
        setDataFetched(false);
    }
    function onChanged(e){
        if(isEdit)
            appSettingStore.editAppSettingViewModel.editAppSettingRequest[`${e.target.id}`] = e.target.value;
        else
            appSettingStore.editAppSettingViewModel.addAppSettingRequest[`${e.target.id}`] = e.target.value;
    }
    function onNumberChanged(e, propName){
        if(isEdit)
            appSettingStore.editAppSettingViewModel.editAppSettingRequest[`${propName}`] = e;
        else
            appSettingStore.editAppSettingViewModel.addAppSettingRequest[`${propName}`] = e;
    }
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    async function beforeUpload(file, propName) : Promise<boolean> {
        viewModel.uploadLoading = true;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            viewModel.uploadLoading = false;
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            viewModel.uploadLoading = false;
            return false;
        }
        let imageUrl = await toBase64(file);
        viewModel.detailAppSettingResponse[`${propName}`] = imageUrl;
        if(isEdit)
        {
            viewModel.editAppSettingRequest[`${propName}`] = imageUrl;
        }
        else{
            viewModel.addAppSettingRequest[`${propName}`] = imageUrl;
        }
        viewModel.uploadLoading = false;
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
    function disabledDate(current) {
        // Can not select days before today and today

        return current && current < moment().endOf('day');
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={isEdit ? `${i18next.t("AppSettings.Edit.HeaderText")}` : i18next.t("AppSettings.Add.HeaderText")}
            />

            <Divider>{i18next.t("AppSettings.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"appSettingForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="companyNameEn" initialValue={viewModel?.detailAppSettingResponse?.companyNameEn}
                           key={"companyNameEn"}
                           label={i18next.t("AppSettings.Label.companyNameEn")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("AppSettings.Validation.Message.companyNameEn.Required")
                               }
                           ]}>
                    <Input onChange={onChanged} style={{direction: 'ltr'}}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyNameAr" initialValue={viewModel?.detailAppSettingResponse?.companyNameAr}
                           key={"companyNameAr"}
                           label={i18next.t("AppSettings.Label.companyNameAr")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("AppSettings.Validation.Message.companyNameAr.Required")
                               }
                           ]}>
                    <Input onChange={onChanged} style={{direction: 'rtl'}}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAddress" initialValue={viewModel?.detailAppSettingResponse?.companyAddress}
                           key={"companyAddress"}
                           label={i18next.t("AppSettings.Label.companyAddress")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("AppSettings.Validation.Message.companyAddress.Required")
                               }
                           ]}>
                    <Input.TextArea onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyEmail" initialValue={viewModel?.detailAppSettingResponse?.companyEmail}
                                   key={"companyEmail"}
                                   label={i18next.t("AppSettings.Label.companyEmail")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("AppSettings.Validation.Message.companyEmail.Required")
                                       }
                                   ]}>
                            <Input onChange={onChanged} style={{direction: 'ltr'}}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyCommercialRecordNumber" initialValue={viewModel?.detailAppSettingResponse?.companyCommercialRecordNumber}
                                   key={"companyCommercialRecordNumber"}
                                   label={i18next.t("AppSettings.Label.companyCommercialRecordNumber")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyVatTaxNumber" initialValue={viewModel?.detailAppSettingResponse?.companyVatTaxNumber}
                                   key={"companyVatTaxNumber"}
                                   label={i18next.t("AppSettings.Label.companyVatTaxNumber")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyVatRate" initialValue={viewModel?.detailAppSettingResponse?.companyVatRate}
                                   key={"companyVatRate"}
                                   label={i18next.t("AppSettings.Label.companyVatRate")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("AppSettings.Validation.Message.companyVatRate.Required")
                                       }
                                   ]}>
                            <InputNumber onChange={(e) => onNumberChanged(e, "companyVatRate")}
                                style={{width: "100%"}}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="comapnyTaxRecordNumber" initialValue={viewModel?.detailAppSettingResponse?.comapnyTaxRecordNumber}
                                   key={"comapnyTaxRecordNumber"}
                                   label={i18next.t("AppSettings.Label.comapnyTaxRecordNumber")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyLogo" initialValue={viewModel?.detailAppSettingResponse?.companyLogo}
                                   key={"companyLogo"}
                                   label={i18next.t("AppSettings.Label.companyLogo")}>
                            <Upload
                                key={"companyLogo"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "companyLogo")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailAppSettingResponse?.companyLogo ? (
                                    <div>
                                        <Image src={viewModel?.detailAppSettingResponse?.companyLogo}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="companyLogo"
                                               style={{width: '100%', height: '150px'}}/>
                                        <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                    </div>
                                ) : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyStampImage" initialValue={viewModel?.detailAppSettingResponse?.companyStampImage}
                                   key={"companyStampImage"}
                                   label={i18next.t("AppSettings.Label.companyStampImage")}>
                            <Upload
                                key={"companyStampImage"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "companyStampImage")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailAppSettingResponse?.companyStampImage ? (
                                    <div>
                                        <Image src={viewModel?.detailAppSettingResponse?.companyStampImage}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="companyStampImage"
                                               style={{width: '100%', height: '150px'}}/>
                                        <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                    </div>
                                ) : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="comapnyTaxRate" initialValue={viewModel?.detailAppSettingResponse?.comapnyTaxRate}
                                   key={"comapnyTaxRate"}
                                   label={i18next.t("AppSettings.Label.comapnyTaxRate")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("AppSettings.Validation.Message.comapnyTaxRate.Required")
                                       }
                                   ]}>
                            <InputNumber onChange={(e) => onNumberChanged(e, "comapnyTaxRate")} style={{width: "100%"}}/>
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

export default EditAppSetting;
