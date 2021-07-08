import CarKmConsumptionItem from "../handlers/get/CarKmConsumptionItem";
import CarKmConsumptionStore from "../stores/CarKmConsumptionStore";
import {makeAutoObservable} from "mobx";
import GetCarKmConsumptionRequest from "../handlers/get/GetCarKmConsumptionRequest";
import GetCarKmConsumptionHandler from "../handlers/get/GetCarKmConsumptionHandler";
import GetCarKmConsumptionResponse from "../handlers/get/GetCarKmConsumptionResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetCarKmConsumptionViewModel {
    columns: any[];
    carKmConsumptionList: CarKmConsumptionItem[];
    carKmConsumptionExport: CarKmConsumptionItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getCarKmConsumptionsRequest: GetCarKmConsumptionRequest;

    constructor(public carKmConsumptionStore: CarKmConsumptionStore) {
        makeAutoObservable(this);

    }

    public async getAllCarKmConsumption(getCarKmConsumptionsRequest: GetCarKmConsumptionRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getCarKmConsumptionsRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }

            this.isProcessing = true;
            getCarKmConsumptionsRequest.exportToFile = exportToFile;
            let response = await GetCarKmConsumptionHandler.get(getCarKmConsumptionsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;

                if(exportToFile)
                    this.carKmConsumptionExport = items;
                else
                {
                    this.carKmConsumptionList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarKmConsumptions.Error.Get.Message');
            log.error(e);
        } finally {
            getCarKmConsumptionsRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
