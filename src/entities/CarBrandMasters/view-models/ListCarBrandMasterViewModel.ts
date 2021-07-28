import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListCarBrandMasterRequest from "../handlers/list/ListCarBrandMasterRequest";
import ListCarBrandMasterHandler from "../handlers/list/ListCarBrandMasterHandler";
import ListCarBrandMasterResponse from "../handlers/list/ListCarBrandMasterResponse";

export default class ListCarBrandMasterViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listCarBrandMasterResponse: ListCarBrandMasterResponse;


    constructor() {
        makeAutoObservable(this);
    }

    public async getCarBrandMasterList()  {
        try {
            this.isProcessing = true;

            let request = new ListCarBrandMasterRequest();
            let response = await ListCarBrandMasterHandler.get(request);

            if (response && response.success) {
                
                this.listCarBrandMasterResponse = new ListCarBrandMasterResponse();
                let result = response.data;
                this.listCarBrandMasterResponse.items = result;

                return this.listCarBrandMasterResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarBrandMasters.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
