import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import TransferBalanceStore from "../stores/TransferBalanceStore";
import CarBatchTransferBalanceHandler from "../handlers/carBatch/CarBatchTransferBalanceHandler";
import CarBatchTransferBalanceRequest from "../handlers/carBatch/CarBatchTransferBalanceRequest";

export default class CarBatchTransferBalanceViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;

    carBatchTransferBalanceRequest: CarBatchTransferBalanceRequest;

    constructor(public transferBalanceStore: TransferBalanceStore) {
        makeAutoObservable(this);
    }
    public async carBatchTransferBalance(request: CarBatchTransferBalanceRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            if(UserContext.info.role === 5) request.branchId = UserContext.info.id;

            let response = await CarBatchTransferBalanceHandler.carBatch(request);

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
