import BranchStore from "../stores/BranchStore";
import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import ListBranchRequest from "../handlers/list/ListBranchRequest";
import ListBranchHandler from "../handlers/list/ListBranchHandler";
import ListBranchResponse from "../handlers/list/ListBranchResponse";

export default class ListBranchViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    listBranchResponse: ListBranchResponse = new ListBranchResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getBranchList(companyId?: number)  {
        try {
            this.isProcessing = true;

            let request = new ListBranchRequest(companyId);
            let response = await ListBranchHandler.get(request);

            if (response && response.success) {
                debugger;
                this.listBranchResponse = new ListBranchResponse();
                let result = response.data;
                //let items = result.items;
                this.listBranchResponse.items = result;

                return this.listBranchResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Branches.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
