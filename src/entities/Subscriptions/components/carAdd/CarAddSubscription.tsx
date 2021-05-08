import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {Button, Col,
    DatePicker,
    Descriptions,
    Divider, Form, Input, PageHeader, Row, Select, Skeleton, Spin} from "antd";
import i18next from "i18next";
import history from "../../../../app/utils/History";
import SubscriptionStore from "../../stores/SubscriptionStore";
import "./EditSubscription.scss";
import ListCarViewModel from "../../../cars/view-models/ListCarViewModel";
const {useEffect} = React;
const { RangePicker } = DatePicker;

interface EditSubscriptionProps {
    subscriptionStore?: SubscriptionStore;
    match?: any;
}

const CarAddSubscription: React.FC<EditSubscriptionProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore, match}) =>
{

    const [dataFetched, setDataFetched] = React.useState(false);
    const [subscriptionId, setSubscriptionId] = React.useState(0);

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
    let listCarViewModel: ListCarViewModel;
    async function onLoad()
    {
        debugger;
        subscriptionStore.onSubscriptionEditPageLoad();
        let subscriptionIdParam = +match.params?.subscriptionId;

        if(subscriptionIdParam)
        {
            await subscriptionStore.editSubscriptionViewModel.getDetailSubscription(subscriptionIdParam);
            listCarViewModel= new ListCarViewModel();
            await listCarViewModel.getCarList(subscriptionStore.editSubscriptionViewModel.detailSubscriptionResponse.companyId);
        }
        else{
            history.goBack();
        }
        setSubscriptionId(subscriptionIdParam);
        setDataFetched(true);
    }

    let viewModel = subscriptionStore.editSubscriptionViewModel;

    if(!viewModel) return;



    async function onFinish(values: any) {
        debugger;
        if(subscriptionId)
        {
            await viewModel.editSubscription(viewModel.editSubscriptionRequest);
        }
        else
        {
            await viewModel.addSubscription(viewModel.addSubscriptionRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };



    function onUnload() {
        subscriptionStore.onSubscriptionEditPageUnload();
        listCarViewModel = null;
    }
    function onSelectChanged(e, propName){

        if(subscriptionId)
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest[`${propName}`] = e;
        else
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest[`${propName}`] = e;

    }
    function onChanged(e){
        if(subscriptionId)
            subscriptionStore.editSubscriptionViewModel.editSubscriptionRequest[`${e.target.id}`] = e.target.value;
        else
            subscriptionStore.editSubscriptionViewModel.addSubscriptionRequest[`${e.target.id}`] = e.target.value;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={subscriptionId ? `${i18next.t("Subscriptions.Edit.HeaderText")} ${subscriptionId}` : i18next.t("Subscriptions.Add.HeaderText")}
            />
            <Divider>General Information</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"subscriptionForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>

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
                <div>
                    <Row gutter={[24, 16]}>
                        <Col offset={11} span={8}>
                            <Spin className={"spine"} size="large" />
                        </Col>
                    </Row>
                </div>
                }
        </div>
    )
}));

export default CarAddSubscription;
