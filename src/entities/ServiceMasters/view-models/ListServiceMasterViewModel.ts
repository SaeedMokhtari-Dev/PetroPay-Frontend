import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListServiceMasterRequest from "../handlers/list/ListServiceMasterRequest";
import ListServiceMasterHandler from "../handlers/list/ListServiceMasterHandler";
import ListServiceMasterResponse from "../handlers/list/ListServiceMasterResponse";

export default class ListServiceMasterViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listServiceMasterResponse: ListServiceMasterResponse = new ListServiceMasterResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getServiceMasterList()  {
        try {
            this.isProcessing = true;

            let request = new ListServiceMasterRequest();
            let response = await ListServiceMasterHandler.get(request);

            if (response && response.success) {
                
                this.listServiceMasterResponse = new ListServiceMasterResponse();
                let result = response.data;
                //let items = result.items;
                this.listServiceMasterResponse.items = result;

                return this.listServiceMasterResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('ServiceMasters.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
