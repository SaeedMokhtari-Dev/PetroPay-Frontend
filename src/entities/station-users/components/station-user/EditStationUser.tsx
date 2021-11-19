import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {useParams} from "react-router-dom";
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    PageHeader,
    Radio,
    Row,
    Spin
} from "antd";
import i18next from "i18next";
import EditStationUserRequest from "../../handlers/edit/EditStationUserRequest";
import DetailStationUserResponse from "../../handlers/detail/DetailStationUserResponse";
import AddStationUserRequest from "../../handlers/add/AddStationUserRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import StationUserStore from "../../stores/StationUserStore";
import { PasswordInput } from 'antd-password-input-strength';
import { MaskedInput } from 'antd-mask-input';
const {useEffect} = React;

interface EditStationUserProps {
    stationUserStore?: StationUserStore;
    match?: any;
}

const EditStationUser: React.FC<EditStationUserProps> = inject(Stores.stationUserStore)(observer(({stationUserStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [stationUserId, setStationUserId] = React.useState(0);




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
        stationUserStore.onStationUserEditPageLoad();
        let stationUserIdParam = +match.params?.stationUserId;

        if(stationUserIdParam)
        {
            await stationUserStore.editStationUserViewModel.getDetailStationUser(stationUserIdParam);
        }
        else{
            stationUserStore.editStationUserViewModel.addStationUserRequest = new AddStationUserRequest();
            stationUserStore.editStationUserViewModel.detailStationUserResponse = new DetailStationUserResponse();
        }
        setStationUserId(stationUserIdParam);
        setDataFetched(true);
    }
    let viewModel = stationUserStore.editStationUserViewModel;

    if(!viewModel) return;


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
    function onUnload() {
        stationUserStore.onStationUserEditPageUnload();
    }
    function onChanged(e){
        if(stationUserId)
            viewModel.editStationUserRequest[`${e.target.id}`] = e.target.value;
        else
            viewModel.addStationUserRequest[`${e.target.id}`] = e.target.value;
    }
    function onMaskChanged(e){
        if(stationUserId)
            viewModel.editStationUserRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
        else
            viewModel.addStationUserRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
    }
    function onCheckboxChange(e){
        if(stationUserId)
            viewModel.editStationUserRequest[`${e.target.id}`] = e.target.checked;
        else
            viewModel.addStationUserRequest[`${e.target.id}`] = e.target.checked;
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

            <Divider>{i18next.t("StationUsers.Section.GeneralInformation")}</Divider>
            {dataFetched ?
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
                    {/*<Input onChange={onChanged}/>*/}
                    <MaskedInput className={"phone-number"} mask="+2 111 111 11111" onChange={onMaskChanged}/>
                </Form.Item>
                    </Col>

                    <Divider>{i18next.t("StationUsers.Section.Accesses")}</Divider>

                    <Col span={8}>
                        <Form.Item name="accessStationBalance" initialValue={viewModel?.detailStationUserResponse?.accessStationBalance}
                                   key={"accessStationBalance"}
                                   label={i18next.t("StationUsers.Label.accessStationBalance")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessStationBalance} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="accessAppReport" initialValue={viewModel?.detailStationUserResponse?.accessAppReport}
                                   key={"accessAppReport"}
                                   label={i18next.t("StationUsers.Label.accessAppReport")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessAppReport} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="accessFuelingApp" initialValue={viewModel?.detailStationUserResponse?.accessFuelingApp}
                                   key={"accessFuelingApp"}
                                   label={i18next.t("StationUsers.Label.accessFuelingApp")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessFuelingApp} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="accessChangeOilApp" initialValue={viewModel?.detailStationUserResponse?.accessChangeOilApp}
                                   key={"accessChangeOilApp"}
                                   label={i18next.t("StationUsers.Label.accessChangeOilApp")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessChangeOilApp} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="accessCarWasherApp" initialValue={viewModel?.detailStationUserResponse?.accessCarWasherApp}
                                   key={"accessCarWasherApp"}
                                   label={i18next.t("StationUsers.Label.accessCarWasherApp")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessCarWasherApp} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="accessChangeTyreApp" initialValue={viewModel?.detailStationUserResponse?.accessChangeTyreApp}
                                   key={"accessChangeTyreApp"}
                                   label={i18next.t("StationUsers.Label.accessChangeTyreApp")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessChangeTyreApp} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="accessTemp1" initialValue={viewModel?.detailStationUserResponse?.accessTemp1}
                                   key={"accessTemp1"}
                                   label={i18next.t("StationUsers.Label.accessTemp1")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessTemp1} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="accessTemp2" initialValue={viewModel?.detailStationUserResponse?.accessTemp2}
                                   key={"accessTemp2"}
                                   label={i18next.t("StationUsers.Label.accessTemp2")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessTemp2} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="accessTemp3" initialValue={viewModel?.detailStationUserResponse?.accessTemp3}
                                   key={"accessTemp3"}
                                   label={i18next.t("StationUsers.Label.accessTemp3")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailStationUserResponse?.accessTemp3} />
                        </Form.Item>
                    </Col>

                    <Divider>{i18next.t("Companies.Section.LoginInformation")}</Divider>
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
                    <Input onChange={onChanged}  autoComplete={"new-username"}/>
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
                                       },
                                       {
                                           pattern: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g,
                                           message: i18next.t("StationUsers.Validation.Message.stationUserPassword.Valid"),
                                       }
                                   ]}>
                            <PasswordInput inputProps={{autoComplete: "new-password"}}
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

export default EditStationUser;
