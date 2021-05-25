import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListPetropayAccountRequest from "../handlers/list/ListPetropayAccountRequest";
import ListPetropayAccountHandler from "../handlers/list/ListPetropayAccountHandler";
import ListPetropayAccountResponse from "../handlers/list/ListPetropayAccountResponse";

export default class ListPetropayAccountViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listPetropayAccountResponse: ListPetropayAccountResponse;


    constructor() {
        makeAutoObservable(this);
    }

    public async getPetropayAccountList()  {
        try {
            this.isProcessing = true;

            let request = new ListPetropayAccountRequest();
            let response = await ListPetropayAccountHandler.get(request);

            if (response && response.success) {
                debugger;
                this.listPetropayAccountResponse = new ListPetropayAccountResponse();
                let result = response.data;
                //let items = result.items;
                this.listPetropayAccountResponse.items = result;

                return this.listPetropayAccountResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetropayAccounts.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
