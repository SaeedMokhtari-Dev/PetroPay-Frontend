import SubscriptionItem from "../handlers/get/SubscriptionItem";
import AddSubscriptionRequest from "../handlers/add/AddSubscriptionRequest";
import SubscriptionStore from "../stores/SubscriptionStore";
import {makeAutoObservable} from "mobx";
import GetSubscriptionRequest from "../handlers/get/GetSubscriptionRequest";
import GetSubscriptionHandler from "../handlers/get/GetSubscriptionHandler";
import GetSubscriptionResponse from "../handlers/get/GetSubscriptionResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteSubscriptionHandler from "../handlers/delete/DeleteSubscriptionHandler";
import DeleteSubscriptionRequest from "../handlers/delete/DeleteSubscriptionRequest";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";
import ActiveSubscriptionHandler from "../handlers/active/ActiveSubscriptionHandler";
import ActiveSubscriptionRequest from "../handlers/active/ActiveSubscriptionRequest";
import RejectSubscriptionRequest from "../handlers/reject/RejectSubscriptionRequest";
import RejectSubscriptionHandler from "../handlers/reject/RejectSubscriptionHandler";

export default class GetSubscriptionViewModel {
    columns: any[];
    subscriptionList: SubscriptionItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    addSubscriptionRequest: AddSubscriptionRequest = new AddSubscriptionRequest();
    addedSuccessfully: boolean;
    getSubscriptionsRequest: GetSubscriptionRequest = new GetSubscriptionRequest();

    constructor(public subscriptionStore: SubscriptionStore) {
        makeAutoObservable(this);

    }

    public async getAllSubscription(getSubscriptionsRequest: GetSubscriptionRequest) {
        try {
            this.isProcessing = true;
            let response = await GetSubscriptionHandler.get(getSubscriptionsRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.subscriptionList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('Subscriptions.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteSubscription(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteSubscriptionRequest();
            request.subscriptionId = key;
            let response = await DeleteSubscriptionHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                this.getSubscriptionsRequest = new GetSubscriptionRequest();
                this.getSubscriptionsRequest.pageIndex = this.pageIndex;
                this.getSubscriptionsRequest.pageSize = this.pageSize;
                if(UserContext.info.role == 1)
                    this.getSubscriptionsRequest.companyId = UserContext.info.id;
                await this.getAllSubscription(this.getSubscriptionsRequest);
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Subscriptions.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async activeSubscription(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new ActiveSubscriptionRequest();
            request.subscriptionId = key;
            let response = await ActiveSubscriptionHandler.active(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                this.getSubscriptionsRequest = new GetSubscriptionRequest();
                this.getSubscriptionsRequest.pageIndex = this.pageIndex;
                this.getSubscriptionsRequest.pageSize = this.pageSize;
                if(UserContext.info.role == 1)
                    this.getSubscriptionsRequest.companyId = UserContext.info.id;
                await this.getAllSubscription(this.getSubscriptionsRequest);
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Subscriptions.Error.Active.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

    public async rejectSubscription(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new RejectSubscriptionRequest();
            request.subscriptionId = key;
            let response = await RejectSubscriptionHandler.reject(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                this.getSubscriptionsRequest = new GetSubscriptionRequest();
                this.getSubscriptionsRequest.pageIndex = this.pageIndex;
                this.getSubscriptionsRequest.pageSize = this.pageSize;
                if(UserContext.info.role == 1)
                    this.getSubscriptionsRequest.companyId = UserContext.info.id;
                await this.getAllSubscription(this.getSubscriptionsRequest);
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Subscriptions.Error.Reject.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
