import CarOdometerMaxItem from "../handlers/get/CarOdometerMaxItem";
import CarOdometerMaxStore from "../stores/CarOdometerMaxStore";
import {makeAutoObservable} from "mobx";
import GetCarOdometerMaxRequest from "../handlers/get/GetCarOdometerMaxRequest";
import GetCarOdometerMaxHandler from "../handlers/get/GetCarOdometerMaxHandler";
import GetCarOdometerMaxResponse from "../handlers/get/GetCarOdometerMaxResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetCarOdometerMaxViewModel {
    columns: any[];
    carOdometerMaxList: CarOdometerMaxItem[];
    carOdometerMaxExport: CarOdometerMaxItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getCarOdometerMaxesRequest: GetCarOdometerMaxRequest;

    constructor(public carOdometerMaxStore: CarOdometerMaxStore) {
        makeAutoObservable(this);

    }

    public async getAllCarOdometerMax(getCarOdometerMaxesRequest: GetCarOdometerMaxRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getCarOdometerMaxesRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }

            this.isProcessing = true;
            getCarOdometerMaxesRequest.exportToFile = exportToFile;
            let response = await GetCarOdometerMaxHandler.get(getCarOdometerMaxesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;

                if(exportToFile)
                    this.carOdometerMaxExport = items;
                else
                {
                    this.carOdometerMaxList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarOdometerMaxes.Error.Get.Message');
            log.error(e);
        } finally {
            getCarOdometerMaxesRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
