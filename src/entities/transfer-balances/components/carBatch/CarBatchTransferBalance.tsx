import React, {useContext, useRef, useState} from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import {
    Button,
    Col,
    DatePicker,
    Transfer,
    Divider,
    Form,
    Input,
    PageHeader,
    Row,
    Select,
    Skeleton,
    Spin,
    Table,
    InputNumber,
    FormInstance,
    Popconfirm,
    Statistic
} from "antd";
import i18next from "i18next";
import history from "../../../../app/utils/History";
import "./CarBatchTransferBalance.scss";
import difference from 'lodash/difference';
import TransferBalanceStore from "../../stores/TransferBalanceStore";
import CarBatchTransferBalanceColumns from "./CarBatchTransferBalanceColumns";
import UserContext from "../../../../identity/contexts/UserContext";
import CarBatchTransferBalanceRightColumns from "./CarBatchTransferBalanceRightColumns";
import CarBatchTransferBalanceRequest from "../../handlers/carBatch/CarBatchTransferBalanceRequest";
const {useEffect} = React;

const { Option } = Select;


interface EditTransferBalanceProps {
    transferBalanceStore?: TransferBalanceStore;
    match?: any;
}
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    carId: number;
    amount: number;
    carNumber: string;
    carBalance: number;
    consumptionValue: number;
    newBalance: number;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    amount: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                       amount,
                                                       editable,
                                                       children,
                                                       dataIndex,
                                                       record,
                                                       handleSave,
                                                       ...restProps
                                                   }) => {
    const inputRef = useRef<Input>(null);
    const form = useContext(EditableContext)!;
    const validateAmount = (rule: any, value: any, callback: any) => {
        if(value <= 0){
            callback(i18next.t("TransferBalances.Validation.Message.amount.Negative"));
        }
        else if (!value || value === 0){
            callback(i18next.t("TransferBalances.Validation.Message.amount.Required"));
        }
        else {
            callback();
        }
    };
    const save = async () => {
        try {
            const values = await form.validateFields();

            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode =
            <Form.Item
                initialValue={record.amount}
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        validator: validateAmount
                    },
                ]}
            >
                <Input type={"number"} ref={inputRef} onBlur={save} />
            </Form.Item>
    }

    return <td {...restProps}>{childNode}</td>;
};

