import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListCarModelMasterRequest from "../handlers/list/ListCarModelMasterRequest";
import ListCarModelMasterHandler from "../handlers/list/ListCarModelMasterHandler";
import ListCarModelMasterResponse from "../handlers/list/ListCarModelMasterResponse";

export default class ListCarModelMasterViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listCarModelMasterResponse: ListCarModelMasterResponse;


    constructor() {
        makeAutoObservable(this);
    }

    public async getCarModelMasterList()  {
        try {
            this.isProcessing = true;

            let request = new ListCarModelMasterRequest();
            let response = await ListCarModelMasterHandler.get(request);

            if (response && response.success) {
                
                this.listCarModelMasterResponse = new ListCarModelMasterResponse();
                let result = response.data;
                this.listCarModelMasterResponse.items = result;

                return this.listCarModelMasterResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CarModelMasters.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
