import {makeAutoObservable} from "mobx";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import GetCustomerRequest from "../handlers/get/GetCustomerRequest";
import GetCustomerHandler from "../handlers/get/GetCustomerHandler";
import CustomerStore from "../stores/CustomerStore";
import CompanyBranchItem from "../handlers/get/CompanyBranchItem";
import CompanySubscriptionItem from "../handlers/get/CompanySubscriptionItem";
import {getLocalizedString} from "../../app/utils/Localization";

export default class GetCustomerViewModel {
    isProcessing: boolean;
    errorMessage: string;

    getCustomerRequest: GetCustomerRequest;

    companyBranchItems: CompanyBranchItem[];
    companySubscriptionItems: CompanySubscriptionItem[];
    totalCustomerBalance: number;
    totalCarBalance: number;
    totalBranchBalance: number;

    constructor(public customerStore: CustomerStore) {
        makeAutoObservable(this);

    }

    public async getDashboardData(getCustomerRequest: GetCustomerRequest) {
        try {
            this.isProcessing = true;
            let response = await GetCustomerHandler.get(getCustomerRequest);

            if (response && response.success) {
                let result = response.data;
                this.companyBranchItems = [];
                this.companyBranchItems = result.companyBranchItems;
                this.companySubscriptionItems = [];
                this.companySubscriptionItems = result.companySubscriptionItems;
                this.totalCarBalance = result.totalCarBalance;
                this.totalBranchBalance = result.totalBranchBalance;
                this.totalCustomerBalance = result.totalCustomerBalance;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Customers.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
