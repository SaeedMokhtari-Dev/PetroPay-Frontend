import CarTransactionItem from "../handlers/get/CarTransactionItem";
import CarTransactionStore from "../stores/CarTransactionStore";
import {makeAutoObservable} from "mobx";
import GetCarTransactionRequest from "../handlers/get/GetCarTransactionRequest";
import GetCarTransactionHandler from "../handlers/get/GetCarTransactionHandler";
import GetCarTransactionResponse from "../handlers/get/GetCarTransactionResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetCarTransactionViewModel {
    columns: any[];
    carTransactionList: CarTransactionItem[];
    carTransactionExport: CarTransactionItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getCarTransactionsRequest: GetCarTransactionRequest;

    constructor(public carTransactionStore: CarTransactionStore) {
        makeAutoObservable(this);

    }

    public async getAllCarTransaction(getCarTransactionsRequest: GetCarTransactionRequest, exportToFile: boolean = false) {
        try {
            debugger;
            this.isProcessing = true;
            getCarTransactionsRequest.exportToFile = exportToFile;
            let response = await GetCarTransactionHandler.get(getCarTransactionsRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;

                if(exportToFile)
                    this.carTransactionExport = items;
                else
                {
                    this.carTransactionList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarTransactions.Error.Get.Message');
            log.error(e);
        } finally {
            getCarTransactionsRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
