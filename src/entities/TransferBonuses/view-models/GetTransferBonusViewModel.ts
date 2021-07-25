import TransferBonusItem from "../handlers/get/TransferBonusItem";
import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import TransferBonusStore from "../stores/TransferBonusStore";
import GetTransferBonusesRequest from "../handlers/get/GetTransferBonusesRequest";
import GetTransferBonusesHandler from "../handlers/get/GetTransferBonusesHandler";
import CarTransactionItem from "../../../reports/CarTransactions/handlers/get/CarTransactionItem";

export default class GetTransferBonusViewModel {
    columns: any[];
    transferBonusList: TransferBonusItem[];
    transferBonusExport: CarTransactionItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;

    getTransferBonusesRequest: GetTransferBonusesRequest = new GetTransferBonusesRequest();

    constructor(public transferBonusesStore: TransferBonusStore) {
        makeAutoObservable(this);

    }

    public async getAllTransferBonuses(getTransferBonusesRequest: GetTransferBonusesRequest) {
        try {
            this.errorMessage = "";
            /*if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getCarTransactionsRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }*/

            this.isProcessing = true;
            //getTransferBonusesRequest.exportToFile = exportToFile;
            let response = await GetTransferBonusesHandler.get(getTransferBonusesRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.transferBonusList = items;
                this.totalSize = result.totalCount;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('TransferBonuses.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }

}
