import {makeAutoObservable} from "mobx";
import DetailRechargeBalanceResponse from "../handlers/detail/DetailRechargeBalanceResponse";
import GetRechargeBalanceHandler from "../handlers/get/GetRechargeBalanceHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailRechargeBalanceHandler from "../handlers/detail/DetailRechargeBalanceHandler";
import DetailRechargeBalanceRequest from "../handlers/detail/DetailRechargeBalanceRequest";
import AddRechargeBalanceRequest from "../handlers/add/AddRechargeBalanceRequest";
import EditRechargeBalanceRequest from "../handlers/edit/EditRechargeBalanceRequest";
import AddRechargeBalanceHandler from "../handlers/add/AddRechargeBalanceHandler";
import {message} from "antd";
import GetRechargeBalanceRequest from "../handlers/get/GetRechargeBalanceRequest";
import EditRechargeBalanceHandler from "../handlers/edit/EditRechargeBalanceHandler";
import UserContext from "../../../identity/contexts/UserContext";
import RechargeBalanceStore from "../stores/RechargeBalanceStore";

export default class EditRechargeBalanceViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailRechargeBalanceResponse: DetailRechargeBalanceResponse;
    addRechargeBalanceRequest: AddRechargeBalanceRequest;
    editRechargeBalanceRequest: EditRechargeBalanceRequest;

    constructor(public rechargeBalanceStore: RechargeBalanceStore) {
        makeAutoObservable(this);
    }
    public async getDetailRechargeBalance(rechargeBalanceId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailRechargeBalanceRequest(rechargeBalanceId);
            let response = await DetailRechargeBalanceHandler.detail(request);

            if(response && response.success)
            {

                this.detailRechargeBalanceResponse = new DetailRechargeBalanceResponse().deserialize(response.data);
                this.editRechargeBalanceRequest = new EditRechargeBalanceRequest();
                for ( let i in this.editRechargeBalanceRequest )
                    if ( this.detailRechargeBalanceResponse.hasOwnProperty( i ) )
                        this.editRechargeBalanceRequest[i] = this.detailRechargeBalanceResponse[i];


                return this.detailRechargeBalanceResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('RechargeBalancees.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addRechargeBalance(request: AddRechargeBalanceRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            request.companyId = UserContext.info.id;
            let response = await AddRechargeBalanceHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.rechargeBalancesStore.getRechargeBalanceViewModel.getAllRechargeBalances(new GetRechargeBalancesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('RechargeBalancees.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editRechargeBalance(request: EditRechargeBalanceRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditRechargeBalanceHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.rechargeBalancesStore.getRechargeBalanceViewModel.getAllRechargeBalances(new GetRechargeBalancesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('RechargeBalancees.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
