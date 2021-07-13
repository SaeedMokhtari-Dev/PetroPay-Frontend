import OdometerHistoryItem from "../handlers/get/OdometerHistoryItem";
import OdometerHistoryStore from "../stores/OdometerHistoryStore";
import {makeAutoObservable} from "mobx";
import GetOdometerHistoryRequest from "../handlers/get/GetOdometerHistoryRequest";
import GetOdometerHistoryHandler from "../handlers/get/GetOdometerHistoryHandler";
import GetOdometerHistoryResponse from "../handlers/get/GetOdometerHistoryResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetOdometerHistoryViewModel {
    columns: any[];
    odometerHistoryList: OdometerHistoryItem[];
    odometerHistoryExport: OdometerHistoryItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getOdometerHistoriesRequest: GetOdometerHistoryRequest;

    constructor(public odometerHistoryStore: OdometerHistoryStore) {
        makeAutoObservable(this);

    }

    public async getAllOdometerHistory(getOdometerHistoriesRequest: GetOdometerHistoryRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getOdometerHistoriesRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }

            this.isProcessing = true;
            getOdometerHistoriesRequest.exportToFile = exportToFile;
            let response = await GetOdometerHistoryHandler.get(getOdometerHistoriesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;

                if(exportToFile)
                    this.odometerHistoryExport = items;
                else
                {
                    this.odometerHistoryList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('OdometerHistories.Error.Get.Message');
            log.error(e);
        } finally {
            getOdometerHistoriesRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
