import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    PageHeader,
    Radio,
    Row,
    Spin, Switch,
    Upload
} from "antd";
import i18next from "i18next";
import DetailPromotionCouponResponse from "../../handlers/detail/DetailPromotionCouponResponse";
import AddPromotionCouponRequest from "../../handlers/add/AddPromotionCouponRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import PromotionCouponStore from "../../stores/PromotionCouponStore";
import moment from "moment";
import Constants from "../../../../app/constants/Constants";
const {useEffect} = React;

interface EditPromotionCouponProps {
    promotionCouponStore?: PromotionCouponStore;
    match?: any;
}

const EditPromotionCoupon: React.FC<EditPromotionCouponProps> = inject(Stores.promotionCouponStore)(observer(({promotionCouponStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [promotionCouponId, setPromotionCouponId] = React.useState(0);

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
        promotionCouponStore.onPromotionCouponEditPageLoad();
        let promotionCouponIdParam = +match.params?.promotionCouponId;

        if(promotionCouponIdParam)
        {
            await promotionCouponStore.editPromotionCouponViewModel.getDetailPromotionCoupon(promotionCouponIdParam);
        }
        else{
            promotionCouponStore.editPromotionCouponViewModel.addPromotionCouponRequest = new AddPromotionCouponRequest();
            promotionCouponStore.editPromotionCouponViewModel.detailPromotionCouponResponse = new DetailPromotionCouponResponse();
        }
        setPromotionCouponId(promotionCouponIdParam);
        setDataFetched(true);
    }

    let viewModel = promotionCouponStore.editPromotionCouponViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(promotionCouponId)
        {
            await viewModel.editPromotionCoupon(viewModel.editPromotionCouponRequest);
        }
        else
        {
            await viewModel.addPromotionCoupon(viewModel.addPromotionCouponRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        promotionCouponStore.onPromotionCouponEditPageUnload();
        setDataFetched(false);
        setPromotionCouponId(0);
    }
    function onChanged(e){
        if(promotionCouponId)
            viewModel.editPromotionCouponRequest[`${e.target.id}`] = e.target.value;
        else
            viewModel.addPromotionCouponRequest[`${e.target.id}`] = e.target.value;
    }

    function onDateChange(date, dateString, prop) {
        if(promotionCouponId)
            viewModel.editPromotionCouponRequest[`${prop}`] = dateString;
        else
            viewModel.addPromotionCouponRequest[`${prop}`] = dateString;
    }

    function onSwitchChange(e, propName){

        if(promotionCouponId) {
            viewModel.editPromotionCouponRequest[`${propName}`] = e;
            viewModel.detailPromotionCouponResponse[`${propName}`] = e;
        }
        else {
            viewModel.addPromotionCouponRequest[`${propName}`] = e;
            viewModel.detailPromotionCouponResponse[`${propName}`] = e;
        }
    }
    function onCouponDiscountValueChanged(e){

        if(promotionCouponId) {
            viewModel.editPromotionCouponRequest.couponDiscountValue = e;
        }
        else {
            viewModel.addPromotionCouponRequest.couponDiscountValue = e;
        }
    }
    function disabledDate(current) {
        // Can not select days before today and today

        return current && current < moment().endOf('day');
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={promotionCouponId ? `${i18next.t("PromotionCoupons.Edit.HeaderText")} ${promotionCouponId}` : i18next.t("PromotionCoupons.Add.HeaderText")}
            />

            <Divider>{i18next.t("PromotionCoupons.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"promotionCouponForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="couponCode" initialValue={viewModel?.detailPromotionCouponResponse?.couponCode}
                           key={"couponCode"}
                           label={i18next.t("PromotionCoupons.Label.couponCode")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PromotionCoupons.Validation.Message.couponCode.Required")
                               }
                           ]}>
                    <Input onChange={onChanged} maxLength={10}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="couponDiscountValue" initialValue={viewModel?.detailPromotionCouponResponse?.couponDiscountValue}
                           key={"couponDiscountValue"}
                           label={i18next.t("PromotionCoupons.Label.couponDiscountValue")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PromotionCoupons.Validation.Message.couponDiscountValue.Required")
                               }
                           ]}>
                    <InputNumber min={1} max={100} style={{width: "100%"}} onChange={onCouponDiscountValueChanged} />
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="couponActiveDate" initialValue={viewModel?.detailPromotionCouponResponse?.couponActiveDate ? moment(viewModel.detailPromotionCouponResponse.couponActiveDate, Constants.dateFormat) : "" }
                           key={"couponActiveDate"}
                           label={i18next.t("PromotionCoupons.Label.couponActiveDate")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PromotionCoupons.Validation.Message.couponActiveDate.Required")
                               }
                           ]}
                           >
                    {/*<Input type={"number"} onChange={onChanged}/>*/}
                    <DatePicker disabledDate={disabledDate} format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "couponActiveDate"))} />
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="couponEndDate" initialValue={viewModel?.detailPromotionCouponResponse?.couponEndDate ? moment(viewModel.detailPromotionCouponResponse.couponEndDate, Constants.dateFormat) : ""}
                           key={"couponEndDate"}
                           label={i18next.t("PromotionCoupons.Label.couponEndDate")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("PromotionCoupons.Validation.Message.couponEndDate.Required")
                               }
                           ]}
                           >
                    {/*<Input type={"number"} onChange={onChanged}/>*/}
                    <DatePicker disabledDate={disabledDate} format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "couponEndDate"))} />
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="couponActive"
                           key={"couponActive"}
                           label={i18next.t("PromotionCoupons.Label.couponActive")}
                           >
                    {/*<Input type={"number"} onChange={onChanged}/>*/}
                    <Switch onChange={(e) => onSwitchChange(e, 'couponActive')} defaultChecked={viewModel?.detailPromotionCouponResponse?.couponActive} />
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

export default EditPromotionCoupon;
