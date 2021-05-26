import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import AddTransferBalanceRequest from "../handlers/add/AddTransferBalanceRequest";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import TransferBalanceStore from "../stores/TransferBalanceStore";
import AddTransferBalanceHandler from "../handlers/add/AddTransferBalanceHandler";

export default class EditTransferBalanceViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    addTransferBalanceRequest: AddTransferBalanceRequest;

    constructor(public transferBalanceStore: TransferBalanceStore) {
        makeAutoObservable(this);
    }
    public async addTransferBalance(request: AddTransferBalanceRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            request.companyId = UserContext.info.id;
            let response = await AddTransferBalanceHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message), 5);
                /*await this.transferBalancesStore.getTransferBalanceViewModel.getAllTransferBalances(new GetTransferBalancesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('TransferBalances.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
