import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import ListCompanyResponse from "../handlers/list/ListCompanyResponse";
import ListCompanyRequest from "../handlers/list/ListCompanyRequest";
import ListCompanyHandler from "../handlers/list/ListCompanyHandler";

export default class ListCompanyViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listCompanyResponse: ListCompanyResponse = new ListCompanyResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getCompanyList()  {
        try {
            this.isProcessing = true;

            let request = new ListCompanyRequest();
            let response = await ListCompanyHandler.get(request);

            if (response && response.success) {
                
                this.listCompanyResponse = new ListCompanyResponse();
                let result = response.data;
                //let items = result.items;
                this.listCompanyResponse.items = result;

                return this.listCompanyResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Companies.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
