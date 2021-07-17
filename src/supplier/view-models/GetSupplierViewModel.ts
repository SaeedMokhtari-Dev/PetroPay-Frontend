import {makeAutoObservable} from "mobx";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import GetSupplierRequest from "../handlers/get/GetSupplierRequest";
import GetSupplierHandler from "../handlers/get/GetSupplierHandler";
import SupplierStore from "../stores/SupplierStore";
import {getLocalizedString} from "../../app/utils/Localization";

export default class GetSupplierViewModel {
    isProcessing: boolean;
    errorMessage: string;

    getSupplierRequest: GetSupplierRequest;

    stationBalance: number;
    stationBonusBalance: number;

    constructor(public supplierStore: SupplierStore) {
        makeAutoObservable(this);

    }

    public async getDashboardData(getSupplierRequest: GetSupplierRequest) {
        try {
            this.isProcessing = true;
            let response = await GetSupplierHandler.get(getSupplierRequest);

            if (response && response.success) {
                let result = response.data;
                this.stationBalance = result.stationBalance;
                this.stationBonusBalance = result.stationBonusBalance;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Supplier.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
