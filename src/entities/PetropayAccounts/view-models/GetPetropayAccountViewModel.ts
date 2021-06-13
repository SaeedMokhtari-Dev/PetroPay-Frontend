import PetropayAccountItem from "../handlers/get/PetropayAccountItem";
import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import PetropayAccountStore from "../stores/PetropayAccountStore";
import GetPetropayAccountsRequest from "../handlers/get/GetPetropayAccountsRequest";
import GetPetropayAccountsHandler from "../handlers/get/GetPetropayAccountsHandler";

export default class GetPetropayAccountViewModel {
    columns: any[];
    petropayAccountList: PetropayAccountItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    constructor(public petropayAccountsStore: PetropayAccountStore) {
        makeAutoObservable(this);

    }

    public async getAllPetropayAccounts(getPetropayAccountsRequest: GetPetropayAccountsRequest) {
        try {
            this.isProcessing = true;
            let response = await GetPetropayAccountsHandler.get(getPetropayAccountsRequest);


            if (response && response.success) {
                let result = response.data;
                let items = result.items;
                this.petropayAccountList = items;
                this.totalSize = result.totalCount;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetropayAccounts.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }

}
