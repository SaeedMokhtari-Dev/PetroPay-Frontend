import {makeAutoObservable} from "mobx";

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
import CalculateSubscriptionRequest from "../handlers/calculate/CalculateSubscriptionRequest";
import CalculateSubscriptionHandler from "../handlers/calculate/CalculateSubscriptionHandler";
import CalculateSubscriptionResponse from "../handlers/calculate/CalculateSubscriptionResponse";
import DetailSubscriptionResponse from "../handlers/detail/DetailSubscriptionResponse";
import SubscriptionStore from "../stores/SubscriptionStore";
import AddCarRequest from "../../cars/handlers/add/AddCarRequest";
import AddCarHandler from "../../cars/handlers/add/AddCarHandler";
import CarAddSubscriptionRequest from "../handlers/carAdd/CarAddSubscriptionRequest";
import CarAddSubscriptionHandler from "../handlers/carAdd/CarAddSubscriptionHandler";

export default class EditSubscriptionViewModel
{
    isProcessing: boolean;
    calculating: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailSubscriptionResponse: DetailSubscriptionResponse;
    addSubscriptionRequest: AddSubscriptionRequest;
    editSubscriptionRequest: EditSubscriptionRequest;

    carAddSubscriptionRequest: CarAddSubscriptionRequest;

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
            this.errorMessage = i18next.t('Subscriptions.Error.Detail.Message');
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
            this.errorMessage = i18next.t('Subscriptions.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addCarSubscription(request: CarAddSubscriptionRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await CarAddSubscriptionHandler.carAdd(request);

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
            this.errorMessage = i18next.t('Subscriptions.Error.Add.Message');
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
            debugger;

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
            this.errorMessage = i18next.t('Subscriptions.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async calculateCost(request: CalculateSubscriptionRequest, subscriptionId?: number): Promise<number>
    {
        let subscriptionCost = 0;
        try
        {
            this.errorMessage = "";
            this.calculating = true;

            let response = await CalculateSubscriptionHandler.calculate(request);

            if(response && response.success)
            {
                let result = new CalculateSubscriptionResponse().deserialize(response.data);
                if(subscriptionId){
                    this.editSubscriptionRequest.subscriptionCost = result.subscriptionCost;
                    this.editSubscriptionRequest.bundlesId = result.bundlesId;
                    subscriptionCost = result.subscriptionCost;
                }
                else{
                    this.addSubscriptionRequest.subscriptionCost = result.subscriptionCost;
                    this.addSubscriptionRequest.bundlesId = result.bundlesId;
                    subscriptionCost = result.subscriptionCost;
                }
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Subscriptions.Error.Calculate.Message');
            log.error(e);
        }
        finally
        {
            this.calculating = false;
        }
        return subscriptionCost;
    }
}
