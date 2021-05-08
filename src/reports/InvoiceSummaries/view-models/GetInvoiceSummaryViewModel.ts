import InvoiceSummaryItem from "../handlers/get/InvoiceSummaryItem";
import InvoiceSummaryStore from "../stores/InvoiceSummaryStore";
import {makeAutoObservable} from "mobx";
import GetInvoiceSummaryRequest from "../handlers/get/GetInvoiceSummaryRequest";
import GetInvoiceSummaryHandler from "../handlers/get/GetInvoiceSummaryHandler";
import GetInvoiceSummaryResponse from "../handlers/get/GetInvoiceSummaryResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetInvoiceSummaryViewModel {
    columns: any[];
    invoiceSummaryList: InvoiceSummaryItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    getInvoiceSummariesRequest: GetInvoiceSummaryRequest;

    constructor(public invoiceSummaryStore: InvoiceSummaryStore) {
        makeAutoObservable(this);

    }

    public async getAllInvoiceSummary(getInvoiceSummariesRequest: GetInvoiceSummaryRequest) {
        try {
            this.isProcessing = true;
            let response = await GetInvoiceSummaryHandler.get(getInvoiceSummariesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.invoiceSummaryList = items;
                this.totalSize = result.totalCount;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('InvoiceSummaries.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }

}
