import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import PetropayAccountStore from "../stores/PetropayAccountStore";
import PaymentPetropayAccountRequest from "../handlers/payment/PaymentPetropayAccountRequest";
import PaymentPetropayAccountHandler from "../handlers/payment/PaymentPetropayAccountHandler";

export default class PaymentPetropayAccountViewModel
{
    isProcessing: boolean;
    errorMessage: string;

    paymentPetropayAccountRequest: PaymentPetropayAccountRequest;

    constructor(public petroStationStore: PetropayAccountStore) {
        makeAutoObservable(this);
    }
    public async paymentPetropayAccount(request: PaymentPetropayAccountRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await PaymentPetropayAccountHandler.payment(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetropayAccounts.Error.Payment.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
