import OdometerBetweenDateItem from "../handlers/get/OdometerBetweenDateItem";
import OdometerBetweenDateStore from "../stores/OdometerBetweenDateStore";
import {makeAutoObservable} from "mobx";
import GetOdometerBetweenDateRequest from "../handlers/get/GetOdometerBetweenDateRequest";
import GetOdometerBetweenDateHandler from "../handlers/get/GetOdometerBetweenDateHandler";
import GetOdometerBetweenDateResponse from "../handlers/get/GetOdometerBetweenDateResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetOdometerBetweenDateViewModel {
    columns: any[];
    odometerBetweenDateList: OdometerBetweenDateItem[];
    odometerBetweenDateExport: OdometerBetweenDateItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getOdometerBetweenDatesRequest: GetOdometerBetweenDateRequest;

    constructor(public odometerBetweenDateStore: OdometerBetweenDateStore) {
        makeAutoObservable(this);

    }

    public async getAllOdometerBetweenDate(getOdometerBetweenDatesRequest: GetOdometerBetweenDateRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getOdometerBetweenDatesRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }

            this.isProcessing = true;
            getOdometerBetweenDatesRequest.exportToFile = exportToFile;
            let response = await GetOdometerBetweenDateHandler.get(getOdometerBetweenDatesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;

                if(exportToFile)
                    this.odometerBetweenDateExport = items;
                else
                {
                    this.odometerBetweenDateList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('OdometerBetweenDates.Error.Get.Message');
            log.error(e);
        } finally {
            getOdometerBetweenDatesRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
