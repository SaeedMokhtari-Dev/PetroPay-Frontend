import PetropayAccountItem from "../handlers/get/PetropayAccountItem";
import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import PetropayAccountStore from "../stores/PetropayAccountStore";
import GetPetropayAccountsRequest from "../handlers/get/GetPetropayAccountsRequest";
import GetPetropayAccountsHandler from "../handlers/get/GetPetropayAccountsHandler";
import CarTransactionItem from "../../../reports/CarTransactions/handlers/get/CarTransactionItem";
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetPetropayAccountViewModel {
    columns: any[];
    petropayAccountList: PetropayAccountItem[];
    petropayAccountExport: CarTransactionItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;

    getPetropayAccountsRequest: GetPetropayAccountsRequest = new GetPetropayAccountsRequest();

    constructor(public petropayAccountsStore: PetropayAccountStore) {
        makeAutoObservable(this);

    }

    public async getAllPetropayAccounts(getPetropayAccountsRequest: GetPetropayAccountsRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            /*if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getCarTransactionsRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }*/

            this.isProcessing = true;
            getPetropayAccountsRequest.exportToFile = exportToFile;
            let response = await GetPetropayAccountsHandler.get(getPetropayAccountsRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;

                if(exportToFile)
                    this.petropayAccountExport = items;
                else {
                    this.petropayAccountList = items;
                    this.totalSize = result.totalCount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetropayAccounts.Error.Get.Message');
            log.error(e);
        } finally {
            getPetropayAccountsRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
