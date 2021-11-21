import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import InvoiceSubscriptionResponse from "../handlers/invoice/InvoiceSubscriptionResponse";
import InvoiceSubscriptionRequest from "../handlers/invoice/InvoiceSubscriptionRequest";
import InvoiceSubscriptionHandler from "../handlers/invoice/InvoiceSubscriptionHandler";

export default class InvoiceSubscriptionViewModel {
    
    isProcessing: boolean;
    errorMessage: string;
    invoiceSubscriptionResponse: InvoiceSubscriptionResponse = new InvoiceSubscriptionResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getInvoiceSubscription(subscriptionInvoiceId?: number)  {
        try {
            
            this.isProcessing = true;
            debugger;
            let request = new InvoiceSubscriptionRequest(subscriptionInvoiceId.toString());
            let response = await InvoiceSubscriptionHandler.detail(request);

            if (response && response.success) {

                this.invoiceSubscriptionResponse = new InvoiceSubscriptionResponse();
                let result = response.data;
                this.invoiceSubscriptionResponse = result;

                return this.invoiceSubscriptionResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Subscriptions.Invoice.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
