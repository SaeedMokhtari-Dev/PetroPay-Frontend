import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListCarTypeMasterRequest from "../handlers/list/ListCarTypeMasterRequest";
import ListCarTypeMasterHandler from "../handlers/list/ListCarTypeMasterHandler";
import ListCarTypeMasterResponse from "../handlers/list/ListCarTypeMasterResponse";

export default class ListCarTypeMasterViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listCarTypeMasterResponse: ListCarTypeMasterResponse;


    constructor() {
        makeAutoObservable(this);
    }

    public async getCarTypeMasterList()  {
        try {
            this.isProcessing = true;

            let request = new ListCarTypeMasterRequest();
            let response = await ListCarTypeMasterHandler.get(request);

            if (response && response.success) {
                
                this.listCarTypeMasterResponse = new ListCarTypeMasterResponse();
                let result = response.data;
                this.listCarTypeMasterResponse.items = result;

                return this.listCarTypeMasterResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarTypeMasters.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
