import CarStore from "../stores/CarStore";
import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListCarRequest from "../handlers/list/ListCarRequest";
import ListCarHandler from "../handlers/list/ListCarHandler";
import ListCarResponse from "../handlers/list/ListCarResponse";

export default class ListCarViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listCarResponse: ListCarResponse = new ListCarResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getCarList(companyId?: number, branchId?: number)  {
        try {
            
            this.isProcessing = true;

            let request = new ListCarRequest(companyId, branchId);
            let response = await ListCarHandler.get(request);

            if (response && response.success) {

                this.listCarResponse = new ListCarResponse();
                let result = response.data;
                //let items = result.items;
                this.listCarResponse.items = result;

                return this.listCarResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Cars.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
