import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import BundlesStore from "entities/bundles/stores/BundlesStore";
import {useParams} from "react-router-dom";
import {Button, Col, Divider, Form, Input, InputNumber, message, Modal, PageHeader, Radio, Row, Spin, Upload} from "antd";
import i18next from "i18next";
import EditBundleRequest from "../../handlers/edit/EditBundleRequest";
import DetailBundleResponse from "../../handlers/detail/DetailBundleResponse";
import AddBundleRequest from "../../handlers/add/AddBundleRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
const {useEffect} = React;

interface EditBundleProps {
    bundlesStore?: BundlesStore;
    match?: any;
}

const EditBundle: React.FC<EditBundleProps> = inject(Stores.bundlesStore)(observer(({bundlesStore, match}) =>
{


    let { bundleId } = useParams();

    let viewModel = bundlesStore.editBundleViewModel;

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

        if(bundleId)
        {
            await viewModel.editBundle(viewModel.editBundleRequest);
        }
        else
        {
            await viewModel.addBundle(viewModel.addBundleRequest);
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
        bundlesStore.onBundleEditPageLoad();

        if(match.params?.bundleId)
        {
            await bundlesStore.editBundleViewModel.getDetailBundle(+match.params.bundleId);
        }
        else{
            bundlesStore.editBundleViewModel.addBundleRequest = new AddBundleRequest();
            bundlesStore.editBundleViewModel.detailBundleResponse = new DetailBundleResponse();
        }
    }



    function onUnload() {
        bundlesStore.onBundleEditPageUnload();
    }
    function onChanged(e){
        if(bundleId)
            bundlesStore.editBundleViewModel.editBundleRequest[`${e.target.id}`] = e.target.value;
        else
            bundlesStore.editBundleViewModel.addBundleRequest[`${e.target.id}`] = e.target.value;
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={bundleId ? `${i18next.t("Bundles.Edit.HeaderText")} ${bundleId}` : i18next.t("Bundles.Add.HeaderText")}
            />

            <Divider>General Information</Divider>
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"bundleForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="bundlesNumberFrom" initialValue={viewModel?.detailBundleResponse?.bundlesNumberFrom}
                           key={"bundlesNumberFrom"}
                           label={i18next.t("Bundles.Label.bundlesNumberFrom")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Bundles.Validation.Message.bundlesNumberFrom.Required")
                               }
                           ]}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="bundlesNumberTo" initialValue={viewModel?.detailBundleResponse?.bundlesNumberTo}
                           key={"bundlesNumberTo"}
                           label={i18next.t("Bundles.Label.bundlesNumberTo")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Bundles.Validation.Message.bundlesNumberTo.Required")
                               }
                           ]}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="bundlesFeesYearly" initialValue={viewModel?.detailBundleResponse?.bundlesFeesYearly}
                           key={"bundlesFeesYearly"}
                           label={i18next.t("Bundles.Label.bundlesFeesYearly")}
                           >
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="bundlesFeesMonthly" initialValue={viewModel?.detailBundleResponse?.bundlesFeesMonthly}
                           key={"bundlesFeesMonthly"}
                           label={i18next.t("Bundles.Label.bundlesFeesMonthly")}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="bundlesNfcCost" initialValue={viewModel?.detailBundleResponse?.bundlesNfcCost}
                           key={"bundlesNfcCost"}
                           label={i18next.t("Bundles.Label.bundlesNfcCost")}>
                    <Input type={"number"} onChange={onChanged}/>
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

export default EditBundle;