const CarBatchTransferBalance: React.FC<EditTransferBalanceProps> = inject(Stores.transferBalanceStore)(observer(({transferBalanceStore, match}) =>
{

    const [dataFetched, setDataFetched] = React.useState(false);
    const [branchDataFetched, setBranchDataFetched] = React.useState(false);
    const [transferBalanceCarIds, setTransferBalanceCarIds] = React.useState([]);
    const [branchOptions, setBranchOptions] = React.useState([]);
    const [totalAmount, setTotalAmount] = React.useState(0);


    const [form] = Form.useForm();

    CarBatchTransferBalanceColumns.forEach(w => {
        w.title = i18next.t(w.title);
    });
    CarBatchTransferBalanceRightColumns.forEach(w => {
        w.title = i18next.t(w.title);
    });

    let leftColumns: any[] = [...CarBatchTransferBalanceColumns];
    let rightColumns: any[] = [...CarBatchTransferBalanceRightColumns];

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
        transferBalanceStore.onCarBatchTransferBalancePageLoad();
        transferBalanceStore.carBatchTransferBalanceViewModel.carBatchTransferBalanceRequest = new CarBatchTransferBalanceRequest();
        if(UserContext.info.role === 5) {
            await transferBalanceStore.detailBranchViewModel.getDetailBranch(UserContext.info.id);
            await transferBalanceStore.listCarViewModel.getCarList(null, UserContext.info.id);
            transferBalanceStore.carBatchTransferBalanceViewModel.carBatchTransferBalanceRequest.branchId = UserContext.info.id;
            setDataFetched(true);
        }
        if(UserContext.info.role === 1){
            await transferBalanceStore.listBranchViewModel.getBranchList(UserContext.info.id);
            let branches = [];
            for (let item of transferBalanceStore.listBranchViewModel?.listBranchResponse?.items) {
                branches.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setBranchOptions(branches);
            setBranchDataFetched(true);
        }


    }

    let viewModel = transferBalanceStore.carBatchTransferBalanceViewModel;

    if(!viewModel) return;

    async function onFinish() {
        
        await viewModel.carBatchTransferBalance(viewModel.carBatchTransferBalanceRequest);
        if(!viewModel.errorMessage)
            history.goBack();
    };
    function onUnload() {
        transferBalanceStore.onCarBatchTransferBalancePageUnload();
    }
    const columns = rightColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                amount: i18next.t("TransferBalances.Label.amount"),
                handleSave: handleSave,
            }),
        };
    });
    function handleSave(row){
        
        const amount: number = +row.amount;
        if(amount <= 0) {
            return;
        }
        let newCarAmount = viewModel.carBatchTransferBalanceRequest.carAmounts.find(w => w.carId === +row.key);
        newCarAmount.amount = amount;
        let car = transferBalanceStore.listCarViewModel.listCarResponse.items.find(w => w.key === +row.key);
        car.amount = amount;
        car.newBalance = car.balance + amount;
        const totalAmount = viewModel.carBatchTransferBalanceRequest.carAmounts.map(w => w.amount).reduce((a,b) => a + b);
        setTotalAmount(totalAmount);
        if(transferBalanceStore.detailBranchViewModel.detailBranchResponse.companyBranchBalnce < totalAmount)
            viewModel.errorMessage = i18next.t("Api.NotEnoughBalance");
    }

    const TableTransfer = ({ ...restProps }) => (
        <Transfer {...restProps} showSelectAll={false}>
            {({
                  direction,
                  filteredItems,
                  onItemSelectAll,
                  onItemSelect,
                  selectedKeys: listSelectedKeys,
                  disabled: listDisabled,
              }) => {

                const rowSelection = {
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
                const components = {
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    }
                };

                return (
                    <div>
                    {direction === 'left' ?
                    <Table
                        rowSelection={rowSelection}
                        columns={leftColumns}
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
                        :
                        <Table
                            columns={columns}
                            dataSource={filteredItems}
                            size="small"
                            components={components}
                            rowClassName={() => 'editable-row'}
                            summary={() => (
                                <Table.Summary.Row style={{backgroundColor: "yellow"}}>
                                    <Table.Summary.Cell index={0}>{i18next.t("General.Table.Total")}</Table.Summary.Cell>
                                    <Table.Summary.Cell colSpan={3} index={1}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>{totalAmount}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={6}></Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                            style={{ pointerEvents: listDisabled ? 'none' : null }}
                            rowSelection={rowSelection}
                            onRow={({ key, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) return;
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                },
                            })}
                        /> }
                    </div>
                );
            }}
        </Transfer>
    );
    function onChange(nextTargetKeys) {
        viewModel.errorMessage = "";
        
        setTransferBalanceCarIds(nextTargetKeys);

        let currentKeys = viewModel.carBatchTransferBalanceRequest.carAmounts.map(w => w.carId);
        let diff = difference(nextTargetKeys, currentKeys);
        for (const diffKey in diff) {
            viewModel.carBatchTransferBalanceRequest.carAmounts.push({
                carId: +diff[+diffKey],
                amount: 0
            })
        }

    }
    async function onBranchSelectChanged(e){
        if(window.confirm(i18next.t("TransferBalances.Alert.branchSelect"))) {
            viewModel.carBatchTransferBalanceRequest.branchId = e;
            await transferBalanceStore.detailBranchViewModel.getDetailBranch(e);
            await transferBalanceStore.listCarViewModel.getCarList(null, e);
            setDataFetched(true);
        }
    }
    function autoRecharge() {
        transferBalanceCarIds.forEach(w => {
            
            let car = transferBalanceStore.listCarViewModel.listCarResponse.items.find(e => e.key === w);
            let amount = car.consumptionValue - car.balance;
            if(amount <= 0){
                car.amount = 0;
                return;
            }
            car.amount = amount;
            handleSave(car);
        });

    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("TransferBalances.CarBatch.Edit.HeaderText")}
            />
            <Divider>{i18next.t("TransferBalances.Section.GeneralInformation")}</Divider>
            {branchDataFetched && !viewModel.carBatchTransferBalanceRequest.branchId ?
                <Col span={8}>
                    <Form.Item name="branchId" initialValue={viewModel?.carBatchTransferBalanceRequest?.branchId}
                               key={"branchId"}
                               label={i18next.t("TransferBalances.Label.branchName")}
                               rules={[
                                   {
                                       required: true,
                                       message: i18next.t("TransferBalances.Validation.Message.branchId.Required")
                                   }
                               ]}>
                        <Select
                            style={{ width: "100%" }}
                            onChange={onBranchSelectChanged}
                        >
                            {branchOptions}
                        </Select>
                    </Form.Item>
                </Col>
                : ""
            }
            {dataFetched && viewModel.carBatchTransferBalanceRequest.branchId ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"transferBalanceForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col offset={2} span={3}>
                         <Statistic title={i18next.t("TransferBalances.Label.branchName")} value={transferBalanceStore.detailBranchViewModel.detailBranchResponse.companyBranchName} />
                    </Col>
                    <Col offset={2} span={3}>
                         <Statistic title={i18next.t("TransferBalances.Label.branchBalance")} value={transferBalanceStore.detailBranchViewModel.detailBranchResponse.companyBranchBalnce} />
                    </Col>
                    <Col offset={7} span={4}>
                        <Button type={"primary"} onClick={autoRecharge} disabled={transferBalanceCarIds.length === 0}>{i18next.t("TransferBalances.Button.autoRecharge")}</Button>
                    </Col>
                    <Col span={24}>
                        <TableTransfer
                            dataSource={transferBalanceStore.listCarViewModel?.listCarResponse?.items}
                            targetKeys={transferBalanceCarIds}
                            titles={[i18next.t("TransferBalances.CarBatch.Source.Title"), i18next.t("TransferBalances.CarBatch.Target.Title")]}
                            showSearch={true}
                            onChange={onChange}
                            filterOption={(inputValue, item) =>
                                item.carNumber.indexOf(inputValue) !== -1 || item.branchName.indexOf(inputValue) !== -1
                            }
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
                ""
                /*<div>
                    <Row gutter={[24, 16]}>
                        <Col offset={11} span={8}>
                            <Spin className={"spine"} size="large" />
                        </Col>
                    </Row>
                </div>*/
                }
        </div>
    )
}));

export default CarBatchTransferBalance;
