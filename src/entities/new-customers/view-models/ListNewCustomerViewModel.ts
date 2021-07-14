import NewCustomerItem from "../handlers/get/NewCustomerItem";

import {makeAutoObservable} from "mobx";
import GetNewCustomerRequest from "../handlers/get/GetNewCustomerRequest";
import GetNewCustomerHandler from "../handlers/get/GetNewCustomerHandler";

import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class ListNewCustomerViewModel {
    newCustomerList: NewCustomerItem[];
    isProcessing: boolean;
    errorMessage: string;

    constructor() {
        makeAutoObservable(this);
    }

    public async getAllNewCustomers() {
        try {
            this.isProcessing = true;
            const getNewCustomersRequest: GetNewCustomerRequest = new GetNewCustomerRequest(10000, 0);

            let response = await GetNewCustomerHandler.get(getNewCustomersRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.newCustomerList = items;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('NewCustomers.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
