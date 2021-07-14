import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {Button, Col, Divider, Form, Input, InputNumber, message, PageHeader, Radio, Row, Spin, Upload} from "antd";
import i18next from "i18next";
import DetailNewCustomerResponse from "../../handlers/detail/DetailNewCustomerResponse";
import AddNewCustomerRequest from "../../handlers/add/AddNewCustomerRequest";
import history from "../../../../app/utils/History";
import NewCustomerStore from "../../stores/NewCustomerStore";
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
            newCustomerStore.editNewCustomerViewModel.editNewCustomerRequest[`${e.target.id}`] = e.target.value;
        else
            newCustomerStore.editNewCustomerViewModel.addNewCustomerRequest[`${e.target.id}`] = e.target.value;
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
                    {/*<Col span={8}>
                <Form.Item name="newCustomersNumberFrom" initialValue={viewModel?.detailNewCustomerResponse?.newCustomersNumberFrom}
                           key={"newCustomersNumberFrom"}
                           label={i18next.t("NewCustomers.Label.newCustomersNumberFrom")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("NewCustomers.Validation.Message.newCustomersNumberFrom.Required")
                               }
                           ]}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="newCustomersNumberTo" initialValue={viewModel?.detailNewCustomerResponse?.newCustomersNumberTo}
                           key={"newCustomersNumberTo"}
                           label={i18next.t("NewCustomers.Label.newCustomersNumberTo")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("NewCustomers.Validation.Message.newCustomersNumberTo.Required")
                               }
                           ]}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="newCustomersFeesYearly" initialValue={viewModel?.detailNewCustomerResponse?.newCustomersFeesYearly}
                           key={"newCustomersFeesYearly"}
                           label={i18next.t("NewCustomers.Label.newCustomersFeesYearly")}
                           >
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="newCustomersFeesMonthly" initialValue={viewModel?.detailNewCustomerResponse?.newCustomersFeesMonthly}
                           key={"newCustomersFeesMonthly"}
                           label={i18next.t("NewCustomers.Label.newCustomersFeesMonthly")}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="newCustomersNfcCost" initialValue={viewModel?.detailNewCustomerResponse?.newCustomersNfcCost}
                           key={"newCustomersNfcCost"}
                           label={i18next.t("NewCustomers.Label.newCustomersNfcCost")}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>*/}
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
