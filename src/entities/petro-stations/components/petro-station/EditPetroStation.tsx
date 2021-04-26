import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {useParams} from "react-router-dom";
import {Button, Col, Divider, Form, Input, InputNumber, message, Modal, PageHeader, Radio, Row, Switch} from "antd";
import i18next from "i18next";
import EditPetroStationRequest from "../../handlers/edit/EditPetroStationRequest";
import DetailPetroStationResponse from "../../handlers/detail/DetailPetroStationResponse";
import AddPetroStationRequest from "../../handlers/add/AddPetroStationRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import PetroStationStore from "../../stores/PetroStationStore";
import { PasswordInput } from 'antd-password-input-strength';
const {useEffect} = React;

interface EditPetroStationProps {
    petroStationStore?: PetroStationStore;
    match?: any;
}

const EditPetroStation: React.FC<EditPetroStationProps> = inject(Stores.petroStationStore)(observer(({petroStationStore, match}) =>
{


    let { petroStationId } = useParams();

    let viewModel = petroStationStore.editPetroStationViewModel;

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

        if(petroStationId)
        {
            await viewModel.editPetroStation(viewModel.editPetroStationRequest);
        }
        else
        {
            await viewModel.addPetroStation(viewModel.addPetroStationRequest);
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
        petroStationStore.onPetroStationEditPageLoad();

        if(match.params?.petroStationId)
        {
            await petroStationStore.editPetroStationViewModel.getDetailPetroStation(+match.params.petroStationId);
        }
        else{
            petroStationStore.editPetroStationViewModel.addPetroStationRequest = new AddPetroStationRequest();
            petroStationStore.editPetroStationViewModel.detailPetroStationResponse = new DetailPetroStationResponse();
        }
    }



    function onUnload() {
        petroStationStore.onPetroStationEditPageUnload();
    }
    function onChanged(e){
        if(petroStationId)
            petroStationStore.editPetroStationViewModel.editPetroStationRequest[`${e.target.id}`] = e.target.value;
        else
            petroStationStore.editPetroStationViewModel.addPetroStationRequest[`${e.target.id}`] = e.target.value;
    }
    function onSwitchChange(e){
        if(petroStationId)
            petroStationStore.editPetroStationViewModel.editPetroStationRequest.stationDiesel = e;
        else
            petroStationStore.editPetroStationViewModel.addPetroStationRequest.stationDiesel = e;
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={petroStationId ? `${i18next.t("PetroStations.Edit.HeaderText")} ${petroStationId}` : i18next.t("PetroStations.Add.HeaderText")}
            />

            <Divider>General Information</Divider>
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"petroStationForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="stationName" initialValue={viewModel?.detailPetroStationResponse?.stationName}
                           key={"stationName"}
                           label={i18next.t("PetroStations.Label.stationName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetroStations.Validation.Message.stationName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="stationAddress" initialValue={viewModel?.detailPetroStationResponse?.stationAddress}
                           key={"stationAddress"}
                           label={i18next.t("PetroStations.Label.stationAddress")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PetroStations.Validation.Message.stationAddress.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="stationLucationName" initialValue={viewModel?.detailPetroStationResponse?.stationLucationName}
                                   key={"stationLucationName"}
                                   label={i18next.t("PetroStations.Label.stationLucationName")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="stationOwnerName" initialValue={viewModel?.detailPetroStationResponse?.stationOwnerName}
                           key={"stationOwnerName"}
                           label={i18next.t("PetroStations.Label.stationOwnerName")}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="stationPhone" initialValue={viewModel?.detailPetroStationResponse?.stationPhone}
                           key={"stationPhone"}
                           label={i18next.t("PetroStations.Label.stationPhone")}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="stationBanckAccount" initialValue={viewModel?.detailPetroStationResponse?.stationBanckAccount}
                           key={"stationBanckAccount"}
                           label={i18next.t("PetroStations.Label.stationBanckAccount")}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="stationLatitude" initialValue={viewModel?.detailPetroStationResponse?.stationLatitude}
                           key={"stationLatitude"}
                           label={i18next.t("PetroStations.Label.stationLatitude")}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="stationLongitude" initialValue={viewModel?.detailPetroStationResponse?.stationLongitude}
                           key={"stationLongitude"}
                           label={i18next.t("PetroStations.Label.stationLongitude")}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="stationNameAr" initialValue={viewModel?.detailPetroStationResponse?.stationNameAr}
                           key={"stationNameAr"}
                           label={i18next.t("PetroStations.Label.stationNameAr")}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="stationDiesel" initialValue={viewModel?.detailPetroStationResponse?.stationDiesel}
                                   key={"stationDiesel"}
                                   label={i18next.t("PetroStations.Label.stationDiesel")}
                        >
                            <Switch onChange={onSwitchChange} defaultChecked={viewModel?.detailPetroStationResponse?.stationDiesel} />
                        </Form.Item>
                    </Col>
                <Col span={8}>
                    <Form.Item name="stationBalance" initialValue={viewModel?.detailPetroStationResponse?.stationBalance}
                               key={"stationBalance"}
                               label={i18next.t("PetroStations.Label.stationBalance")}>
                        <Input type={"number"} onChange={onChanged}/>
                    </Form.Item>
                </Col>

                    <Col span={8}>
                        <Form.Item name="stationEmail" initialValue={viewModel?.detailPetroStationResponse?.stationEmail}
                                   key={"stationEmail"}
                                   label={i18next.t("PetroStations.Label.stationEmail")}
                                   rules={[
                                       {
                                           type:"email",
                                           message: i18next.t("General.Email.Valid")
                                       },
                                       {
                                           required: true,
                                           message: i18next.t("PetroStations.Validation.Message.stationEmail.Required")
                                       }
                                   ]}>
                            <Input type={"email"} onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Companies.Section.LoginInformation")}</Divider>
                    <Col span={8}>
                        <Form.Item name="stationUserName" initialValue={viewModel?.detailPetroStationResponse?.stationUserName}
                                   key={"stationUserName"}
                                   label={i18next.t("PetroStations.Label.stationUserName")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("PetroStations.Validation.Message.stationUserName.Required")
                                       },
                                       {
                                           pattern: /^\S*$/,
                                           message: i18next.t("PetroStations.Validation.Message.stationUserName.Valid"),
                                       }]}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="stationPassword" initialValue={viewModel?.detailPetroStationResponse?.stationPassword}
                                   key={"stationPassword"}
                                   label={i18next.t("PetroStations.Label.stationPassword")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("PetroStations.Validation.Message.stationPassword.Required")
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

export default EditPetroStation;
