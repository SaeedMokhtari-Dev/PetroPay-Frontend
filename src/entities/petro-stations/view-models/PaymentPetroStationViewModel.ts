import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import PetroStationStore from "../stores/PetroStationStore";
import PaymentPetroStationRequest from "../handlers/payment/PaymentPetroStationRequest";
import PaymentPetroStationHandler from "../handlers/payment/PaymentPetroStationHandler";

export default class PaymentPetroStationViewModel
{
    isProcessing: boolean;
    errorMessage: string;

    paymentPetroStationRequest: PaymentPetroStationRequest;

    constructor(public petroStationStore: PetroStationStore) {
        makeAutoObservable(this);
    }
    public async paymentPetroStation(request: PaymentPetroStationRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await PaymentPetroStationHandler.payment(request);

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
            this.errorMessage = i18next.t('PetroStations.Error.Payment.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
