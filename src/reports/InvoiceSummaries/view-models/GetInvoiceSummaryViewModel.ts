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
import ObjectHelper from "../../../app/utils/ObjectHelper";

export default class GetInvoiceSummaryViewModel {
    columns: any[];
    invoiceSummaryList: InvoiceSummaryItem[];
    invoiceSummaryExport: InvoiceSummaryItem[];
    totalSize: number;
    sumInvoiceAmount: number;
    isProcessing: boolean;
    errorMessage: string;
    getInvoiceSummariesRequest: GetInvoiceSummaryRequest = new GetInvoiceSummaryRequest();

    constructor(public invoiceSummaryStore: InvoiceSummaryStore) {
        makeAutoObservable(this);

    }

    public async getAllInvoiceSummary(getInvoiceSummariesRequest: GetInvoiceSummaryRequest, exportToFile: boolean = false) {
        try {
            this.errorMessage = "";
            if(ObjectHelper.isNullOrEmptyWithDefaultExceptions(getInvoiceSummariesRequest, [])){
                this.errorMessage = i18next.t("General.Search.AtLeastOne");
                return;
            }
            this.isProcessing = true;
            if(exportToFile)
                getInvoiceSummariesRequest.exportToFile = exportToFile;
            let response = await GetInvoiceSummaryHandler.get(getInvoiceSummariesRequest);

            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                if(exportToFile)
                    this.invoiceSummaryExport = items;
                else {
                    this.invoiceSummaryList = items;
                    this.totalSize = result.totalCount;
                    this.sumInvoiceAmount = result.sumInvoiceAmount;
                }
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('InvoiceSummaries.Error.Get.Message');
            log.error(e);
        } finally {
            getInvoiceSummariesRequest.exportToFile = false;
            this.isProcessing = false;
        }
    }

}
