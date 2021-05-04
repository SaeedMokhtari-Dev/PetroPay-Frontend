import CompanyItem from "../handlers/get/CompanyItem";
import AddCompanyRequest from "../handlers/add/AddCompanyRequest";
import CompaniesStore from "../stores/CompaniesStore";
import {makeAutoObservable} from "mobx";
import GetCompaniesRequest from "../handlers/get/GetCompaniesRequest";
import GetCompaniesHandler from "../handlers/get/GetCompaniesHandler";
import GetCompaniesResponse from "../handlers/get/GetCompaniesResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteCompanyHandler from "../handlers/delete/DeleteCompanyHandler";
import DeleteCompanyRequest from "../handlers/delete/DeleteCompanyRequest";
import {message} from "antd";

export default class GetCompanyViewModel {
    columns: any[];
    companyList: CompanyItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    addCompanyRequest: AddCompanyRequest = new AddCompanyRequest();
    addedSuccessfully: boolean;

    constructor(public companiesStore: CompaniesStore) {
        makeAutoObservable(this);

    }

    public async getAllCompanies(getCompaniesRequest: GetCompaniesRequest) {
        try {
            this.isProcessing = true;
            let response = await GetCompaniesHandler.get(getCompaniesRequest);


            if (response && response.success) {
                let result = response.data;
                let items = result.items;
                this.companyList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('Companies.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteCompany(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteCompanyRequest();
            request.companyId = key;
            let response = await DeleteCompanyHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllCompanies(new GetCompaniesRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Companies.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
