import React from 'react';
import {inject, observer} from "mobx-react";
import Stores from "app/constants/Stores";
import CarStore from "entities/cars/stores/CarStore";
import {useParams} from "react-router-dom";
import {Button, Col, Divider, Form, Input, Image, message, Select, PageHeader, Radio, Row, Spin, Switch, Upload} from "antd";
import i18next from "i18next";
import EditCarRequest from "../../handlers/edit/EditCarRequest";
import DetailCarResponse from "../../handlers/detail/DetailCarResponse";
import AddCarRequest from "../../handlers/add/AddCarRequest";
import {
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone, ClusterOutlined
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import { PasswordInput } from 'antd-password-input-strength';
import Types from "../../../../app/constants/Types";
import CarTypes from "../../../../app/constants/CarTypes";
import ConsumptionMethods from "../../../../app/constants/ConsumptionMethods";
import CarBrands from "../../../../app/constants/CarBrands";
import CarTypeOfFuels from "../../../../app/constants/CarTypeOfFuels";
import MaskedInput from 'antd-mask-input'
import ListBranchViewModel from "../../../branches/view-models/ListBranchViewModel";
import UserContext from "../../../../identity/contexts/UserContext";
import ConsumptionTypes from "../../../../app/constants/ConsumptionTypes";

const { Option } = Select;

const {useEffect} = React;

interface EditCarProps {
    carStore?: CarStore;
    match?: any;
}

const EditCar: React.FC<EditCarProps> = inject(Stores.carStore)(observer(({carStore, match}) =>
{
    const [imageUrl, setImageUrl] = React.useState("");
    const [dataFetched, setDataFetched] = React.useState(false);
    const [carId, setCarId] = React.useState(0);
    const [switchDisabled, setSwitchDisabled] = React.useState(false);
    const [switchChecked, setSwitchChecked] = React.useState(false);
    const [carIdNumberValue, setCarIdNumberValue] = React.useState("");
    const [children, setChildren] = React.useState([]);
    const [carTypeOptions, setCarTypeOptions] = React.useState([]);
    const [carBrandOptions, setCarBrandOptions] = React.useState([]);
    const [carModelOptions, setCarModelOptions] = React.useState([]);
    const [petrolPriceOptions, setPetrolPriceOptions] = React.useState([]);


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

    /*CarTypes.forEach(w =>{ w.title = i18next.t(w.title) });
    const carTypeOptions = [...CarTypes];*/

    ConsumptionMethods.forEach(w =>{ w.title = i18next.t(w.title) });
    const consumptionMethodOptions = [...ConsumptionMethods];

    /*CarBrands.forEach(w =>{ w.title = i18next.t(w.title) });
    const carBrandOptions = [...CarBrands];*/

    /*CarTypeOfFuels.forEach(w =>{ w.title = i18next.t(w.title) });
    const carTypeOfFuelOptions = [...CarTypeOfFuels];*/

    ConsumptionTypes.forEach(w =>{ w.title = i18next.t(w.title) });
    const consumptionTypeOptions = [...ConsumptionTypes];

    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {
        
        carStore.onCarEditPageLoad();
        debugger;
        let carIdParam = +match.params?.carId;
        /*if(UserContext.info.role === 1)*/

        if(carIdParam)
        {
            await carStore.editCarViewModel.getDetailCar(carIdParam);
            setImageUrl(carStore.editCarViewModel?.detailCarResponse?.carPlatePhoto);
            if(carStore.editCarViewModel.detailCarResponse.workAllDays)
                setSwitchDisabled(true);
        }
        else{
            carStore.editCarViewModel.addCarRequest = new AddCarRequest();
            carStore.editCarViewModel.detailCarResponse = new DetailCarResponse();
            if(match.params?.companyBranchId) carStore.editCarViewModel.addCarRequest.companyBarnchId = +match.params.companyBranchId;
            if(UserContext.info.role === 5) carStore.editCarViewModel.addCarRequest.companyBarnchId = UserContext.info.id;
        }

        if(UserContext.info.role === 1) {
            await carStore.listBranchViewModel.getBranchList(UserContext.info.id);
            let children = [];
            for (let item of carStore.listBranchViewModel.listBranchResponse.items) {
                children.push(<Option key={item.key} value={item.key}>{item.title}</Option>);
            }
            setChildren(children);
        }

        await carStore.listCarTypeMasterViewModel.getCarTypeMasterList();
        let carTypes = [];
        for (let item of carStore.listCarTypeMasterViewModel?.listCarTypeMasterResponse?.items) {
            carTypes.push(<Option key={item.key} value={item.title}>{item.title}</Option>);
        }
        setCarTypeOptions(carTypes);

        await carStore.listCarBrandMasterViewModel.getCarBrandMasterList();
        let carBrands = [];
        for (let item of carStore.listCarBrandMasterViewModel?.listCarBrandMasterResponse?.items) {
            if(localStorage.getItem("currentLanguage") === 'en')
                carBrands.push(<Option key={item.key} value={item.titleEn}>{item.titleEn}</Option>);
            else
                carBrands.push(<Option key={item.key} value={item.titleAr}>{item.titleAr}</Option>);
        }
        setCarBrandOptions(carBrands);

        await carStore.listCarModelMasterViewModel.getCarModelMasterList();
        let carModels = [];
        for (let item of carStore.listCarModelMasterViewModel?.listCarModelMasterResponse?.items) {
            if(localStorage.getItem("currentLanguage") === 'en')
                carModels.push(<Option key={item.key} value={item.titleEn}>{item.titleEn}</Option>);
            else
                carModels.push(<Option key={item.key} value={item.titleAr}>{item.titleAr}</Option>);
        }
        setCarModelOptions(carModels);

        await carStore.listPetrolPriceViewModel.getPetrolPriceList();
        let petrolPrices = [];
        for (let item of carStore.listPetrolPriceViewModel?.listPetrolPriceResponse?.items) {
            petrolPrices.push(<Option key={item.key} value={item.petrolPriceType}>{item.petrolPriceType}</Option>);
        }
        setPetrolPriceOptions(petrolPrices);

        setCarId(carIdParam);
        setDataFetched(true);
    }


    let viewModel = carStore.editCarViewModel;

    if(!viewModel) return;

    async function onFinish(values: any) {


        if(carId)
        {
            await viewModel.editCar(viewModel.editCarRequest);
        }
        else
        {
            await viewModel.addCar(viewModel.addCarRequest);
        }
        if(!viewModel.errorMessage)
            history.goBack();
    };

    function onUnload() {
        carStore.onCarEditPageUnload();
        setImageUrl("");
        setDataFetched(false);
        setCarId(0);
        setSwitchDisabled(false);
        setSwitchChecked(false);
        setCarIdNumberValue("");
    }

    function onSelectChanged(e, propName){

        if(carId)
            carStore.editCarViewModel.editCarRequest[`${propName}`] = e;
        else
            carStore.editCarViewModel.addCarRequest[`${propName}`] = e;
    }
    function onBrandChanged(e, option, propName){

        if(carId)
            carStore.editCarViewModel.editCarRequest[`${propName}`] = e;
        else
            carStore.editCarViewModel.addCarRequest[`${propName}`] = e;

        if(propName === "carBrand")
        {
            debugger;
            const filtered = carStore.listCarModelMasterViewModel?.listCarModelMasterResponse?.items?.filter(w => w.brandId == +option.key);
            let carModels = [];
            for (let item of filtered) {
                if(localStorage.getItem("currentLanguage") === 'en')
                    carModels.push(<Option key={item.key} value={item.titleEn}>{item.titleEn}</Option>);
                else
                    carModels.push(<Option key={item.key} value={item.titleAr}>{item.titleAr}</Option>);
            }
            setCarModelOptions(carModels);
        }
    }
    function onMaskChanged(e) {
        if(carId)
            carStore.editCarViewModel.editCarRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
        else
            carStore.editCarViewModel.addCarRequest[`${e.target.id}`] = e.target.value.replace(/\s+/g, '');
    }

    function onChanged(e){
        if(carId) {
            carStore.editCarViewModel.editCarRequest[`${e.target.id}`] = e.target.value;
            carStore.editCarViewModel.editCarRequest.carIdNumber1E = carStore.editCarViewModel?.editCarRequest?.carIdNumber1E?.replace(/\s+/g, '').replace(/_/g, "") ?? "";
            carStore.editCarViewModel.editCarRequest.carIdText1E = carStore.editCarViewModel?.editCarRequest?.carIdText1E?.replace(/_/g, "") ?? "";
            carStore.editCarViewModel.editCarRequest.carIdNumber =
                `${carStore.editCarViewModel?.editCarRequest?.carIdNumber1E} ${carStore.editCarViewModel?.editCarRequest?.carIdText1A}`;
            if(carStore?.editCarViewModel?.editCarRequest?.carIdNumber != undefined)
                setCarIdNumberValue(carStore.editCarViewModel.editCarRequest.carIdNumber);
            /*carStore.editCarViewModel.detailCarResponse.carIdNumber =
                `${carStore.editCarViewModel?.editCarRequest?.carIdNumber1E?.replace(/\s+/g, '').replace(/_/g, "")} ${carStore.editCarViewModel?.editCarRequest?.carIdText1E?.replace(/\s+/g, '').replace(/_/g, "")}`;*/
        }
        else {
            carStore.editCarViewModel.addCarRequest[`${e.target.id}`] = e.target.value;

            carStore.editCarViewModel.addCarRequest.carIdNumber1E = carStore.editCarViewModel?.addCarRequest?.carIdNumber1E?.replace(/\s+/g, '').replace(/_/g, "") ?? "";
            carStore.editCarViewModel.addCarRequest.carIdText1E = carStore.editCarViewModel?.addCarRequest?.carIdText1E?.replace(/_/g, "") ?? "";

            carStore.editCarViewModel.addCarRequest.carIdNumber =
                `${carStore.editCarViewModel?.addCarRequest?.carIdNumber1E} ${carStore.editCarViewModel?.addCarRequest?.carIdText1A}`;
            if(carStore.editCarViewModel?.addCarRequest?.carIdNumber  != undefined)
                setCarIdNumberValue(carStore.editCarViewModel.addCarRequest.carIdNumber);
            /*carStore.editCarViewModel.detailCarResponse.carIdNumber =
                `${carStore.editCarViewModel?.addCarRequest?.carIdNumber1E?.replace(/\s+/g, '').replace(/_/g, "")} ${carStore.editCarViewModel?.addCarRequest?.carIdText1E?.replace(/\s+/g, '').replace(/_/g, "")}`;*/
        }


    }
    function onWorkAllDaysSwitchChange(e){
        const boolProps = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
        if(e == true) {
            if (carId) {
                carStore.editCarViewModel.editCarRequest.workAllDays = true;
                boolProps.forEach(w => {
                    carStore.editCarViewModel.editCarRequest[`${w}`] = true;
                    carStore.editCarViewModel.detailCarResponse[`${w}`] = true;
                })
            } else {
                carStore.editCarViewModel.addCarRequest.workAllDays = true;
                boolProps.forEach(w => {
                    carStore.editCarViewModel.addCarRequest[`${w}`] = true;
                    carStore.editCarViewModel.detailCarResponse[`${w}`] = true;
                })
            }

            setSwitchDisabled(true);
        }
        else {
            setSwitchDisabled(false);
        }
    }
    function onSwitchChange(e, propName){
        
        if(carId) {
            carStore.editCarViewModel.editCarRequest[`${propName}`] = e;
            carStore.editCarViewModel.detailCarResponse[`${propName}`] = e;
        }
        else {
            carStore.editCarViewModel.addCarRequest[`${propName}`] = e;
            carStore.editCarViewModel.detailCarResponse[`${propName}`] = e;
        }
    }
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file) {
        viewModel.uploadLoading = true;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error(i18next.t("General.Image.JustImage"));
            viewModel.uploadLoading = false;
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error(i18next.t("General.Image.LessThan2MB"));
            viewModel.uploadLoading = false;
            return false;
        }
        getBase64(file, imageUrl => {

            viewModel.uploadLoading = false;
            /*const image = imageUrl.substr(imageUrl.indexOf(',') + 1);*/
            if(carId){
                viewModel.editCarRequest.carPlatePhoto = imageUrl;
                setImageUrl(imageUrl);
                //viewModel.editCarRequest.IsCompanyCommercialPhotoChanged = true;
            }
            else {
                setImageUrl(imageUrl);
                viewModel.addCarRequest.carPlatePhoto = imageUrl;
            }
        });
        return true;
    }
    const regex = /[ء-ي]{1} [ء-ي]{1}( [ء-ي]{1})?/gm;
    const uploadButton = (
        /*<div>
        {!viewModel?.detailCompanyResponse?.companyCommercialPhoto &&
            (*/
        <div className={"btn-uploader"}>
            {viewModel.uploadLoading ? <Spin /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
        /*  )
      }
      </div>*/
    );
    function customRequest(){

        return true;
    }




    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={carId ? `${i18next.t("Cars.Edit.HeaderText")} ${carId}` : i18next.t("Cars.Add.HeaderText")}
            />

            {/*<Divider>{i18next.t("Cars.Section.GeneralInformation")}</Divider>*/}
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"carForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    {UserContext.info.role === 1 ?
                    <Col span={8}>
                        <Form.Item name="companyBarnchId" initialValue={viewModel?.detailCarResponse?.companyBarnchId}
                                   key={"companyBarnchId"}
                                   label={i18next.t("Cars.Label.companyBarnchId")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.companyBarnchId.Required")
                                       }
                                   ]}>
                            <Select
                                style={{ width: "100%" }}
                                onChange={(e) => onSelectChanged(e, 'companyBarnchId')}
                            >
                                {children}
                            </Select>
                        </Form.Item>
                    </Col>
                        : "" }
                    <Divider>{i18next.t("Cars.Section.CarInformation")}</Divider>
                    <Col span={6}>
                        <Form.Item name="carIdNumber1E" initialValue={viewModel?.detailCarResponse?.carIdNumber1E}
                                   key={"carIdNumber1E"}
                                   label={i18next.t("Cars.Label.carIdNumber1E")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carIdNumber1E.Required")
                                       }
                                   ]}>
                            <MaskedInput mask="1 1 1 1" maxLength= {8} onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                <Form.Item name="carIdText1E" initialValue={viewModel?.detailCarResponse?.carIdText1E}
                           key={"carIdText1E"}
                           label={i18next.t("Cars.Label.carIdText1E")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Cars.Validation.Message.carIdText1E.Required")
                               }
                           ]}>
                    <MaskedInput mask="A A A" maxLength={6} onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item name="carIdText1A" initialValue={viewModel?.detailCarResponse?.carIdText1A}
                                   key={"carIdText1A"}
                                   label={i18next.t("Cars.Label.carIdText1A")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carIdText1A.Required")
                                       },
                                       {
                                           required: true,
                                           pattern: regex,
                                           message: i18next.t("Cars.Validation.Message.carIdText1A.Valid")
                                       }
                                   ]}>
                            <Input placeholder={"س ي ج"} dir={"rtl"} maxLength={6} onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                            <span>{i18next.t("Cars.Label.carIdNumber")}</span>
                            <h2>{carIdNumberValue != "undefined undefined" ? carIdNumberValue : ""}</h2>
                    </Col>
                    <Col span={8}>
                <Form.Item name="consumptionType" initialValue={viewModel?.detailCarResponse?.consumptionType}
                           key={"consumptionType"}
                           label={i18next.t("Cars.Label.consumptionType")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Cars.Validation.Message.consumptionType.Required")
                               }
                           ]}>
                    {/*<Input onChange={onChanged}/>*/}
                    <Select options={consumptionTypeOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "consumptionType")} />
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="consumptionValue" initialValue={viewModel?.detailCarResponse?.consumptionValue}
                           key={"consumptionValue"}
                           label={i18next.t("Cars.Label.consumptionValue")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Cars.Validation.Message.consumptionValue.Required")
                               }
                           ]}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="consumptionMethod" initialValue={viewModel?.detailCarResponse?.consumptionMethod}
                           key={"consumptionMethod"}
                           label={i18next.t("Cars.Label.consumptionMethod")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Cars.Validation.Message.consumptionMethod.Required")
                               }
                           ]}>
                    <Select options={consumptionMethodOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "consumptionMethod")} />
                </Form.Item>
                    </Col>
                    {/*<Col span={8}>
                <Form.Item name="carBalnce" initialValue={viewModel?.detailCarResponse?.carBalnce}
                           key={"carBalnce"}
                           label={i18next.t("Cars.Label.carBalnce")}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>*/}
                    <Col span={8}>
                        <Form.Item name="carType" initialValue={viewModel?.detailCarResponse?.carType}
                                   key={"carType"}
                                   label={i18next.t("Cars.Label.carType")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carType.Required")
                                       }
                                   ]}>
                            <Select showSearch={true} onChange={(e) => onSelectChanged(e, "carType")}>
                                {carTypeOptions}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carBrand" initialValue={viewModel?.detailCarResponse?.carBrand}
                                   key={"carBrand"}
                                   label={i18next.t("Cars.Label.carBrand")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carBrand.Required")
                                       }
                                   ]}>
                            <Select showSearch={true} onChange={(e, option) => onBrandChanged(e, option, "carBrand")} >
                                {carBrandOptions}
                            </Select>

                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carModel" initialValue={viewModel?.detailCarResponse?.carModel}
                                   key={"carModel"}
                                   label={i18next.t("Cars.Label.carModel")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carModel.Required")
                                       }
                                   ]}>

                            <Select showSearch={true} onChange={(e) => onSelectChanged(e, "carModel")} >
                                {carModelOptions}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carModelYear" initialValue={viewModel?.detailCarResponse?.carModelYear}
                                   key={"carModelYear"}
                                   label={i18next.t("Cars.Label.carModelYear")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carModelYear.Required")
                                       }
                                   ]}>
                            <Input type={"number"} onChange={onChanged}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="carFuelKmCap" initialValue={viewModel?.detailCarResponse?.carFuelKmCap}
                                   key={"carFuelKmCap"}
                                   label={i18next.t("Cars.Label.carFuelKmCap")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carFuelKmCap.Required")
                                       }
                                   ]}>
                            <Input type={"number"} onChange={onChanged}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="carTypeOfFuel" initialValue={viewModel?.detailCarResponse?.carTypeOfFuel}
                                   key={"carTypeOfFuel"}
                                   label={i18next.t("Cars.Label.carTypeOfFuel")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carTypeOfFuel.Required")
                                       }
                                   ]}>
                            {/*<Select options={carTypeOfFuelOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "carTypeOfFuel")} />*/}
                            <Select showSearch={true} onChange={(e) => onSelectChanged(e, "carTypeOfFuel")} >
                                {petrolPriceOptions}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="carWorkWithApproval" initialValue={viewModel?.detailCarResponse?.carWorkWithApproval}
                                   key={"carWorkWithApproval"}
                                   label={i18next.t("Cars.Label.carWorkWithApproval")}>
                            <Switch defaultChecked={viewModel?.detailCarResponse?.carWorkWithApproval} onChange={(e) => onSwitchChange(e, 'carWorkWithApproval')} />
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Cars.Section.DriverInformation")}</Divider>
                    <Col span={8}>
                        <Form.Item name="carDriverName" initialValue={viewModel?.detailCarResponse?.carDriverName}
                                   key={"carDriverName"}
                                   label={i18next.t("Cars.Label.carDriverName")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carDriverPhoneNumber" initialValue={viewModel?.detailCarResponse?.carDriverPhoneNumber}
                                   key={"carDriverPhoneNumber"}
                                   label={i18next.t("Cars.Label.carDriverPhoneNumber")}>
                            {/*<Input onChange={onChanged}/>*/}
                            <MaskedInput className={"phone-number"} mask="+2 111 111 11111" onChange={onMaskChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carDriverEmail" initialValue={viewModel?.detailCarResponse?.carDriverEmail}
                                   key={"carDriverEmail"}
                                   label={i18next.t("Cars.Label.carDriverEmail")}
                                   rules={[
                                       {
                                           type: "email",
                                           message: i18next.t("Cars.Validation.Message.carDriverEmail.Valid")
                                       }
                                   ]}>
                            <Input type={"email"} onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carDriverActive" initialValue={viewModel?.detailCarResponse?.carDriverActive}
                                   key={"carDriverActive"}
                                   label={i18next.t("Cars.Label.carDriverActive")}>
                            <Switch onChange={(e) => onSwitchChange(e, 'carDriverActive')} defaultChecked={viewModel?.detailCarResponse?.carDriverActive} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carOdometerRecordRequired" initialValue={viewModel?.detailCarResponse?.carOdometerRecordRequired}
                                   key={"carOdometerRecordRequired"}
                                   label={i18next.t("Cars.Label.carOdometerRecordRequired")}>
                            <Switch onChange={(e) => onSwitchChange(e, 'carOdometerRecordRequired')} defaultChecked={viewModel?.detailCarResponse?.carOdometerRecordRequired} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carDriverConfirmationCode" initialValue={viewModel?.detailCarResponse?.carDriverConfirmationCode}
                                   key={"carDriverConfirmationCode"}
                                   label={i18next.t("Cars.Label.carDriverConfirmationCode")}
                                   rules={[
                                       { min: 4, message: i18next.t("Cars.Validation.Message.carDriverConfirmationCode.4MinLength") },

                                               {
                                                   required: true,
                                                   message: i18next.t("Cars.Validation.Message.carDriverConfirmationCode.Required")
                                               }
                                   ]}
                        >
                            <Input type={"number"} onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Divider>
                            {i18next.t("Cars.Label.workAllDays")} <Switch onChange={onWorkAllDaysSwitchChange} defaultChecked={viewModel?.detailCarResponse?.workAllDays} />
                    </Divider>
                    <Col span={3}>

                <Form.Item name="saturday"
                           key={"saturday"}
                           label={i18next.t("Cars.Label.saturday")}>
                    <Switch disabled={switchDisabled} defaultChecked={viewModel?.detailCarResponse?.saturday} onChange={(e) => onSwitchChange(e, 'saturday')} />
                </Form.Item>
                    </Col>
                    <Col span={3}>
                <Form.Item name="sunday" initialValue={viewModel?.detailCarResponse?.sunday}
                           key={"sunday"}
                           label={i18next.t("Cars.Label.sunday")}>
                    <Switch disabled={switchDisabled} defaultChecked={viewModel?.detailCarResponse?.sunday} onChange={(e) => onSwitchChange(e, 'sunday')} />
                </Form.Item>
                    </Col>
                    <Col span={3}>
                <Form.Item name="monday" initialValue={viewModel?.detailCarResponse?.monday}
                           key={"monday"}
                           label={i18next.t("Cars.Label.monday")}>
                    <Switch disabled={switchDisabled} onChange={(e) => onSwitchChange(e, 'monday')} defaultChecked={viewModel?.detailCarResponse?.monday} />
                </Form.Item>
                    </Col>
                    <Col span={3}>
                <Form.Item name="tuesday" initialValue={viewModel?.detailCarResponse?.tuesday}
                           key={"tuesday"}
                           label={i18next.t("Cars.Label.tuesday")}>
                    <Switch disabled={switchDisabled}  onChange={(e) => onSwitchChange(e, 'tuesday')} defaultChecked={viewModel?.detailCarResponse?.tuesday} />
                </Form.Item>
                    </Col>
                    <Col span={3}>
                <Form.Item name="wednesday" initialValue={viewModel?.detailCarResponse?.wednesday}
                           key={"wednesday"}
                           label={i18next.t("Cars.Label.wednesday")}>
                    <Switch disabled={switchDisabled} onChange={(e) => onSwitchChange(e, 'wednesday')} defaultChecked={viewModel?.detailCarResponse?.wednesday} />
                </Form.Item>
                    </Col>
                    <Col span={3}>
                <Form.Item name="thursday" initialValue={viewModel?.detailCarResponse?.thursday}
                           key={"thursday"}
                           label={i18next.t("Cars.Label.thursday")}>
                    <Switch disabled={switchDisabled} onChange={(e) => onSwitchChange(e, 'thursday')} defaultChecked={viewModel?.detailCarResponse?.thursday} />
                </Form.Item>
                    </Col>
                    <Col span={3}>
                <Form.Item name="friday" initialValue={viewModel?.detailCarResponse?.friday}
                           key={"friday"}
                           label={i18next.t("Cars.Label.friday")}>
                    <Switch disabled={switchDisabled} onChange={(e) => onSwitchChange(e, 'friday')} defaultChecked={viewModel?.detailCarResponse?.friday} />
                </Form.Item>
                    </Col>


                    <Divider>{i18next.t("Companies.Section.LoginInformation")}</Divider>

                    <Col span={8}>
                        <Form.Item name="carDriverUserName" initialValue={viewModel?.detailCarResponse?.carDriverUserName}
                                   key={"carDriverUserName"}
                                   label={i18next.t("Cars.Label.carDriverUserName")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carDriverUserName.Required")
                                       },
                                       {
                                           pattern: /^\S*$/,
                                           message: i18next.t("Cars.Validation.Message.carDriverUserName.Valid"),
                                       }]}>
                            <Input onChange={onChanged} autoComplete={"new-username"}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carDriverPassword" initialValue={viewModel?.detailCarResponse?.carDriverPassword}
                                   key={"carDriverPassword"}
                                   label={i18next.t("Cars.Label.carDriverPassword")}
                                   rules={[
                                       {
                                           required: true,
                                           message: i18next.t("Cars.Validation.Message.carDriverPassword.Required")
                                       },
                                       {
                                           pattern: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/g,
                                           message: i18next.t("Cars.Validation.Message.carDriverPassword.Valid"),
                                       }
                                   ]}>
                            <PasswordInput inputProps={{autoComplete: "new-password"}}
                                onChange={onChanged}
                            />
                        </Form.Item>
                    </Col>
                    <Divider>{i18next.t("Cars.Label.carPlatePhoto")}</Divider>
                    <Col span={8}>
                        <Form.Item name="carNeedPlatePhoto" initialValue={viewModel?.detailCarResponse?.carNeedPlatePhoto}
                                   key={"carNeedPlatePhoto"}
                                   label={i18next.t("Cars.Label.carNeedPlatePhoto")}>
                            <Switch onChange={(e) => onSwitchChange(e, 'carNeedPlatePhoto')} defaultChecked={viewModel?.detailCarResponse?.carNeedPlatePhoto} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Upload
                            key={"uploader"}
                            className={"avatar-uploader"}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            customRequest= {customRequest}
                            showUploadList={false}
                        >
                            {imageUrl ? (
                                <div>
                                    <img src={imageUrl} style={{width: '100%', height: '150px'}} alt="logo" />
                                    <p>{i18next.t("General.Upload.ChangePhoto")}</p>
                                </div>
                            ) : uploadButton}
                        </Upload>
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

export default EditCar;
