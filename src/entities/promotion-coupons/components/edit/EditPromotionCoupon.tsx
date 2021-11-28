import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {
    Button, Checkbox,
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
    Row, Select,
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
import UserContext from "../../../../identity/contexts/UserContext";
const {useEffect} = React;
const { Option } = Select;

interface EditPromotionCouponProps {
    promotionCouponStore?: PromotionCouponStore;
    match?: any;
}

const EditPromotionCoupon: React.FC<EditPromotionCouponProps> = inject(Stores.promotionCouponStore)(observer(({promotionCouponStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [promotionCouponId, setPromotionCouponId] = React.useState(0);
    const [companyOptions, setCompanyOptions] = React.useState([]);
    const [couponForAllCustomer, setCouponForAllCustomer] = React.useState(false);

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
            setCouponForAllCustomer(promotionCouponStore.editPromotionCouponViewModel.editPromotionCouponRequest.couponForAllCustomer);
        }
        else{
            promotionCouponStore.editPromotionCouponViewModel.addPromotionCouponRequest = new AddPromotionCouponRequest();
            promotionCouponStore.editPromotionCouponViewModel.detailPromotionCouponResponse = new DetailPromotionCouponResponse();
        }

        await promotionCouponStore.listCompanyViewModel.getCompanyList();
        let companyOptions = [];
        if (promotionCouponStore.listCompanyViewModel) {
            for (let item of promotionCouponStore.listCompanyViewModel.listCompanyResponse.items) {
                companyOptions.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
        }
        setCompanyOptions(companyOptions);


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

    function onCheckboxChange(e){
        if(promotionCouponId)
            viewModel.editPromotionCouponRequest[`${e.target.id}`] = e.target.checked;
        else
            viewModel.addPromotionCouponRequest[`${e.target.id}`] = e.target.checked;

        if(e.target.id === "couponForAllCustomer"){
            setCouponForAllCustomer(e.target.checked)
        }
    }
    function onSelectChanged(e, propName){
        if(promotionCouponId)
            viewModel.editPromotionCouponRequest[`${propName}`] = e;
        else
            viewModel.addPromotionCouponRequest[`${propName}`] = e;
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
                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "couponActiveDate"))} />
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
                    <DatePicker format={Constants.dateFormat} onChange={((date, dateString) => onDateChange(date, dateString, "couponEndDate"))} />
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
                    <Divider>{i18next.t("PromotionCoupons.Section.Limitations")}</Divider>
                    <Col span={8}>
                        <Form.Item name="couponForAllCustomer" initialValue={viewModel?.detailPromotionCouponResponse?.couponForAllCustomer}
                                   key={"couponForAllCustomer"}
                                   label={i18next.t("PromotionCoupons.Label.couponForAllCustomer")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailPromotionCouponResponse?.couponForAllCustomer} />
                        </Form.Item>
                    </Col>
                    {!couponForAllCustomer ?
                        <Col span={8}>
                            <Form.Item name="companyId" initialValue={viewModel?.detailPromotionCouponResponse?.companyId}
                                       key={"companyId"}
                                       label={i18next.t("PromotionCoupons.Label.companyName")}>
                                {/*<Input onChange={onChanged}/>*/}
                                <Select style={{width: "100%", display:"block"}} allowClear={true}
                                        showSearch={true} onChange={(e) => onSelectChanged(e, "companyId")}>
                                    {companyOptions}
                                </Select>
                            </Form.Item>
                        </Col>: ""}
                    <Col span={8}>
                        <Form.Item name="couponForMonthly" initialValue={viewModel?.detailPromotionCouponResponse?.couponForMonthly}
                                   key={"couponForMonthly"}
                                   label={i18next.t("PromotionCoupons.Label.couponForMonthly")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailPromotionCouponResponse?.couponForMonthly} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="couponForQuarterly" initialValue={viewModel?.detailPromotionCouponResponse?.couponForQuarterly}
                                   key={"couponForQuarterly"}
                                   label={i18next.t("PromotionCoupons.Label.couponForQuarterly")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailPromotionCouponResponse?.couponForQuarterly} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="couponForYearly" initialValue={viewModel?.detailPromotionCouponResponse?.couponForYearly}
                                   key={"couponForYearly"}
                                   label={i18next.t("PromotionCoupons.Label.couponForYearly")}>
                            <Checkbox onChange={onCheckboxChange} defaultChecked={viewModel?.detailPromotionCouponResponse?.couponForYearly} />
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
