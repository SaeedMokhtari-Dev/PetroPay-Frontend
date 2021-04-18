import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CompaniesStore from "companies/stores/CompaniesStore";
import {useParams} from "react-router-dom";
import {Button, Col, Divider, Form, Input, message, Modal, PageHeader, Radio, Row, Spin, Upload} from "antd";
import i18next from "i18next";
import EditCompanyRequest from "../../handlers/edit/EditCompanyRequest";
import DetailCompanyResponse from "../../handlers/detail/DetailCompanyResponse";
import AddCompanyRequest from "../../handlers/add/AddCompanyRequest";
import {
    PlusOutlined
} from '@ant-design/icons';
const {useEffect} = React;

interface EditCompanyProps {
    companiesStore?: CompaniesStore;
}

const EditCompany: React.FC<EditCompanyProps> = inject(Stores.companiesStore)(observer(({companiesStore}) =>
{


    let { companyId } = useParams();

    let viewModel = companiesStore.editCompanyViewModel;

    if(!viewModel) return;


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

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    function onLoad()
    {
        debugger;
        companiesStore.onCompanyEditPageLoad();

        /*debugger;
        if(match.params?.companyId)
        {
            await companiesStore.editCompanyViewModel.getDetailCompany(+match.params.companyId);
        }
        else{
            companiesStore.editCompanyViewModel.addCompanyRequest = new AddCompanyRequest();
        }*/
    }



    function onUnload() {
        companiesStore.onCompanyEditPageUnload();
    }
    function onChanged(e){
        debugger;
        if(companyId)
            companiesStore.editCompanyViewModel.editCompanyRequest[`${e.target.id}`] = e.target.value;
        else
            companiesStore.editCompanyViewModel.addCompanyRequest[`${e.target.id}`] = e.target.value;
    }
    function resetEveryThing(){
        debugger;
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
        debugger;
        viewModel.uploadLoading = true;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false;
        }
        getBase64(file, imageUrl => {
            viewModel.uploadLoading = false;
            viewModel.addCompanyRequest.companyCommercialPhoto = imageUrl;
        });
        return true;
    }
    const uploadButton = (
        <div>
            {viewModel.uploadLoading ? <Spin /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={companyId ? `Edit Company with Id: ${companyId}` : "New Company"}
                subTitle="This is a subtitle"
            />

            <Divider>General Information</Divider>
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"companyForm"}
            /*initialValues={initialValues}*/ scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="companyAdminName"
                           key={"companyAdminName"}
                           label={i18next.t("Companies.Label.companyAdminName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.CompanyName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyCommercialNumber"
                           key={"companyCommercialNumber"}
                           label={i18next.t("Companies.Label.companyCommercialNumber")}
                           /*rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyCommercialNumber.Required")
                               }
                           ]}*/>
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
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminUserName"
                           key={"companyAdminUserName"}
                           label={i18next.t("Companies.Label.companyAdminUserName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminUserName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminUserPassword"
                           key={"companyAdminUserPassword"}
                           label={i18next.t("Companies.Label.companyAdminUserPassword")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminUserPassword.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyCountry"
                           key={"companyCountry"}
                           label={i18next.t("Companies.Label.companyCountry")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyCountry.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyRegion"
                           key={"companyRegion"}
                           label={i18next.t("Companies.Label.companyRegion")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyRegion.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyRegion"
                           key={"companyRegion"}
                           label={i18next.t("Companies.Label.companyAddress")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAddress.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminName"
                           key={"companyAdminName"}
                           label={i18next.t("Companies.Label.companyAdminName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminPosition"
                           key={"companyAdminPosition"}
                           label={i18next.t("Companies.Label.companyAdminPosition")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminPosition.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminPhone"
                           key={"companyAdminPhone"}
                           label={i18next.t("Companies.Label.companyAdminPhone")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminPhone.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyAdminEmail"
                           key={"companyAdminEmail"}
                           label={i18next.t("Companies.Label.companyAdminEmail")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyAdminEmail.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyBalnce"
                           key={"companyBalnce"}
                           label={i18next.t("Companies.Label.companyBalnce")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Companies.Validation.Message.companyBalnce.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Divider>Upload File</Divider>
                    <Col span={8}>
                        <Form.Item name="companyCommercialPhoto" key={"companyCommercialPhoto"} valuePropName="fileList"
                                   label={i18next.t("Companies.Label.companyCommercialPhoto")}
                            /*rules={[
                                {
                                    required: true,
                                    message: i18next.t("Companies.Validation.Message.companyCommercialNumber.Required")
                                }
                            ]}*/>
                            <Upload
                                key={"uploader"}
                                listType="picture-card"
                                className="avatar-uploader"

                                beforeUpload={beforeUpload}
                            >
                                {viewModel?.addCompanyRequest?.companyCommercialPhoto ?
                                    <img src={viewModel?.addCompanyRequest?.companyCommercialPhoto} alt="logo"
                                         style={{width: '100%'}}/> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                {viewModel.errorMessage && (
                    <div className='response-error-msg'>{viewModel.errorMessage}</div>
                )}
                    <PageHeader
                        ghost={false}
                        title="Company"
                        subTitle="This is a subtitle"
                        extra={[
                            <Button type="primary" loading={viewModel.isProcessing} key="submit" htmlType="submit">
                                {i18next.t("Authentication.Button.Login")}
                            </Button>
                        ]}
                    />

            </Form>

        </div>
    )
}));

export default EditCompany;
