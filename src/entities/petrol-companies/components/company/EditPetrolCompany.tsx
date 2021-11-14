import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import PetrolCompaniesStore from "entities/petrol-companies/stores/PetrolCompaniesStore";
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
import EditPetrolCompanyRequest from "../../handlers/edit/EditPetrolCompanyRequest";
import DetailPetrolCompanyResponse from "../../handlers/detail/DetailPetrolCompanyResponse";
import AddPetrolCompanyRequest from "../../handlers/add/AddPetrolCompanyRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import { PasswordInput } from 'antd-password-input-strength';
import "./EditPetrolCompany.scss";
import Types from "../../../../app/constants/Types";
import Countries from "../../../../app/constants/Countries";
import Regions from "../../../../app/constants/Regions";
import MaskedInput from "antd-mask-input";
import ImageConstants from "../../../../app/constants/ImageConstants";
const {useEffect} = React;

const { Option } = Select;

interface EditPetrolCompanyProps {
    petrolCompaniesStore?: PetrolCompaniesStore;
    match?: any;
}

const EditPetrolCompany: React.FC<EditPetrolCompanyProps> = inject(Stores.petrolCompaniesStore)(observer(({petrolCompaniesStore, match}) =>
{
    const [imageUrl, setImageUrl] = React.useState("");
    const [dataFetched, setDataFetched] = React.useState(false);
    const [petrolCompanyId, setPetrolCompanyId] = React.useState(0);
    const [petrolCompanyTypeOptions, setPetrolCompanyTypeOptions] = React.useState([]);
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
        petrolCompaniesStore.onPetrolCompanyEditPageLoad();
        let petrolCompanyIdParam = +match.params?.petrolCompanyId;

        if(petrolCompanyIdParam)
        {
            await petrolCompaniesStore.editPetrolCompanyViewModel.getDetailPetrolCompany(petrolCompanyIdParam);
            setImageUrl(petrolCompaniesStore.editPetrolCompanyViewModel?.detailPetrolCompanyResponse?.petrolCompanyCommercialPhoto);
        }
        else{
            petrolCompaniesStore.editPetrolCompanyViewModel.addPetrolCompanyRequest = new AddPetrolCompanyRequest();
            petrolCompaniesStore.editPetrolCompanyViewModel.detailPetrolCompanyResponse = new DetailPetrolCompanyResponse();
        }
        let typesOptions = [];
        for (let item of Types) {
            typesOptions.push(<Option key={item.value} value={item.value}>{i18next.t(item.title)}</Option>);
        }
        setPetrolCompanyTypeOptions(typesOptions);

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

        setPetrolCompanyId(petrolCompanyIdParam);
        setDataFetched(true);
    }

    let viewModel = petrolCompaniesStore.editPetrolCompanyViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(petrolCompanyId)
        {
            await viewModel.editPetrolCompany(viewModel.editPetrolCompanyRequest);
        }
        else
        {
            await viewModel.addPetrolCompany(viewModel.addPetrolCompanyRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        petrolCompaniesStore.onPetrolCompanyEditPageUnload();
    }
    function onSelectChanged(e, propName){

        if(petrolCompanyId)
            petrolCompaniesStore.editPetrolCompanyViewModel.editPetrolCompanyRequest[`${propName}`] = e;
        else
            petrolCompaniesStore.editPetrolCompanyViewModel.addPetrolCompanyRequest[`${propName}`] = e;
    }
    function onMaskChanged(e){
        if(petrolCompanyId)
            petrolCompaniesStore.editPetrolCompanyViewModel.editPetrolCompanyRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
        else
            petrolCompaniesStore.editPetrolCompanyViewModel.addPetrolCompanyRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
    }

    function onChanged(e){
        if(petrolCompanyId)
            petrolCompaniesStore.editPetrolCompanyViewModel.editPetrolCompanyRequest[`${e.target.id}`] = e.target.value;
        else
            petrolCompaniesStore.editPetrolCompanyViewModel.addPetrolCompanyRequest[`${e.target.id}`] = e.target.value;
    }
    function resetEveryThing(){
        if(petrolCompaniesStore.editPetrolCompanyViewModel.key) {
            petrolCompaniesStore.editPetrolCompanyViewModel.editPetrolCompanyRequest = new EditPetrolCompanyRequest();
            petrolCompaniesStore.editPetrolCompanyViewModel.detailPetrolCompanyResponse = new DetailPetrolCompanyResponse();
        }
        else {
            petrolCompaniesStore.editPetrolCompanyViewModel.addPetrolCompanyRequest = new AddPetrolCompanyRequest();
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
        viewModel.detailPetrolCompanyResponse[`${propName}`] = imageUrl;
        if(petrolCompanyId)
        {
            viewModel.editPetrolCompanyRequest[`${propName}`] = imageUrl;
            viewModel.editPetrolCompanyRequest[`Is${propName}`] = true;
        }
        else{
            viewModel.addPetrolCompanyRequest[`${propName}`] = imageUrl;
        }
        viewModel.uploadLoading = false;
        return true;
    }
    const uploadButton = (
        /*<div>
        {!viewModel?.detailPetrolCompanyResponse?.petrolCompanyCommercialPhoto &&
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
                title={petrolCompanyId ? `${i18next.t("PetrolCompanies.Edit.HeaderText")} ${petrolCompanyId}` : i18next.t("PetrolCompanies.Add.HeaderText")}
            />

            <Divider>{i18next.t("PetrolCompanies.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"petrolCompanyForm"}
            /*initialValues={initialValues}*/ scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="petrolCompanyName" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyName}
                           key={"petrolCompanyName"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="petrolCompanyCommercialNumber" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyCommercialNumber}
                           key={"petrolCompanyCommercialNumber"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyCommercialNumber")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyCommercialNumber.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="petrolCompanyType" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyType}
                           key={"petrolCompanyType"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyType")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyType.Required")
                               }
                           ]}>
                    {/*<Input onChange={onChanged}/>*/}
                    <Select showSearch={true} onChange={(e) => onSelectChanged(e, "petrolCompanyType")} >
                        {petrolCompanyTypeOptions}
                    </Select>

                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="petrolCompanyCountry" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyCountry}
                           key={"petrolCompanyCountry"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyCountry")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyCountry.Required")
                               }
                           ]}*/>
                    {/*<Input onChange={onChanged}/>*/}
                    <Select showSearch={true} onChange={(e) => onSelectChanged(e, "petrolCompanyCountry")} >
                        {countryOptions}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="petrolCompanyRegion" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyRegion}
                           key={"petrolCompanyRegion"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyRegion")}
                           >
                    <Select showSearch={true} onChange={(e) => onSelectChanged(e, "petrolCompanyRegion")} >
                        {regionOptions}
                    </Select>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="petrolCompanyAddress" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyAddress}
                           key={"petrolCompanyAddress"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyAddress")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAddress.Required")
                               }
                           ]}*/>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="petrolCompanyAdminName" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyAdminName}
                           key={"petrolCompanyAdminName"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyAdminName")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAdminName.Required")
                               }
                           ]}*/>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="petrolCompanyAdminPosition" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyAdminPosition}
                           key={"petrolCompanyAdminPosition"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyAdminPosition")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAdminPosition.Required")
                               }
                           ]}*/>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="petrolCompanyAdminPhone" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyAdminPhone}
                           key={"petrolCompanyAdminPhone"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyAdminPhone")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAdminPhone.Required")
                               }
                           ]}*/>
                    {/*<Input onChange={onChanged}/>*/}
                    <MaskedInput className={"phone-number"} mask="+2 111 111 11111" onChange={onMaskChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="petrolCompanyAdminEmail" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyAdminEmail}
                           key={"petrolCompanyAdminEmail"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyAdminEmail")}
                           rules={[
                               {
                                   type:"email",
                                   message: i18next.t("General.Email.Valid")
                               },
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAdminEmail.Required")
                               }
                           ]}>
                    <Input type={"email"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    {/*<Col span={8}>
                <Form.Item name="petrolCompanyBalnce" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyBalnce}
                           key={"petrolCompanyBalnce"}
                           label={i18next.t("PetrolCompanies.Label.petrolCompanyBalnce")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyBalnce.Required")
                               }
                           ]}
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>*/}
                    <Divider>{i18next.t("PetrolCompanies.Section.LoginInformation")}</Divider>
                    <Col span={8}>
                        <Form.Item name="petrolCompanyAdminUserName" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyAdminUserName}
                                   key={"petrolCompanyAdminUserName"}
                                   label={i18next.t("PetrolCompanies.Label.petrolCompanyAdminUserName")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAdminUserName.Required")
                                       },
                                       {
                                           pattern: /^\S*$/,
                                           message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAdminUserName.Valid"),
                                       }
                                   ]}>
                            <Input onChange={onChanged}  autoComplete={"new-username"}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="petrolCompanyAdminUserPassword" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyAdminUserPassword}
                                   key={"petrolCompanyAdminUserPassword"}
                                   label={i18next.t("PetrolCompanies.Label.petrolCompanyAdminUserPassword")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAdminUserPassword.Required")
                                       },
                                       {
                                           pattern: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g,
                                           message: i18next.t("PetrolCompanies.Validation.Message.petrolCompanyAdminUserPassword.Valid"),
                                       }
                                   ]}>
                            <PasswordInput inputProps={{autoComplete: "new-password"}}
                                onChange={onChanged}></PasswordInput>
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("PetrolCompanies.Label.petrolCompanyCommercialPhoto")}</Divider>
                    <Col offset={8} span={8}>
                        <Form.Item name="petrolCompanyCommercialPhoto" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyCommercialPhoto}
                                   key={"petrolCompanyCommercialPhoto"}>
                            <Upload
                                key={"petrolCompanyCommercialPhoto"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "petrolCompanyCommercialPhoto")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailPetrolCompanyResponse?.petrolCompanyCommercialPhoto ? (
                                    <div>
                                        <Image src={viewModel?.detailPetrolCompanyResponse?.petrolCompanyCommercialPhoto}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="petrolCompanyCommercialPhoto"
                                               style={{width: '100%', height: '150px'}}/>
                                        <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                    </div>
                                ) : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("PetrolCompanies.Section.TaxAndVat")}</Divider>
                    <Col span={8}>
                        <Form.Item name="petrolCompanyVatNumber" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyVatNumber}
                                   key={"petrolCompanyVatNumber"}
                                   label={i18next.t("PetrolCompanies.Label.petrolCompanyVatNumber")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="petrolCompanyVatPhoto" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyVatPhoto}
                                   key={"petrolCompanyVatPhoto"}
                                   label={i18next.t("PetrolCompanies.Label.petrolCompanyVatPhoto")}>
                            <Upload
                                key={"petrolCompanyVatPhoto"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "petrolCompanyVatPhoto")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailPetrolCompanyResponse?.petrolCompanyVatPhoto ? (
                                    <div>
                                        <Image src={viewModel?.detailPetrolCompanyResponse?.petrolCompanyVatPhoto}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="petrolCompanyVatPhoto"
                                               style={{width: '100%', height: '150px'}}/>
                                        <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                    </div>
                                ) : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="petrolCompanyTaxNumber" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyTaxNumber}
                                   key={"petrolCompanyTaxNumber"}
                                   label={i18next.t("PetrolCompanies.Label.petrolCompanyTaxNumber")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="petrolCompanyTaxPhoto" initialValue={viewModel?.detailPetrolCompanyResponse?.petrolCompanyTaxPhoto}
                                   key={"petrolCompanyTaxPhoto"}
                                   label={i18next.t("PetrolCompanies.Label.petrolCompanyTaxPhoto")}>
                            <Upload
                                key={"petrolCompanyTaxPhoto"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "petrolCompanyTaxPhoto")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailPetrolCompanyResponse?.petrolCompanyTaxPhoto ? (
                                    <div>
                                        <Image src={viewModel?.detailPetrolCompanyResponse?.petrolCompanyTaxPhoto}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="petrolCompanyTaxPhoto"
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

export default EditPetrolCompany;
