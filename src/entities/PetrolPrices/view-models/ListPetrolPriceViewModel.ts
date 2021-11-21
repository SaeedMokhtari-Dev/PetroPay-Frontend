import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListPetrolPriceRequest from "../handlers/list/ListPetrolPriceRequest";
import ListPetrolPriceHandler from "../handlers/list/ListPetrolPriceHandler";
import ListPetrolPriceResponse from "../handlers/list/ListPetrolPriceResponse";

export default class ListPetrolPriceViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listPetrolPriceResponse: ListPetrolPriceResponse;


    constructor() {
        makeAutoObservable(this);
    }

    public async getPetrolPriceList()  {
        try {
            this.isProcessing = true;

            let request = new ListPetrolPriceRequest();
            let response = await ListPetrolPriceHandler.get(request);

            if (response && response.success) {
                
                this.listPetrolPriceResponse = new ListPetrolPriceResponse();
                let result = response.data;
                this.listPetrolPriceResponse.items = result;

                return this.listPetrolPriceResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetrolPrices.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
