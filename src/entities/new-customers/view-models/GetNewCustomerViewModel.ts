import NewCustomerItem from "../handlers/get/NewCustomerItem";

import NewCustomerStore from "../stores/NewCustomerStore";
import {makeAutoObservable} from "mobx";
import GetNewCustomerRequest from "../handlers/get/GetNewCustomerRequest";
import GetNewCustomerHandler from "../handlers/get/GetNewCustomerHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteNewCustomerHandler from "../handlers/delete/DeleteNewCustomerHandler";
import DeleteNewCustomerRequest from "../handlers/delete/DeleteNewCustomerRequest";
import {message} from "antd";
import ActiveNewCustomerRequest from "../handlers/active/ActiveNewCustomerRequest";
import ActiveNewCustomerHandler from "../handlers/active/ActiveNewCustomerHandler";

export default class GetNewCustomerViewModel {
    columns: any[];
    newCustomerList: NewCustomerItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    constructor(public newCustomerStore: NewCustomerStore) {
        makeAutoObservable(this);

    }

    public async getAllNewCustomers(getNewCustomersRequest: GetNewCustomerRequest) {
        try {
            this.isProcessing = true;
            let response = await GetNewCustomerHandler.get(getNewCustomersRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.newCustomerList = items;
                this.totalSize = result.totalCount;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('NewCustomers.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteNewCustomer(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteNewCustomerRequest();
            request.newCustomerId = key;
            let response = await DeleteNewCustomerHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllNewCustomers(new GetNewCustomerRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('NewCustomers.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async activeNewCustomer(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new ActiveNewCustomerRequest();
            request.newCustomerId = key;
            let response = await ActiveNewCustomerHandler.active(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllNewCustomers(new GetNewCustomerRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('NewCustomers.Error.Active.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
