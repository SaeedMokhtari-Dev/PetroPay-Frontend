import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import BranchStore from "entities/branches/stores/BranchStore";
import {useParams} from "react-router-dom";
import {Button, Col, Divider, Form, Input, InputNumber, message, Modal, PageHeader, Radio, Row, Switch, Spin} from "antd";
import i18next from "i18next";
import EditBranchRequest from "../../handlers/edit/EditBranchRequest";
import DetailBranchResponse from "../../handlers/detail/DetailBranchResponse";
import AddBranchRequest from "../../handlers/add/AddBranchRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import { PasswordInput } from 'antd-password-input-strength';
import MaskedInput from "antd-mask-input";
const {useEffect} = React;

interface EditBranchProps {
    branchStore?: BranchStore;
    match?: any;
}

const EditBranch: React.FC<EditBranchProps> = inject(Stores.branchStore)(observer(({branchStore, match}) =>
{

    const [dataFetched, setDataFetched] = React.useState(false);

    const [branchId, setBranchId] = React.useState(0);

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
        branchStore.onBranchEditPageLoad();
        const branchIdParam = +match.params?.branchId;

        if(branchIdParam)
        {
            await branchStore.editBranchViewModel.getDetailBranch(branchIdParam);
        }
        else{
            branchStore.editBranchViewModel.addBranchRequest = new AddBranchRequest();
            branchStore.editBranchViewModel.detailBranchResponse = new DetailBranchResponse();
        }
        setBranchId(branchIdParam);
        setDataFetched(true);

    }

    let viewModel = branchStore.editBranchViewModel;

    if(!viewModel) return;

    async function onFinish(values: any) {

        if(branchId)
        {
            await viewModel.editBranch(viewModel.editBranchRequest);
        }
        else
        {
            await viewModel.addBranch(viewModel.addBranchRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        branchStore.onBranchEditPageUnload();
        setDataFetched(false);
        setBranchId(0);
    }
    function onMaskChanged(e) {
        if(branchId)
            branchStore.editBranchViewModel.editBranchRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
        else
            branchStore.editBranchViewModel.addBranchRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
    }
    function onChanged(e){
        if(branchId)
            branchStore.editBranchViewModel.editBranchRequest[`${e.target.id}`] = e.target.value;
        else
            branchStore.editBranchViewModel.addBranchRequest[`${e.target.id}`] = e.target.value;
    }
    function onSwitchChange(e){
        if(branchId)
            branchStore.editBranchViewModel.editBranchRequest.companyBranchActiva = e;
        else
            branchStore.editBranchViewModel.addBranchRequest.companyBranchActiva = e;
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={branchId ? `${i18next.t("Branches.Edit.HeaderText")} ${branchId}` : i18next.t("Branches.Add.HeaderText")}
            />

            <Divider>{i18next.t("Branches.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"branchForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="companyBranchName" initialValue={viewModel?.detailBranchResponse?.companyBranchName}
                           key={"companyBranchName"}
                           label={i18next.t("Branches.Label.companyBranchName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Branches.Validation.Message.companyBranchName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyBranchNumberOfcar" initialValue={viewModel?.detailBranchResponse?.companyBranchNumberOfcar}
                           key={"companyBranchNumberOfcar"}
                           label={i18next.t("Branches.Label.companyBranchNumberOfcar")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Branches.Validation.Message.companyBranchNumberOfcar.Required")
                               }
                           ]}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="companyBranchAddress" initialValue={viewModel?.detailBranchResponse?.companyBranchAddress}
                                   key={"companyBranchAddress"}
                                   label={i18next.t("Branches.Label.companyBranchAddress")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyBranchAdminName" initialValue={viewModel?.detailBranchResponse?.companyBranchAdminName}
                           key={"companyBranchAdminName"}
                           label={i18next.t("Branches.Label.companyBranchAdminName")}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyBranchAdminPhone" initialValue={viewModel?.detailBranchResponse?.companyBranchAdminPhone}
                           key={"companyBranchAdminPhone"}
                           label={i18next.t("Branches.Label.companyBranchAdminPhone")}>
                    {/*<Input onChange={onChanged}/>*/}
                    <MaskedInput className={"phone-number"} mask="+2 111 111 11111" onChange={onMaskChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyBranchAdminEmail" initialValue={viewModel?.detailBranchResponse?.companyBranchAdminEmail}
                           key={"companyBranchAdminEmail"}
                           label={i18next.t("Branches.Label.companyBranchAdminEmail")}
                           rules={[
                               {
                                   type: "email",
                                   message: i18next.t("Branches.Validation.Message.companyBranchAdminEmail.Valid")
                               }
                           ]}>
                    <Input type={"email"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Companies.Section.LoginInformation")}</Divider>

                    <Col span={8}>
                        <Form.Item name="companyBranchAdminUserName" initialValue={viewModel?.detailBranchResponse?.companyBranchAdminUserName}
                                   key={"companyBranchAdminUserName"}
                                   label={i18next.t("Branches.Label.companyBranchAdminUserName")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Branches.Validation.Message.companyBranchAdminUserName.Required")
                                       },
                                       {
                                           pattern: /^\S*$/,
                                           message: i18next.t("Branches.Validation.Message.companyBranchAdminUserName.Valid"),
                                       }]}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="companyBranchAdminUserPassword" initialValue={viewModel?.detailBranchResponse?.companyBranchAdminUserPassword}
                                   key={"companyBranchAdminUserPassword"}
                                   label={i18next.t("Branches.Label.companyBranchAdminUserPassword")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Branches.Validation.Message.companyBranchAdminUserPassword.Required")
                                       },
                                       {
                                           pattern: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g,
                                           message: i18next.t("Branches.Validation.Message.companyBranchAdminUserPassword.Valid"),
                                       }
                                   ]}>
                            <PasswordInput
                                onChange={onChanged}
                            />
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

export default EditBranch;
