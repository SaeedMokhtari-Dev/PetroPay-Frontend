import {makeAutoObservable} from "mobx";
import GetCurrentUserBalanceRequest from "../handlers/get/GetCurrentUserBalanceRequest";
import GetCurrentUserBalanceHandler from "../handlers/get/GetCurrentUserBalanceHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class GetCurrentUserBalanceViewModel {
    errorMessage: string;
    balance: number;

    constructor() {
        makeAutoObservable(this);
    }

    public async getCurrentUserBalance() {
        try {
            let response = await GetCurrentUserBalanceHandler.get(new GetCurrentUserBalanceRequest());

            if (response && response.success) {
                this.balance = response.data?.balance ?? 0;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('CurrentUserBalances.Error.Get.Message');
            log.error(e);
        } finally {
        }
    }

}
