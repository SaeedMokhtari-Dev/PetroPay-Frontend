import {makeAutoObservable} from "mobx";
import DetailSubscriptionResponse from "../handlers/detail/DetailSubscriptionResponse";
import GetSubscriptionHandler from "../handlers/get/GetSubscriptionHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailSubscriptionHandler from "../handlers/detail/DetailSubscriptionHandler";
import DetailSubscriptionRequest from "../handlers/detail/DetailSubscriptionRequest";
import AddSubscriptionRequest from "../handlers/add/AddSubscriptionRequest";
import EditSubscriptionRequest from "../handlers/edit/EditSubscriptionRequest";
import AddSubscriptionHandler from "../handlers/add/AddSubscriptionHandler";
import {message} from "antd";
import GetSubscriptionRequest from "../handlers/get/GetSubscriptionRequest";
import EditSubscriptionHandler from "../handlers/edit/EditSubscriptionHandler";
import UserContext from "../../../identity/contexts/UserContext";
import SubscriptionStore from "../stores/SubscriptionStore";

export default class EditSubscriptionViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailSubscriptionResponse: DetailSubscriptionResponse;
    addSubscriptionRequest: AddSubscriptionRequest;
    editSubscriptionRequest: EditSubscriptionRequest;

    constructor(public subscriptionStore: SubscriptionStore) {
        makeAutoObservable(this);
    }
    public async getDetailSubscription(subscriptionId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailSubscriptionRequest(subscriptionId);
            let response = await DetailSubscriptionHandler.detail(request);

            if(response && response.success)
            {

                this.detailSubscriptionResponse = new DetailSubscriptionResponse().deserialize(response.data);
                this.editSubscriptionRequest = new EditSubscriptionRequest();
                for ( let i in this.editSubscriptionRequest )
                    if ( this.detailSubscriptionResponse.hasOwnProperty( i ) )
                        this.editSubscriptionRequest[i] = this.detailSubscriptionResponse[i];


                return this.detailSubscriptionResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Subscriptiones.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addSubscription(request: AddSubscriptionRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            request.companyId = UserContext.info.id;
            let response = await AddSubscriptionHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.subscriptionsStore.getSubscriptionViewModel.getAllSubscriptions(new GetSubscriptionsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Subscriptiones.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editSubscription(request: EditSubscriptionRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditSubscriptionHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.subscriptionsStore.getSubscriptionViewModel.getAllSubscriptions(new GetSubscriptionsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Subscriptiones.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
