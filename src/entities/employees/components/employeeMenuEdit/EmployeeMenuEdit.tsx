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
    Modal,
    PageHeader,
    Radio,
    Row,
    Select,
    Spin, Switch, Tree,
    TreeSelect
} from "antd";
import i18next from "i18next";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import EmployeeStore from "../../stores/EmployeeStore";
import NavigationService from "../../../../app/services/NavigationService";
const {useEffect} = React;
const {Option} = Select;
const { SHOW_PARENT } = TreeSelect;

interface EditEmployeeMenuProps {
    employeeStore?: EmployeeStore;
    match?: any;
}

const EmployeeMenuEdit: React.FC<EditEmployeeMenuProps> = inject(Stores.employeeStore)(observer(({employeeStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [employeeId, setEmployeeId] = React.useState(0);
    const [treeOptions, setTreeOptions] = React.useState([]);
    const [treeValues, setTreeValues] = React.useState([]);
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
        employeeStore.onEmployeeMenuEditPageLoad();
        let employeeIdParam = +match.params?.employeeId;
        if(employeeIdParam)
        {
            await employeeStore.treeMenuViewModel.getMenuTree();
            await employeeStore.editEmployeeMenuViewModel.getDetailEmployeeMenu(employeeIdParam);
        }
        else{
            NavigationService.goBack();
        }
        debugger;
        let treeData = [];
        for (let item of employeeStore.treeMenuViewModel.treeMenuResponse) {
            let data = {
                title: localStorage.getItem("currentLanguage") === 'en' ? item.enTitle : item.arTitle,
                value: item.key,
                key: item.key,
                children: item?.items?.map(w => {
                    return {
                        title: localStorage.getItem("currentLanguage") === 'en' ?  w.enTitle: w.arTitle,
                        value: w.key,
                        key: w.key
                    };
                })
            };
            treeData.push(data);
        }
        setTreeOptions(treeData);
        setEmployeeId(employeeIdParam);
        setDataFetched(true);
    }

    let viewModel = employeeStore.editEmployeeMenuViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {
        viewModel.errorMessage = "";
        if(viewModel.addEmployeeMenuRequest?.menuIds?.length === 0)
            viewModel.errorMessage = i18next.t("EmployeeMenus.menuIds.required");
        else
            await viewModel.addEmployeeMenu(viewModel.addEmployeeMenuRequest);
        if(!viewModel.errorMessage)
            history.goBack();
    };
    function onChange(value) {
        debugger;
        console.log('onChange ', value);
        viewModel.detailEmployeeMenuResponse.menuIds = value;
        viewModel.addEmployeeMenuRequest.menuIds = value;
    };

    function onUnload() {
        employeeStore.onEmployeeMenuEditPageUnLoad();
        setDataFetched(false);
        setEmployeeId(0);
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={i18next.t("EmployeeMenus.Edit.HeaderText")}
            />

            <Divider>{i18next.t("EmployeeMenus.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"EmployeeMenuFrom"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={16}>
                        <Tree
                            checkable
                            autoExpandParent={true}
                            onCheck={onChange}
                            treeData={treeOptions}
                            defaultCheckedKeys={viewModel.detailEmployeeMenuResponse?.menuIds}
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
                <Row gutter={[24, 16]}>
                    <Col offset={11} span={8}>
                        <Spin className={"spine"} size="large" />
                    </Col>
                </Row>
            }
        </div>
    )
}));

export default EmployeeMenuEdit;
