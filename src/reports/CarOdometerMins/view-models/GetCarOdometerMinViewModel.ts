import CarOdometerMinItem from "../handlers/get/CarOdometerMinItem";
import CarOdometerMinStore from "../stores/CarOdometerMinStore";
import {makeAutoObservable} from "mobx";
import GetCarOdometerMinRequest from "../handlers/get/GetCarOdometerMinRequest";
import GetCarOdometerMinHandler from "../handlers/get/GetCarOdometerMinHandler";
import GetCarOdometerMinResponse from "../handlers/get/GetCarOdometerMinResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetCarOdometerMinViewModel {
    columns: any[];
    carOdometerMinList: CarOdometerMinItem[];
    carOdometerMinExport: CarOdometerMinItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getCarOdometerMinsRequest: GetCarOdometerMinRequest;

    constructor(public carOdometerMinStore: CarOdometerMinStore) {
        makeAutoObservable(this);

    }

    public async getAllCarOdometerMin(getCarOdometerMinsRequest: GetCarOdometerMinRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getCarOdometerMinsRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }

            this.isProcessing = true;
            getCarOdometerMinsRequest.exportToFile = exportToFile;
            let response = await GetCarOdometerMinHandler.get(getCarOdometerMinsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;

                if(exportToFile)
                    this.carOdometerMinExport = items;
                else
                {
                    this.carOdometerMinList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarOdometerMins.Error.Get.Message');
            log.error(e);
        } finally {
            getCarOdometerMinsRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
