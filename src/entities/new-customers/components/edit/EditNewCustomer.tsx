import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    PageHeader,
    Radio,
    Row,
    Spin,
    Switch,
    Upload
} from "antd";
import i18next from "i18next";
import DetailNewCustomerResponse from "../../handlers/detail/DetailNewCustomerResponse";
import AddNewCustomerRequest from "../../handlers/add/AddNewCustomerRequest";
import history from "../../../../app/utils/History";
import NewCustomerStore from "../../stores/NewCustomerStore";
import MaskedInput from "antd-mask-input";
const {useEffect} = React;

interface EditNewCustomerProps {
    newCustomerStore?: NewCustomerStore;
    match?: any;
}

const EditNewCustomer: React.FC<EditNewCustomerProps> = inject(Stores.newCustomerStore)(observer(({newCustomerStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [newCustomerId, setNewCustomerId] = React.useState(0);

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
        newCustomerStore.onNewCustomerEditPageLoad();
        let newCustomerIdParam = +match.params?.newCustomerId;

        if(newCustomerIdParam)
        {
            await newCustomerStore.editNewCustomerViewModel.getDetailNewCustomer(newCustomerIdParam);
        }
        else{
            newCustomerStore.editNewCustomerViewModel.addNewCustomerRequest = new AddNewCustomerRequest();
            newCustomerStore.editNewCustomerViewModel.detailNewCustomerResponse = new DetailNewCustomerResponse();
        }
        setNewCustomerId(newCustomerIdParam);
        setDataFetched(true);
    }

    let viewModel = newCustomerStore.editNewCustomerViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(newCustomerId)
        {
            await viewModel.editNewCustomer(viewModel.editNewCustomerRequest);
        }
        else
        {
            await viewModel.addNewCustomer(viewModel.addNewCustomerRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        newCustomerStore.onNewCustomerEditPageUnload();
        setDataFetched(false);
        setNewCustomerId(0);
    }
    function onChanged(e){
        if(newCustomerId)
            viewModel.editNewCustomerRequest[`${e.target.id}`] = e.target.value;
        else
            viewModel.addNewCustomerRequest[`${e.target.id}`] = e.target.value;
    }

    function onMaskChanged(e) {
        if(newCustomerId)
            viewModel.editNewCustomerRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
        else
            viewModel.addNewCustomerRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
    }
    function onSwitchChange(e, propName){

        if(newCustomerId) {
            viewModel.editNewCustomerRequest[`${propName}`] = e;
            viewModel.detailNewCustomerResponse[`${propName}`] = e;
        }
        else {
            viewModel.addNewCustomerRequest[`${propName}`] = e;
            viewModel.detailNewCustomerResponse[`${propName}`] = e;
        }
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newCustomerId ? `${i18next.t("NewCustomers.Edit.HeaderText")} ${newCustomerId}` : i18next.t("NewCustomers.Add.HeaderText")}
            />

            <Divider>{i18next.t("NewCustomers.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"newCustomerForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="custName" initialValue={viewModel?.detailNewCustomerResponse?.custName}
                           key={"custName"}
                           label={i18next.t("NewCustomers.Label.custName")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("NewCustomers.Validation.Message.custName.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="custCompany" initialValue={viewModel?.detailNewCustomerResponse?.custCompany}
                           key={"custCompany"}
                           label={i18next.t("NewCustomers.Label.custCompany")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("NewCustomers.Validation.Message.custCompany.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="custEmail" initialValue={viewModel?.detailNewCustomerResponse?.custEmail}
                           key={"custEmail"}
                           label={i18next.t("NewCustomers.Label.custEmail")}
                           >
                    <Input type={"email"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="custPhoneNumber" initialValue={viewModel?.detailNewCustomerResponse?.custPhoneNumber}
                                   key={"custPhoneNumber"}
                                   label={i18next.t("Cars.Label.custPhoneNumber")}>
                            {/*<Input onChange={onChanged}/>*/}
                            <MaskedInput className={"phone-number"} mask="+2 111 111 11111" onChange={onMaskChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="custAddress" initialValue={viewModel?.detailNewCustomerResponse?.custAddress}
                           key={"custAddress"}
                           label={i18next.t("NewCustomers.Label.custAddress")}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="custReqStatus" initialValue={viewModel?.detailNewCustomerResponse?.custReqStatus}
                           key={"custReqStatus"}
                           label={i18next.t("NewCustomers.Label.custReqStatus")}>
                    <Switch defaultChecked={viewModel?.detailNewCustomerResponse?.custReqStatus} onChange={(e) => onSwitchChange(e, 'isActive')} />
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

export default EditNewCustomer;
