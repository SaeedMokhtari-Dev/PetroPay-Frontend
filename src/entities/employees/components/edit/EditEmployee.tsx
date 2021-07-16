import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import EmployeeStore from "entities/employees/stores/EmployeeStore";
import {useParams} from "react-router-dom";
import {
    Button,
    Col,
    Divider,
    Form,
    Image,
    Input,
    InputNumber,
    message,
    Modal,
    PageHeader,
    Radio,
    Row, Select,
    Spin,
    Upload
} from "antd";
import i18next from "i18next";
import EditEmployeeRequest from "../../handlers/edit/EditEmployeeRequest";
import DetailEmployeeResponse from "../../handlers/detail/DetailEmployeeResponse";
import AddEmployeeRequest from "../../handlers/add/AddEmployeeRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import MaskedInput from "antd-mask-input";
import {PasswordInput} from "antd-password-input-strength";
import ImageConstants from "../../../../app/constants/ImageConstants";
import CarTypes from "../../../../app/constants/CarTypes";
import Status from "../../../../app/constants/Status";
const {useEffect} = React;

interface EditEmployeeProps {
    employeeStore?: EmployeeStore;
    match?: any;
}

const EditEmployee: React.FC<EditEmployeeProps> = inject(Stores.employeeStore)(observer(({employeeStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [employeeId, setEmployeeId] = React.useState(0);

    Status.forEach(w =>{ w.title = i18next.t(w.title) });
    const statusOptions = [...Status];

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
        employeeStore.onEmployeeEditPageLoad();
        let employeeIdParam = +match.params?.employeeId;

        if(employeeIdParam)
        {
            await employeeStore.editEmployeeViewModel.getDetailEmployee(employeeIdParam);
        }
        else{
            employeeStore.editEmployeeViewModel.addEmployeeRequest = new AddEmployeeRequest();
            employeeStore.editEmployeeViewModel.detailEmployeeResponse = new DetailEmployeeResponse();
        }
        setEmployeeId(employeeIdParam);
        setDataFetched(true);
    }

    let viewModel = employeeStore.editEmployeeViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(employeeId)
        {
            await viewModel.editEmployee(viewModel.editEmployeeRequest);
        }
        else
        {
            await viewModel.addEmployee(viewModel.addEmployeeRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        employeeStore.onEmployeeEditPageUnload();
        setDataFetched(false);
        setEmployeeId(0);
    }

    function onMaskChanged(e) {
        if(employeeId)
            viewModel.editEmployeeRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
        else
            viewModel.addEmployeeRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
    }
    function onChanged(e){
        if(employeeId)
            viewModel.editEmployeeRequest[`${e.target.id}`] = e.target.value;
        else
            viewModel.addEmployeeRequest[`${e.target.id}`] = e.target.value;
    }
    function onSelectChanged(e, propName){

        if(employeeId)
            viewModel.editEmployeeRequest[`${propName}`] = e;
        else
            viewModel.addEmployeeRequest[`${propName}`] = e;
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
        viewModel.detailEmployeeResponse[`${propName}`] = imageUrl;
        if(employeeId)
        {
            viewModel.editEmployeeRequest[`${propName}`] = imageUrl;
        }
        else{
            viewModel.addEmployeeRequest[`${propName}`] = imageUrl;
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
                title={employeeId ? `${i18next.t("Employees.Edit.HeaderText")} ${employeeId}` : i18next.t("Employees.Add.HeaderText")}
            />

            <Divider>{i18next.t("Employees.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"employeeForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="emplyeeName" initialValue={viewModel?.detailEmployeeResponse?.emplyeeName}
                           key={"emplyeeName"}
                           label={i18next.t("Employees.Label.emplyeeName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Employees.Validation.Message.emplyeeName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="emplyeePhone" initialValue={viewModel?.detailEmployeeResponse?.emplyeePhone}
                           key={"emplyeePhone"}
                           label={i18next.t("Employees.Label.emplyeePhone")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Employees.Validation.Message.emplyeePhone.Required")
                               }
                           ]}>
                    <MaskedInput className={"phone-number"} mask="+2 111 111 11111" onChange={onMaskChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="emplyeeEmail" initialValue={viewModel?.detailEmployeeResponse?.emplyeeEmail}
                           key={"emplyeeEmail"}
                           label={i18next.t("Employees.Label.emplyeeEmail")}
                           >
                    <Input type={"email"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="emplyeeCode" initialValue={viewModel?.detailEmployeeResponse?.emplyeeCode}
                           key={"emplyeeCode"}
                           label={i18next.t("Employees.Label.emplyeeCode")}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="emplyeeStatus" initialValue={viewModel?.detailEmployeeResponse?.emplyeeStatus}
                                   key={"emplyeeStatus"}
                                   label={i18next.t("Employees.Label.emplyeeStatus")}>
                            <Select options={statusOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "emplyeeStatus")} />
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Employees.Section.LoginInformation")}</Divider>
                    <Col span={8}>
                        <Form.Item name="emplyeeUserName" initialValue={viewModel?.detailEmployeeResponse?.emplyeeUserName}
                                   key={"emplyeeUserName"}
                                   label={i18next.t("Employees.Label.emplyeeUserName")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Employees.Validation.Message.emplyeeUserName.Required")
                                       },
                                       {
                                           pattern: /^\S*$/,
                                           message: i18next.t("Employees.Validation.Message.emplyeeUserName.Valid"),
                                       }]}>
                            <Input onChange={onChanged} autoComplete={"new-username"}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="emplyeePassword" initialValue={viewModel?.detailEmployeeResponse?.emplyeePassword}
                                   key={"emplyeePassword"}
                                   label={i18next.t("Employees.Label.emplyeePassword")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Employees.Validation.Message.emplyeePassword.Required")
                                       },
                                       {
                                           pattern: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g,
                                           message: i18next.t("Employees.Validation.Message.emplyeePassword.Valid"),
                                       }
                                   ]}>
                            <PasswordInput inputProps={{autoComplete: "new-password"}}
                                           onChange={onChanged}
                            />
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Employees.Label.emplyeePhoto")}</Divider>
                    <Col span={8}>
                        <Form.Item name="emplyeePhoto" initialValue={viewModel?.detailEmployeeResponse?.emplyeePhoto}
                                   key={"emplyeePhoto"}
                                   label={i18next.t("Employees.Label.emplyeePhoto")}>
                            <Upload
                                key={"emplyeePhoto"}
                                className={"avatar-uploader"}
                                maxCount={1}
                                beforeUpload={async (file) => {await beforeUpload(file, "emplyeePhoto")}}
                                customRequest={customRequest}
                                showUploadList={false}
                            >
                                {viewModel?.detailEmployeeResponse?.emplyeePhoto ? (
                                    <div>
                                        <Image src={viewModel?.detailEmployeeResponse?.emplyeePhoto}
                                               fallback={ImageConstants.fallbackImage}
                                               alt="emplyeePhoto"
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

export default EditEmployee;
