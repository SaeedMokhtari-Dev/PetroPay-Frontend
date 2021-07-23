import RechargeBalanceItem from "../handlers/get/RechargeBalanceItem";
import AddRechargeBalanceRequest from "../handlers/add/AddRechargeBalanceRequest";
import RechargeBalanceStore from "../stores/RechargeBalanceStore";
import {makeAutoObservable} from "mobx";
import GetRechargeBalanceRequest from "../handlers/get/GetRechargeBalanceRequest";
import GetRechargeBalanceHandler from "../handlers/get/GetRechargeBalanceHandler";
import GetRechargeBalanceResponse from "../handlers/get/GetRechargeBalanceResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteRechargeBalanceHandler from "../handlers/delete/DeleteRechargeBalanceHandler";
import DeleteRechargeBalanceRequest from "../handlers/delete/DeleteRechargeBalanceRequest";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import ConfirmRechargeBalanceHandler from "../handlers/confirm/ConfirmRechargeBalanceHandler";
import ConfirmRechargeBalanceRequest from "../handlers/confirm/ConfirmRechargeBalanceRequest";
import GetSubscriptionRequest from "../../Subscriptions/handlers/get/GetSubscriptionRequest";

export default class GetRechargeBalanceViewModel {
    columns: any[];
    rechargeBalanceList: RechargeBalanceItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;

    addRechargeBalanceRequest: AddRechargeBalanceRequest = new AddRechargeBalanceRequest();
    addedSuccessfully: boolean;
    getRechargeBalancesRequest: GetRechargeBalanceRequest = new GetRechargeBalanceRequest();

    constructor(public rechargeBalanceStore: RechargeBalanceStore) {
        makeAutoObservable(this);

    }

    public async getAllRechargeBalance(getRechargeBalancesRequest: GetRechargeBalanceRequest) {
        try {
            this.isProcessing = true;
            let response = await GetRechargeBalanceHandler.get(getRechargeBalancesRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.rechargeBalanceList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('RechargeBalances.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteRechargeBalance(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteRechargeBalanceRequest();
            request.rechargeId = key;
            let response = await DeleteRechargeBalanceHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                if(UserContext.info.role == 1)
                    this.getRechargeBalancesRequest.companyId = UserContext.info.id;
                await this.getAllRechargeBalance(this.getRechargeBalancesRequest);

            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('RechargeBalances.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async confirmRechargeBalance(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new ConfirmRechargeBalanceRequest();
            request.rechargeId = key;
            let response = await ConfirmRechargeBalanceHandler.confirm(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                if(UserContext.info.role == 1)
                    this.getRechargeBalancesRequest.companyId = UserContext.info.id;
                await this.getAllRechargeBalance(this.getRechargeBalancesRequest);

            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('RechargeBalances.Error.Confirm.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
