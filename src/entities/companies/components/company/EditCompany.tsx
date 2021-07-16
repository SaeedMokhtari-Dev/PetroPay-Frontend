import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CompaniesStore from "entities/companies/stores/CompaniesStore";
import {useParams} from "react-router-dom";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    message,
    Modal,
    PageHeader,
    Radio,
    Row,
    Spin,
    Upload,
    Select,
    Image
} from "antd";
import i18next from "i18next";
import EditCompanyRequest from "../../handlers/edit/EditCompanyRequest";
import DetailCompanyResponse from "../../handlers/detail/DetailCompanyResponse";
import AddCompanyRequest from "../../handlers/add/AddCompanyRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import { PasswordInput } from 'antd-password-input-strength';
import "./EditCompany.scss";
import Types from "../../../../app/constants/Types";
import Countries from "../../../../app/constants/Countries";
import Regions from "../../../../app/constants/Regions";
import MaskedInput from "antd-mask-input";
import ImageConstants from "../../../../app/constants/ImageConstants";
const {useEffect} = React;

const { Option } = Select;

interface EditCompanyProps {
    companiesStore?: CompaniesStore;
    match?: any;
}

const EditCompany: React.FC<EditCompanyProps> = inject(Stores.companiesStore)(observer(({companiesStore, match}) =>
{
    const [imageUrl, setImageUrl] = React.useState("");
    const [dataFetched, setDataFetched] = React.useState(false);
    const [companyId, setCompanyId] = React.useState(0);
    const [companyTypeOptions, setCompanyTypeOptions] = React.useState([]);
    const [countryOptions, setCountryOptions] = React.useState([]);
    const [regionOptions, setRegionOptions] = React.useState([]);


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
        companiesStore.onCompanyEditPageLoad();
        let companyIdParam = +match.params?.companyId;

        if(companyIdParam)
        {
            await companiesStore.editCompanyViewModel.getDetailCompany(companyIdParam);
            setImageUrl(companiesStore.editCompanyViewModel?.detailCompanyResponse?.companyCommercialPhoto);
        }
        else{
            companiesStore.editCompanyViewModel.addCompanyRequest = new AddCompanyRequest();
            companiesStore.editCompanyViewModel.detailCompanyResponse = new DetailCompanyResponse();
        }
        let typesOptions = [];
        for (let item of Types) {
            typesOptions.push(<Option key={item.value} value={item.value}>{i18next.t(item.title)}</Option>);
        }
        setCompanyTypeOptions(typesOptions);

        let countriesOptions = [];
        for (let item of Countries) {
            countriesOptions.push(<Option key={item.value} value={item.value}>{i18next.t(item.title)}</Option>);
        }
        setCountryOptions(countriesOptions);

        let regionsOptions = [];
        for (let item of Regions) {
            regionsOptions.push(<Option key={item.value} value={item.value}>{i18next.t(item.title)}</Option>);
        }
        setRegionOptions(regionsOptions);

        setCompanyId(companyIdParam);
        setDataFetched(true);
    }

    let viewModel = companiesStore.editCompanyViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(companyId)
        {
            await viewModel.editCompany(viewModel.editCompanyRequest);
        }
        else
        {
            await viewModel.addCompany(viewModel.addCompanyRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        companiesStore.onCompanyEditPageUnload();
    }
    function onSelectChanged(e, propName){

        if(companyId)
            companiesStore.editCompanyViewModel.editCompanyRequest[`${propName}`] = e;
        else
            companiesStore.editCompanyViewModel.addCompanyRequest[`${propName}`] = e;
    }
    function onMaskChanged(e){
        if(companyId)
            companiesStore.editCompanyViewModel.editCompanyRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
        else
            companiesStore.editCompanyViewModel.addCompanyRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
    }

    function onChanged(e){
        if(companyId)
            companiesStore.editCompanyViewModel.editCompanyRequest[`${e.target.id}`] = e.target.value;
        else
            companiesStore.editCompanyViewModel.addCompanyRequest[`${e.target.id}`] = e.target.value;
    }
    function resetEveryThing(){
        if(companiesStore.editCompanyViewModel.key) {
            companiesStore.editCompanyViewModel.editCompanyRequest = new EditCompanyRequest();
            companiesStore.editCompanyViewModel.detailCompanyResponse = new DetailCompanyResponse();
        }
        else {
            companiesStore.editCompanyViewModel.addCompanyRequest = new AddCompanyRequest();
        }
        form.resetFields();
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
        let imageUrl = await toBase64(file);
        viewModel.detailCompanyResponse[`${propName}`] = imageUrl;
        if(companyId)
        {
            viewModel.editCompanyRequest[`${propName}`] = imageUrl;
            viewModel.editCompanyRequest[`Is${propName}`] = true;
        }
        else{
            viewModel.addCompanyRequest[`${propName}`] = imageUrl;
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

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={companyId ? `${i18next.t("Companies.Edit.HeaderText")} ${companyId}` : i18next.t("Companies.Add.HeaderText")}
            />

            <Divider>{i18next.t("Companies.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"companyForm"}
            /*initialValues={initialValues}*/ scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="companyName" initialValue={viewModel?.detailCompanyResponse?.companyName}
                           key={"companyName"}
                           label={i18next.t("Companies.Label.companyName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyCommercialNumber" initialValue={viewModel?.detailCompanyResponse?.companyCommercialNumber}
                           key={"companyCommercialNumber"}
                           label={i18next.t("Companies.Label.companyCommercialNumber")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyCommercialNumber.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="companyType" initialValue={viewModel?.detailCompanyResponse?.companyType}
                           key={"companyType"}
                           label={i18next.t("Companies.Label.companyType")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyType.Required")
                               }
                           ]}>
                    {/*<Input onChange={onChanged}/>*/}
                    <Select showSearch={true} onChange={(e) => onSelectChanged(e, "companyType")} >
                        {companyTypeOptions}
                    </Select>

                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyCountry" initialValue={viewModel?.detailCompanyResponse?.companyCountry}
                           key={"companyCountry"}
                           label={i18next.t("Companies.Label.companyCountry")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyCountry.Required")
                               }
                           ]}*/>
                    {/*<Input onChange={onChanged}/>*/}
                    <Select showSearch={true} onChange={(e) => onSelectChanged(e, "companyCountry")} >
                        {countryOptions}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyRegion" initialValue={viewModel?.detailCompanyResponse?.companyRegion}
                           key={"companyRegion"}
                           label={i18next.t("Companies.Label.companyRegion")}
                           >
                    <Select showSearch={true} onChange={(e) => onSelectChanged(e, "companyRegion")} >
                        {regionOptions}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAddress" initialValue={viewModel?.detailCompanyResponse?.companyAddress}
                           key={"companyAddress"}
                           label={i18next.t("Companies.Label.companyAddress")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAddress.Required")
                               }
                           ]}*/>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminName" initialValue={viewModel?.detailCompanyResponse?.companyAdminName}
                           key={"companyAdminName"}
                           label={i18next.t("Companies.Label.companyAdminName")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminName.Required")
                               }
                           ]}*/>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminPosition" initialValue={viewModel?.detailCompanyResponse?.companyAdminPosition}
                           key={"companyAdminPosition"}
                           label={i18next.t("Companies.Label.companyAdminPosition")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminPosition.Required")
                               }
                           ]}*/>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminPhone" initialValue={viewModel?.detailCompanyResponse?.companyAdminPhone}
                           key={"companyAdminPhone"}
                           label={i18next.t("Companies.Label.companyAdminPhone")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminPhone.Required")
                               }
                           ]}*/>
                    {/*<Input onChange={onChanged}/>*/}
                    <MaskedInput className={"phone-number"} mask="+2 111 111 11111" onChange={onMaskChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminEmail" initialValue={viewModel?.detailCompanyResponse?.companyAdminEmail}
                           key={"companyAdminEmail"}
                           label={i18next.t("Companies.Label.companyAdminEmail")}
                           rules={[
                               {
                                   type:"email",
                                   message: i18next.t("General.Email.Valid")
                               },
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminEmail.Required")
                               }
                           ]}>
                    <Input type={"email"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    {/*<Col span={8}>
                <Form.Item name="companyBalnce" initialValue={viewModel?.detailCompanyResponse?.companyBalnce}
                           key={"companyBalnce"}
                           label={i18next.t("Companies.Label.companyBalnce")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyBalnce.Required")
                               }
                           ]}
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>*/}
                    <Divider>{i18next.t("Companies.Section.LoginInformation")}</Divider>
                    <Col span={8}>
                        <Form.Item name="companyAdminUserName" initialValue={viewModel?.detailCompanyResponse?.companyAdminUserName}
                                   key={"companyAdminUserName"}
                                   label={i18next.t("Companies.Label.companyAdminUserName")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Companies.Validation.Message.companyAdminUserName.Required")
                                       },
                                       {
                                           pattern: /^\S*$/,
                                           message: i18next.t("Companies.Validation.Message.companyAdminUserName.Valid"),
                                       }
                                   ]}>
                            <Input onChange={onChanged}  autoComplete={"new-username"}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyAdminUserPassword" initialValue={viewModel?.detailCompanyResponse?.companyAdminUserPassword}
                                   key={"companyAdminUserPassword"}
                                   label={i18next.t("Companies.Label.companyAdminUserPassword")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Companies.Validation.Message.companyAdminUserPassword.Required")
                                       },
                                       {
                                           pattern: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g,
                                           message: i18next.t("Companies.Validation.Message.companyAdminUserPassword.Valid"),
                                       }
                                   ]}>
                            <PasswordInput inputProps={{autoComplete: "new-password"}}
                                onChange={onChanged}></PasswordInput>
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Companies.Label.companyCommercialPhoto")}</Divider>
                    <Col offset={8} span={8}>
                        <Form.Item name="companyCommercialPhoto" initialValue={viewModel?.detailCompanyResponse?.companyCommercialPhoto}
                                   key={"companyCommercialPhoto"}>
                            <Upload
                                key={"companyCommercialPhoto"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "companyCommercialPhoto")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailCompanyResponse?.companyCommercialPhoto ? (
                                    <div>
                                        <Image src={viewModel?.detailCompanyResponse?.companyCommercialPhoto}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="companyCommercialPhoto"
                                               style={{width: '100%', height: '150px'}}/>
                                        <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                    </div>
                                ) : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Companies.Section.TaxAndVat")}</Divider>
                    <Col span={8}>
                        <Form.Item name="companyVatNumber" initialValue={viewModel?.detailCompanyResponse?.companyVatNumber}
                                   key={"companyVatNumber"}
                                   label={i18next.t("Companies.Label.companyVatNumber")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="companyVatPhoto" initialValue={viewModel?.detailCompanyResponse?.companyVatPhoto}
                                   key={"companyVatPhoto"}
                                   label={i18next.t("Companies.Label.companyVatPhoto")}>
                            <Upload
                                key={"companyVatPhoto"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "companyVatPhoto")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailCompanyResponse?.companyVatPhoto ? (
                                    <div>
                                        <Image src={viewModel?.detailCompanyResponse?.companyVatPhoto}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="companyVatPhoto"
                                               style={{width: '100%', height: '150px'}}/>
                                        <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                    </div>
                                ) : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyTaxNumber" initialValue={viewModel?.detailCompanyResponse?.companyTaxNumber}
                                   key={"companyTaxNumber"}
                                   label={i18next.t("Companies.Label.companyTaxNumber")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="companyTaxPhoto" initialValue={viewModel?.detailCompanyResponse?.companyTaxPhoto}
                                   key={"companyTaxPhoto"}
                                   label={i18next.t("Companies.Label.companyTaxPhoto")}>
                            <Upload
                                key={"companyTaxPhoto"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "companyTaxPhoto")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailCompanyResponse?.companyTaxPhoto ? (
                                    <div>
                                        <Image src={viewModel?.detailCompanyResponse?.companyTaxPhoto}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="companyTaxPhoto"
                                               style={{width: '100%', height: '150px'}}/>
                                        <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                    </div>
                                ) : uploadButton}
                            </Upload>
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

export default EditCompany;
