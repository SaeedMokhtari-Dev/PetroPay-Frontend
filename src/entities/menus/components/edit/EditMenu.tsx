import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import MenuStore from "entities/menus/stores/MenuStore";
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
    Spin, Switch,
    Upload
} from "antd";
import i18next from "i18next";
import DetailMenuResponse from "../../handlers/detail/DetailMenuResponse";
import AddMenuRequest from "../../handlers/add/AddMenuRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
const {useEffect} = React;
const {Option} = Select;

interface EditMenuProps {
    menuStore?: MenuStore;
    match?: any;
}

const EditMenu: React.FC<EditMenuProps> = inject(Stores.menuStore)(observer(({menuStore, match}) =>
{
    const [dataFetched, setDataFetched] = React.useState(false);
    const [menuId, setMenuId] = React.useState(0);
    const [menuOptions, setMenuOptions] = React.useState([]);
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
        menuStore.onMenuEditPageLoad();
        let menuIdParam = +match.params?.menuId;

        await menuStore.listMenuViewModel.getMenuList();
        if(menuIdParam)
        {
            await menuStore.editMenuViewModel.getDetailMenu(menuIdParam);
        }
        else{
            menuStore.editMenuViewModel.addMenuRequest = new AddMenuRequest();
            menuStore.editMenuViewModel.detailMenuResponse = new DetailMenuResponse();
        }

        let menuOptions = [];
        menuOptions.push(<Option key='0' value={null}>{i18next.t("General.List.NullSelect")}</Option>);
        for (let item of menuStore.listMenuViewModel.listMenuResponse.items) {
            if(localStorage.getItem("currentLanguage") === 'en')
                menuOptions.push(<Option key={item.key} value={item.key}>{item.enTitle}</Option>);
            else
                menuOptions.push(<Option key={item.key} value={item.key}>{item.arTitle}</Option>);
        }
        setMenuOptions(menuOptions);

        setMenuId(menuIdParam);
        setDataFetched(true);
    }

    let viewModel = menuStore.editMenuViewModel;

    if(!viewModel) return;


    async function onFinish(values: any) {

        if(menuId)
        {
            await viewModel.editMenu(viewModel.editMenuRequest);
        }
        else
        {
            await viewModel.addMenu(viewModel.addMenuRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        menuStore.onMenuEditPageUnload();
        setDataFetched(false);
        setMenuId(0);
    }
    function onChanged(e){
        if(menuId)
            viewModel.editMenuRequest[`${e.target.id}`] = e.target.value;
        else
            viewModel.addMenuRequest[`${e.target.id}`] = e.target.value;
    }
    function onNumberChanged(e){
        if(menuId)
            viewModel.editMenuRequest.displayOrder = e;
        else
            viewModel.addMenuRequest.displayOrder = e;
    }

    function onSwitchChange(e, propName){

        if(menuId) {
            viewModel.editMenuRequest[`${propName}`] = e;
            viewModel.detailMenuResponse[`${propName}`] = e;
        }
        else {
            viewModel.addMenuRequest[`${propName}`] = e;
            viewModel.detailMenuResponse[`${propName}`] = e;
        }
    }

    function onSelectChanged(e, propName){

        if(menuId)
            viewModel.editMenuRequest[`${propName}`] = e;
        else
            viewModel.addMenuRequest[`${propName}`] = e;
    }
    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={menuId ? `${i18next.t("Menus.Edit.HeaderText")} ${menuId}` : i18next.t("Menus.Add.HeaderText")}
            />

            <Divider>{i18next.t("Menus.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"menuForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="enTitle" initialValue={viewModel?.detailMenuResponse?.enTitle}
                           key={"enTitle"}
                           label={i18next.t("Menus.Label.enTitle")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Menus.Validation.Message.enTitle.Required")
                               }
                           ]}>
                    <Input onChange={onChanged} style={{direction: "ltr"}}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="arTitle" initialValue={viewModel?.detailMenuResponse?.arTitle}
                           key={"arTitle"}
                           label={i18next.t("Menus.Label.arTitle")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Menus.Validation.Message.arTitle.Required")
                               }
                           ]}>
                    <Input onChange={onChanged} style={{direction: "rtl"}}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="urlRoute" initialValue={viewModel?.detailMenuResponse?.urlRoute}
                                   key={"urlRoute"}
                                   label={i18next.t("Menus.Label.urlRoute")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Menus.Validation.Message.urlRoute.Required")
                                       }
                                   ]}>
                            <Input onChange={onChanged} style={{direction: "ltr"}}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="parentId" initialValue={viewModel?.detailMenuResponse?.parentId}
                                   key={"parentId"}
                                   label={i18next.t("Menus.Label.parentId")}>
                            <Select style={{width: "100%", display:"block"}} defaultValue={viewModel?.detailMenuResponse?.parentId}
                                    key={"parentId"}
                                    showSearch={true} onChange={(e) => onSelectChanged(e, "parentId")}>
                                {menuOptions}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="displayOrder" initialValue={viewModel?.detailMenuResponse?.displayOrder}
                                   key={"displayOrder"}
                                   label={i18next.t("Menus.Label.displayOrder")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Menus.Validation.Message.displayOrder.Required")
                                       }
                                   ]}>
                            <InputNumber onChange={onNumberChanged} style={{width: "100%"}}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="isActive" initialValue={viewModel?.detailMenuResponse?.isActive}
                                   key={"isActive"}
                                   label={i18next.t("Menus.Label.isActive")}>
                            <Switch defaultChecked={viewModel?.detailMenuResponse?.isActive} onChange={(e) => onSwitchChange(e, 'isActive')} />
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

export default EditMenu;
