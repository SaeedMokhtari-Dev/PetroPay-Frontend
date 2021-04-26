import CarStore from "entities/cars/stores/CarStore";
import {makeAutoObservable} from "mobx";
import DetailCarResponse from "../handlers/detail/DetailCarResponse";
import GetCarHandler from "../handlers/get/GetCarHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailCarHandler from "../handlers/detail/DetailCarHandler";
import DetailCarRequest from "../handlers/detail/DetailCarRequest";
import AddCarRequest from "../handlers/add/AddCarRequest";
import EditCarRequest from "../handlers/edit/EditCarRequest";
import AddCarHandler from "../handlers/add/AddCarHandler";
import {message} from "antd";
import GetCarRequest from "../handlers/get/GetCarRequest";
import EditCarHandler from "../handlers/edit/EditCarHandler";
import UserContext from "../../../identity/contexts/UserContext";

export default class EditCarViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailCarResponse: DetailCarResponse;
    addCarRequest: AddCarRequest;
    editCarRequest: EditCarRequest;

    constructor(public carStore: CarStore) {
        makeAutoObservable(this);
    }
    public async getDetailCar(carId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailCarRequest(carId);
            let response = await DetailCarHandler.detail(request);

            if(response && response.success)
            {

                this.detailCarResponse = new DetailCarResponse().deserialize(response.data);
                this.editCarRequest = new EditCarRequest();
                for ( let i in this.editCarRequest )
                    if ( this.detailCarResponse.hasOwnProperty( i ) )
                        this.editCarRequest[i] = this.detailCarResponse[i];


                return this.detailCarResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Cars.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addCar(request: AddCarRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            //request.companyId = UserContext.info.id;
            let response = await AddCarHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.carsStore.getCarViewModel.getAllCars(new GetCarsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Cars.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editCar(request: EditCarRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditCarHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.carsStore.getCarViewModel.getAllCars(new GetCarsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Cars.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
