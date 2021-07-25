import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import TransferBonusStore from "../stores/TransferBonusStore";
import AddTransferBonusRequest from "../handlers/add/AddTransferBonusRequest";
import AddTransferBonusHandler from "../handlers/add/AddTransferBonusHandler";

export default class AddTransferBonusViewModel
{
    isProcessing: boolean;
    errorMessage: string;

    addTransferBonusRequest: AddTransferBonusRequest;

    constructor(public petroStationStore: TransferBonusStore) {
        makeAutoObservable(this);
    }
    public async addTransferBonus(request: AddTransferBonusRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddTransferBonusHandler.add(request);

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
            this.errorMessage = i18next.t('TransferBonuses.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
