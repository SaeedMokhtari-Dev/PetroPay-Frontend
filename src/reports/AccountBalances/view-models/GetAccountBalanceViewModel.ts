import AccountBalanceItem from "../handlers/get/AccountBalanceItem";
import AccountBalanceStore from "../stores/AccountBalanceStore";
import {makeAutoObservable} from "mobx";
import GetAccountBalanceRequest from "../handlers/get/GetAccountBalanceRequest";
import GetAccountBalanceHandler from "../handlers/get/GetAccountBalanceHandler";
import GetAccountBalanceResponse from "../handlers/get/GetAccountBalanceResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetAccountBalanceViewModel {
    columns: any[];
    accountBalanceList: AccountBalanceItem[];
    accountBalanceExport: AccountBalanceItem[];
    sumAccountBalance: number;
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getAccountBalancesRequest: GetAccountBalanceRequest;

    constructor(public accountBalanceStore: AccountBalanceStore) {
        makeAutoObservable(this);

    }

    public async getAllAccountBalance(getAccountBalancesRequest: GetAccountBalanceRequest, exportToFile: boolean = false) {
        try {
            this.isProcessing = true;
            getAccountBalancesRequest.exportToFile = exportToFile;
            let response = await GetAccountBalanceHandler.get(getAccountBalancesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                if(exportToFile)
                    this.accountBalanceExport = items;
                else {
                    this.accountBalanceList = items;
                    this.totalSize = result.totalCount;
                    this.sumAccountBalance = result.sumAccountBalance;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('AccountBalances.Error.Get.Message');
            log.error(e);
        } finally {
            getAccountBalancesRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
