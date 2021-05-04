import CarItem from "../handlers/get/CarItem";
import AddCarRequest from "../handlers/add/AddCarRequest";
import CarStore from "../stores/CarStore";
import {makeAutoObservable} from "mobx";
import GetCarRequest from "../handlers/get/GetCarRequest";
import GetCarHandler from "../handlers/get/GetCarHandler";
import GetCarResponse from "../handlers/get/GetCarResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteCarHandler from "../handlers/delete/DeleteCarHandler";
import DeleteCarRequest from "../handlers/delete/DeleteCarRequest";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetCarViewModel {
    columns: any[];
    carList: CarItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;
    companyBranchId: number;

    addCarRequest: AddCarRequest = new AddCarRequest();
    addedSuccessfully: boolean;

    constructor(public carStore: CarStore) {
        makeAutoObservable(this);

    }

    public async getAllCar(getCarsRequest: GetCarRequest) {
        try {
            this.isProcessing = true;

            let response = await GetCarHandler.get(getCarsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.carList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('Cars.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteCar(key: number, companyBranchId: number)
    {
        try
        {
            this.errorMessage = "";
            let request = new DeleteCarRequest();
            request.carId = key;
            let response = await DeleteCarHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllCar(new GetCarRequest(companyBranchId, this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Cars.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
