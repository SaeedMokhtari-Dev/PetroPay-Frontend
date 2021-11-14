import CarConsumptionRateItem from "../handlers/get/CarConsumptionRateItem";
import CarConsumptionRateStore from "../stores/CarConsumptionRateStore";
import {makeAutoObservable} from "mobx";
import GetCarConsumptionRateRequest from "../handlers/get/GetCarConsumptionRateRequest";
import GetCarConsumptionRateHandler from "../handlers/get/GetCarConsumptionRateHandler";
import GetCarConsumptionRateResponse from "../handlers/get/GetCarConsumptionRateResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetCarConsumptionRateViewModel {
    columns: any[];
    carConsumptionRateList: CarConsumptionRateItem[];
    carConsumptionRateExport: CarConsumptionRateItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getCarConsumptionRatesRequest: GetCarConsumptionRateRequest;

    constructor(public carConsumptionRateStore: CarConsumptionRateStore) {
        makeAutoObservable(this);

    }

    public async getAllCarConsumptionRate(getCarConsumptionRatesRequest: GetCarConsumptionRateRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            /*if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getCarConsumptionRatesRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }*/

            this.isProcessing = true;
            getCarConsumptionRatesRequest.exportToFile = exportToFile;
            let response = await GetCarConsumptionRateHandler.get(getCarConsumptionRatesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;

                if(exportToFile)
                    this.carConsumptionRateExport = items;
                else
                {
                    this.carConsumptionRateList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarConsumptionRates.Error.Get.Message');
            log.error(e);
        } finally {
            getCarConsumptionRatesRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
