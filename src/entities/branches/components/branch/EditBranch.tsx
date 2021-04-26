import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import BranchStore from "entities/branches/stores/BranchStore";
import {useParams} from "react-router-dom";
import {Button, Col, Divider, Form, Input, InputNumber, message, Modal, PageHeader, Radio, Row, Switch} from "antd";
import i18next from "i18next";
import EditBranchRequest from "../../handlers/edit/EditBranchRequest";
import DetailBranchResponse from "../../handlers/detail/DetailBranchResponse";
import AddBranchRequest from "../../handlers/add/AddBranchRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import { PasswordInput } from 'antd-password-input-strength';
const {useEffect} = React;

interface EditBranchProps {
    branchStore?: BranchStore;
    match?: any;
}

const EditBranch: React.FC<EditBranchProps> = inject(Stores.branchStore)(observer(({branchStore, match}) =>
{


    let { branchId } = useParams();

    let viewModel = branchStore.editBranchViewModel;

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

    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {
        branchStore.onBranchEditPageLoad();

        if(match.params?.branchId)
        {
            await branchStore.editBranchViewModel.getDetailBranch(+match.params.branchId);
        }
        else{
            branchStore.editBranchViewModel.addBranchRequest = new AddBranchRequest();
            branchStore.editBranchViewModel.detailBranchResponse = new DetailBranchResponse();
        }
    }



    function onUnload() {
        branchStore.onBranchEditPageUnload();
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

            <Divider>General Information</Divider>
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
                <Form.Item name="companyBranchActiva" initialValue={viewModel?.detailBranchResponse?.companyBranchActiva}
                           key={"companyBranchActiva"}
                           label={i18next.t("Branches.Label.companyBranchActiva")}
                           >
                    <Switch onChange={onSwitchChange} defaultChecked={viewModel?.detailBranchResponse?.companyBranchActiva} />
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="companyBranchBalnce" initialValue={viewModel?.detailBranchResponse?.companyBranchBalnce}
                           key={"companyBranchBalnce"}
                           label={i18next.t("Branches.Label.companyBranchBalnce")}>
                    <Input type={"number"} onChange={onChanged}/>
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
                    <Input onChange={onChanged}/>
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

        </div>
    )
}));

export default EditBranch;
