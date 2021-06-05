import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {
    Button, Col,
    DatePicker,
    Transfer,
    Divider, Form, Input, PageHeader, Row, Select, Skeleton, Spin, Table
} from "antd";
import i18next from "i18next";
import history from "../../../../app/utils/History";
import SubscriptionStore from "../../stores/SubscriptionStore";
import "./CarAddSubscription.scss";
import difference from 'lodash/difference';
import SubscriptionColumns from "../list/SubscriptionColumns";
import {
    CarOutlined,
    CheckCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined
} from "@ant-design/icons";
import UserContext from "../../../../identity/contexts/UserContext";
import CarAddSubscriptionColumns from "./CarAddSubscriptionColumns";
import AddSubscriptionRequest from "../../handlers/add/AddSubscriptionRequest";
import AddCarRequest from "../../../cars/handlers/add/AddCarRequest";
import CarAddSubscriptionRequest from "../../handlers/carAdd/CarAddSubscriptionRequest";
const {useEffect} = React;


interface EditSubscriptionProps {
    subscriptionStore?: SubscriptionStore;
    match?: any;
}

const CarAddSubscription: React.FC<EditSubscriptionProps> = inject(Stores.subscriptionStore)(observer(({subscriptionStore, match}) =>
{

    const [dataFetched, setDataFetched] = React.useState(false);
    const [subscriptionId, setSubscriptionId] = React.useState(0);
    const [subscriptionCarIds, setSubscriptionCarIds] = React.useState([]);
    const [disabledSubscriptionCarIds, setDisabledSubscriptionCarIds] = React.useState([]);

    const [form] = Form.useForm();

    CarAddSubscriptionColumns.forEach(w => {
        w.title = i18next.t(w.title);
    });


    let columns: any[] = [...CarAddSubscriptionColumns];

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

        subscriptionStore.onCarAddSubscriptionPageLoad();
        let subscriptionIdParam = +match.params?.subscriptionId;

        if(subscriptionIdParam)
        {
            await subscriptionStore.editSubscriptionViewModel.getDetailSubscription(subscriptionIdParam);
            await subscriptionStore.listCarViewModel.getCarList(subscriptionStore.editSubscriptionViewModel.detailSubscriptionResponse.companyId);
        }
        else{
            history.goBack();
        }
        
        subscriptionStore.editSubscriptionViewModel.carAddSubscriptionRequest = new CarAddSubscriptionRequest();
        subscriptionStore.editSubscriptionViewModel.carAddSubscriptionRequest.subscriptionId = subscriptionIdParam;

        setSubscriptionCarIds(subscriptionStore?.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionCars?.map(w => w.key));
        let disabledList = subscriptionStore?.editSubscriptionViewModel?.detailSubscriptionResponse?.subscriptionCars?.filter(w => w.disabled).map(w => w.key);
        for (let item of subscriptionStore.listCarViewModel.listCarResponse.items) {
            let aa = disabledList.find(w => w == item.key);
            if(aa){
                item.disabled = true;
            }
        }
        setSubscriptionId(subscriptionIdParam);
        setDataFetched(true);
    }

    let viewModel = subscriptionStore.editSubscriptionViewModel;

    if(!viewModel) return;

    async function onFinish(values: any) {
        
        await viewModel.addCarSubscription(viewModel.carAddSubscriptionRequest);
        if(!viewModel.errorMessage)
            history.goBack();
    };
    function onUnload() {
        subscriptionStore.onCarAddSubscriptionPageUnload();
    }
    const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
        <Transfer {...restProps} showSelectAll={false}>
            {({
                  direction,
                  filteredItems,
                  onItemSelectAll,
                  onItemSelect,
                  selectedKeys: listSelectedKeys,
                  disabled: listDisabled,
              }) => {
                
                const columns = direction === 'left' ? leftColumns : rightColumns;

                const rowSelection = {
                    getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                    onSelectAll(selected, selectedRows) {
                        const treeSelectedKeys = selectedRows
                            .filter(item => !item.disabled)
                            .map(({ key }) => key);
                        const diffKeys = selected
                            ? difference(treeSelectedKeys, listSelectedKeys)
                            : difference(listSelectedKeys, treeSelectedKeys);
                        onItemSelectAll(diffKeys, selected);
                    },
                    onSelect({ key }, selected) {
                        onItemSelect(key, selected);
                    },
                    selectedRowKeys: listSelectedKeys,
                };

                return (
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={filteredItems}
                        size="small"
                        style={{ pointerEvents: listDisabled ? 'none' : null }}
                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) return;
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                    />
                );
            }}
        </Transfer>
    );
    function onChange(nextTargetKeys) {
        viewModel.errorMessage = "";
        
        if(viewModel.detailSubscriptionResponse.subscriptionCarNumbers < nextTargetKeys.length) {
            viewModel.errorMessage = i18next.t("Subscriptions.Validation.Message.cannotAdd.MoreCar");
            return;
        }
        setSubscriptionCarIds(nextTargetKeys);
        viewModel.carAddSubscriptionRequest.SubscriptionCarIds = nextTargetKeys;
    };
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={subscriptionId ? `${i18next.t("Subscriptions.CarAdd.Edit.HeaderText")}` : ""}
            />
            <Divider>{i18next.t("Subscriptions.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"subscriptionForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={24}>
                        <TableTransfer
                            dataSource={subscriptionStore.listCarViewModel?.listCarResponse?.items}
                            targetKeys={subscriptionCarIds}
                            titles={[i18next.t("Subscriptions.CarAdd.Source.Title"), i18next.t("Subscriptions.CarAdd.Target.Title")]}
                            showSearch={true}
                            onChange={onChange}
                            filterOption={(inputValue, item) =>
                                item.carNumber.indexOf(inputValue) !== -1 || item.branchName.indexOf(inputValue) !== -1
                            }
                            leftColumns={columns}
                            rightColumns={columns}
                        />
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
