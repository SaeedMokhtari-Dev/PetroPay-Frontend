import InvoiceDetailStore from "../stores/InvoiceDetailStore";
import {makeAutoObservable} from "mobx";
import GetInvoiceDetailRequest from "../handlers/get/GetInvoiceDetailRequest";
import GetInvoiceDetailHandler from "../handlers/get/GetInvoiceDetailHandler";
import GetInvoiceDetailResponse from "../handlers/get/GetInvoiceDetailResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class GetInvoiceDetailViewModel {

    isProcessing: boolean;
    errorMessage: string;
    invoiceDetailResponse: GetInvoiceDetailResponse;

    constructor(public invoiceDetailStore: InvoiceDetailStore) {
        makeAutoObservable(this);

    }

    public async getInvoiceDetail(invoiceId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;


            let request = new GetInvoiceDetailRequest(invoiceId);
            let response = await GetInvoiceDetailHandler.get(request);

            if(response && response.success)
            {
                this.invoiceDetailResponse = new GetInvoiceDetailResponse().deserialize(response.data);
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Branches.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
