import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {useParams} from "react-router-dom";
import {Button, Col, Divider, Form, Input, InputNumber, message, Modal, PageHeader, Radio, Row, Switch} from "antd";
import i18next from "i18next";
import EditStationUserRequest from "../../handlers/edit/EditStationUserRequest";
import DetailStationUserResponse from "../../handlers/detail/DetailStationUserResponse";
import AddStationUserRequest from "../../handlers/add/AddStationUserRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import StationUserStore from "../../stores/StationUserStore";
const {useEffect} = React;

interface EditStationUserProps {
    stationUserStore?: StationUserStore;
    match?: any;
}

const EditStationUser: React.FC<EditStationUserProps> = inject(Stores.stationUserStore)(observer(({stationUserStore, match}) =>
{


    let { stationUserId } = useParams();

    let viewModel = stationUserStore.editStationUserViewModel;

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

        if(stationUserId)
        {
            await viewModel.editStationUser(viewModel.editStationUserRequest);
        }
        else
        {
            await viewModel.addStationUser(viewModel.addStationUserRequest);
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
        stationUserStore.onStationUserEditPageLoad();

        if(match.params?.stationUserId)
        {
            await stationUserStore.editStationUserViewModel.getDetailStationUser(+match.params.stationUserId);
        }
        else{
            stationUserStore.editStationUserViewModel.addStationUserRequest = new AddStationUserRequest();
            stationUserStore.editStationUserViewModel.detailStationUserResponse = new DetailStationUserResponse();
        }
    }



    function onUnload() {
        stationUserStore.onStationUserEditPageUnload();
    }
    function onChanged(e){
        if(stationUserId)
            stationUserStore.editStationUserViewModel.editStationUserRequest[`${e.target.id}`] = e.target.value;
        else
            stationUserStore.editStationUserViewModel.addStationUserRequest[`${e.target.id}`] = e.target.value;
    }
    /*function onSwitchChange(e){
        if(stationUserId)
            stationUserStore.editStationUserViewModel.editStationUserRequest.companyStationUserActiva = e;
        else
            stationUserStore.editStationUserViewModel.addStationUserRequest.companyStationUserActiva = e;
    }*/

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={stationUserId ? `${i18next.t("StationUsers.Edit.HeaderText")} ${stationUserId}` : i18next.t("StationUsers.Add.HeaderText")}
            />

            <Divider>General Information</Divider>
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"stationUserForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="stationWorkerFname" initialValue={viewModel?.detailStationUserResponse?.stationWorkerFname}
                           key={"stationWorkerFname"}
                           label={i18next.t("StationUsers.Label.stationWorkerFname")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("StationUsers.Validation.Message.stationWorkerFname.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="stationWorkerPhone" initialValue={viewModel?.detailStationUserResponse?.stationWorkerPhone}
                           key={"stationWorkerPhone"}
                           label={i18next.t("StationUsers.Label.stationWorkerPhone")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("StationUsers.Validation.Message.stationWorkerPhone.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="stationUserName" initialValue={viewModel?.detailStationUserResponse?.stationUserName}
                           key={"stationUserName"}
                           label={i18next.t("StationUsers.Label.stationUserName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("StationUsers.Validation.Message.stationUserName.Required")
                               },
                               {
                                   pattern: /^\S*$/,
                                   message: i18next.t("StationUsers.Validation.Message.stationUserName.Valid"),
                               }]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="stationUserPassword" initialValue={viewModel?.detailStationUserResponse?.stationUserPassword}
                                   key={"stationUserPassword"}
                                   label={i18next.t("StationUsers.Label.stationUserPassword")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("StationUsers.Validation.Message.stationUserPassword.Required")
                                       }
                                   ]}>
                            <Input.Password
                                onChange={onChanged}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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

export default EditStationUser;
