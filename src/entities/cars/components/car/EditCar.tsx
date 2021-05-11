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
    PlusOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';
import history from "../../../../app/utils/History";
import { PasswordInput } from 'antd-password-input-strength';
import Types from "../../../../app/constants/Types";
import CarTypes from "../../../../app/constants/CarTypes";
import ConsumptionMethods from "../../../../app/constants/ConsumptionMethods";
import CarBrands from "../../../../app/constants/CarBrands";
import CarTypeOfFuels from "../../../../app/constants/CarTypeOfFuels";
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

    CarTypes.forEach(w =>{ w.title = i18next.t(w.title) });
    const carTypeOptions = [...CarTypes];

    ConsumptionMethods.forEach(w =>{ w.title = i18next.t(w.title) });
    const consumptionMethodOptions = [...ConsumptionMethods];

    CarBrands.forEach(w =>{ w.title = i18next.t(w.title) });
    const carBrandOptions = [...CarBrands];

    CarTypeOfFuels.forEach(w =>{ w.title = i18next.t(w.title) });
    const carTypeOfFuelOptions = [...CarTypeOfFuels];

    useEffect(() => {
        onLoad();
        return onUnload;
    }, []);

    async function onLoad()
    {
        debugger;
        carStore.onCarEditPageLoad();
        let carIdParam = +match.params?.carId;

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
            if(match.params?.companyBranchId) {
                carStore.editCarViewModel.addCarRequest.companyBarnchId = +match.params.companyBranchId;
            }
        }
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
    }

    function onSelectChanged(e, propName){

        if(carId)
            carStore.editCarViewModel.editCarRequest[`${propName}`] = e;
        else
            carStore.editCarViewModel.addCarRequest[`${propName}`] = e;
    }

    function onChanged(e){
        if(carId)
            carStore.editCarViewModel.editCarRequest[`${e.target.id}`] = e.target.value;
        else
            carStore.editCarViewModel.addCarRequest[`${e.target.id}`] = e.target.value;
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
        debugger;
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
            message.error('You can only upload JPG/PNG file!');
            viewModel.uploadLoading = false;
            return false;
        }
        /*const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false;
        }*/
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

            <Divider>{i18next.t("Cars.Section.GeneralInformation")}</Divider>
            {dataFetched ?
            <Form {...formItemLayout} layout={"vertical"} onFinish={onFinish} form={form}
                  key={"carForm"}
                 scrollToFirstError>
                <Row gutter={[24, 16]}>
                    <Col span={8}>
                <Form.Item name="carIdNumber" initialValue={viewModel?.detailCarResponse?.carIdNumber}
                           key={"carIdNumber"}
                           label={i18next.t("Cars.Label.carIdNumber")}
                           rules={[
                               {
                                   required: true,
                                   message: i18next.t("Cars.Validation.Message.carIdNumber.Required")
                               }
                           ]}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carIdNumber1E" initialValue={viewModel?.detailCarResponse?.carIdNumber1E}
                                   key={"carIdNumber1E"}
                                   label={i18next.t("Cars.Label.carIdNumber1E")}>
                            <Input maxLength={8} onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="carIdText1E" initialValue={viewModel?.detailCarResponse?.carIdText1E}
                           key={"carIdText1E"}
                           label={i18next.t("Cars.Label.carIdText1E")}>
                    <Input maxLength={6} onChange={onChanged}/>
                </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="carIdText1A" initialValue={viewModel?.detailCarResponse?.carIdText1A}
                                   key={"carIdText1A"}
                                   label={i18next.t("Cars.Label.carIdText1A")}>
                            <Input maxLength={6} onChange={onChanged}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                <Form.Item name="consumptionType" initialValue={viewModel?.detailCarResponse?.consumptionType}
                           key={"consumptionType"}
                           label={i18next.t("Cars.Label.consumptionType")}>
                    <Input onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="consumptionValue" initialValue={viewModel?.detailCarResponse?.consumptionValue}
                           key={"consumptionValue"}
                           label={i18next.t("Cars.Label.consumptionValue")}>
                    <Input type={"number"} onChange={onChanged}/>
                </Form.Item>
                    </Col>
                    <Col span={8}>
                <Form.Item name="consumptionMethod" initialValue={viewModel?.detailCarResponse?.consumptionMethod}
                           key={"consumptionMethod"}
                           label={i18next.t("Cars.Label.consumptionMethod")}>
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
                                   label={i18next.t("Cars.Label.carType")}>
                            <Select options={carTypeOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "carType")} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carBrand" initialValue={viewModel?.detailCarResponse?.carBrand}
                                   key={"carBrand"}
                                   label={i18next.t("Cars.Label.carBrand")}>
                            <Select options={carBrandOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "carBrand")} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carModel" initialValue={viewModel?.detailCarResponse?.carModel}
                                   key={"carModel"}
                                   label={i18next.t("Cars.Label.carModel")}>
                            <Input onChange={onChanged}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carModelYear" initialValue={viewModel?.detailCarResponse?.carModelYear}
                                   key={"carModelYear"}
                                   label={i18next.t("Cars.Label.carModelYear")}>
                            <Input type={"number"} onChange={onChanged}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="carTypeOfFuel" initialValue={viewModel?.detailCarResponse?.carTypeOfFuel}
                                   key={"carTypeOfFuel"}
                                   label={i18next.t("Cars.Label.carTypeOfFuel")}>
                            <Select options={carTypeOfFuelOptions} showSearch={true} onChange={(e) => onSelectChanged(e, "carTypeOfFuel")} />
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
                            <Input onChange={onChanged}/>
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
                        <Form.Item name="carDriverConfirmationCode" initialValue={viewModel?.detailCarResponse?.carDriverConfirmationCode}
                                   key={"carDriverConfirmationCode"}
                                   label={i18next.t("Cars.Label.carDriverConfirmationCode")}
                                   rules={[
                                       { min: 4, message: i18next.t("Cars.Validation.Message.carDriverConfirmationCode.4MinLength") }
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
                            <Input onChange={onChanged}/>
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
                                       }
                                   ]}>
                            <PasswordInput
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
