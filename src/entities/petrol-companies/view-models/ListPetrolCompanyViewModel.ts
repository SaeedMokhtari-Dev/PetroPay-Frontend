import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import ListPetrolCompanyResponse from "../handlers/list/ListPetrolCompanyResponse";
import ListPetrolCompanyRequest from "../handlers/list/ListPetrolCompanyRequest";
import ListPetrolCompanyHandler from "../handlers/list/ListPetrolCompanyHandler";

export default class ListPetrolCompanyViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listPetrolCompanyResponse: ListPetrolCompanyResponse = new ListPetrolCompanyResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getPetrolCompanyList()  {
        try {
            this.isProcessing = true;

            let request = new ListPetrolCompanyRequest();
            let response = await ListPetrolCompanyHandler.get(request);

            if (response && response.success) {
                
                this.listPetrolCompanyResponse = new ListPetrolCompanyResponse();
                let result = response.data;
                //let items = result.items;
                this.listPetrolCompanyResponse.items = result;

                return this.listPetrolCompanyResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetrolCompanies.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
