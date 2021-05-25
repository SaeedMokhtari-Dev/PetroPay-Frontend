import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CompaniesStore from "entities/companies/stores/CompaniesStore";
import {useParams} from "react-router-dom";
import {Button, Col, Divider, Form, Input, message, Modal, PageHeader, Radio, Row, Spin, Upload, Select} from "antd";
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

    Types.forEach(w =>{ w.title = i18next.t(w.title) });
    const companyTypeOptions = [...Types];

    Countries.forEach(w =>{ w.title = i18next.t(w.title) });
    const countryOptions = [...Countries];

    Regions.forEach(w =>{ w.title = i18next.t(w.title) });
    const regionOptions = [...Regions];


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
            if(companyId){
                viewModel.editCompanyRequest.companyCommercialPhoto = imageUrl;
                setImageUrl(imageUrl);
                viewModel.editCompanyRequest.IsCompanyCommercialPhotoChanged = true;
            }
            else {
                setImageUrl(imageUrl);
                viewModel.addCompanyRequest.companyCommercialPhoto = imageUrl;
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
                    <Select options={companyTypeOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "companyType")} />
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
                    <Select options={countryOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "companyCountry")} />
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyRegion" initialValue={viewModel?.detailCompanyResponse?.companyRegion}
                           key={"companyRegion"}
                           label={i18next.t("Companies.Label.companyRegion")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyRegion.Required")
                               }
                           ]}*/>
                    {/*<Input onChange={onChanged}/>*/}
                    <Select options={regionOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "companyRegion")} />
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
                    <MaskedInput mask="+2 111 111 11111" onChange={onMaskChanged}/>
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
                            <Input onChange={onChanged}/>
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
                                       }
                                   ]}>
                            <PasswordInput
                                onChange={onChanged}></PasswordInput>
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Companies.Label.companyCommercialPhoto")}</Divider>
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

export default EditCompany;
