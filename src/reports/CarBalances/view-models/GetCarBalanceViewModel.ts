import CarBalanceItem from "../handlers/get/CarBalanceItem";
import CarBalanceStore from "../stores/CarBalanceStore";
import {makeAutoObservable} from "mobx";
import GetCarBalanceRequest from "../handlers/get/GetCarBalanceRequest";
import GetCarBalanceHandler from "../handlers/get/GetCarBalanceHandler";
import GetCarBalanceResponse from "../handlers/get/GetCarBalanceResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetCarBalanceViewModel {
    columns: any[];
    carBalanceList: CarBalanceItem[];
    carBalanceExport: CarBalanceItem[];
    sumCarBalance: number;
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getCarBalancesRequest: GetCarBalanceRequest;

    constructor(public carBalanceStore: CarBalanceStore) {
        makeAutoObservable(this);

    }

    public async getAllCarBalance(getCarBalancesRequest: GetCarBalanceRequest, exportToFile: boolean = false) {
        try {
            this.isProcessing = true;
            getCarBalancesRequest.exportToFile = exportToFile;
            let response = await GetCarBalanceHandler.get(getCarBalancesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                if(exportToFile)
                    this.carBalanceExport = items;
                else {
                    this.carBalanceList = items;
                    this.totalSize = result.totalCount;
                    this.sumCarBalance = result.sumCarBalance;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarBalances.Error.Get.Message');
            log.error(e);
        } finally {
            getCarBalancesRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
