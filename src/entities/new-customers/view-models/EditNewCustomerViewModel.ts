import {makeAutoObservable} from "mobx";
import DetailNewCustomerResponse from "../handlers/detail/DetailNewCustomerResponse";
import GetNewCustomerHandler from "../handlers/get/GetNewCustomerHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailNewCustomerHandler from "../handlers/detail/DetailNewCustomerHandler";
import DetailNewCustomerRequest from "../handlers/detail/DetailNewCustomerRequest";
import AddNewCustomerRequest from "../handlers/add/AddNewCustomerRequest";
import EditNewCustomerRequest from "../handlers/edit/EditNewCustomerRequest";
import AddNewCustomerHandler from "../handlers/add/AddNewCustomerHandler";
import {message} from "antd";
import GetNewCustomerRequest from "../handlers/get/GetNewCustomerRequest";
import EditNewCustomerHandler from "../handlers/edit/EditNewCustomerHandler";
import NewCustomerStore from "../stores/NewCustomerStore";

export default class EditNewCustomerViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailNewCustomerResponse: DetailNewCustomerResponse;
    addNewCustomerRequest: AddNewCustomerRequest;
    editNewCustomerRequest: EditNewCustomerRequest;

    constructor(public newCustomerStore: NewCustomerStore) {
        makeAutoObservable(this);
    }
    public async getDetailNewCustomer(newCustomerId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailNewCustomerRequest(newCustomerId);
            let response = await DetailNewCustomerHandler.detail(request);

            if(response && response.success)
            {

                this.detailNewCustomerResponse = new DetailNewCustomerResponse().deserialize(response.data);
                this.editNewCustomerRequest = new EditNewCustomerRequest();
                for ( let i in this.editNewCustomerRequest )
                    if ( this.detailNewCustomerResponse.hasOwnProperty( i ) )
                        this.editNewCustomerRequest[i] = this.detailNewCustomerResponse[i];


                return this.detailNewCustomerResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('NewCustomers.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addNewCustomer(request: AddNewCustomerRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddNewCustomerHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.newCustomerStore.getNewCustomerViewModel.getAllNewCustomers(new GetNewCustomersRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('NewCustomers.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editNewCustomer(request: EditNewCustomerRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditNewCustomerHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.newCustomerStore.getNewCustomerViewModel.getAllNewCustomers(new GetNewCustomersRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('NewCustomers.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
