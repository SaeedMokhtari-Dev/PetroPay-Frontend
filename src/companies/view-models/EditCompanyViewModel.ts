import CompaniesStore from "companies/stores/CompaniesStore";
import {makeAutoObservable} from "mobx";
import DetailCompanyResponse from "../handlers/detail/DetailCompanyResponse";
import GetCompaniesHandler from "../handlers/get/GetCompaniesHandler";
import {getLocalizedString} from "../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailCompanyHandler from "../handlers/detail/DetailCompanyHandler";
import DetailCompanyRequest from "../handlers/detail/DetailCompanyRequest";
import AddCompanyRequest from "../handlers/add/AddCompanyRequest";
import EditCompanyRequest from "../handlers/edit/EditCompanyRequest";
import AddCompanyHandler from "../handlers/add/AddCompanyHandler";
import {message} from "antd";
import GetCompaniesRequest from "../handlers/get/GetCompaniesRequest";

export default class EditCompanyViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailCompanyResponse: DetailCompanyResponse;
    addCompanyRequest: AddCompanyRequest;
    editCompanyRequest: EditCompanyRequest;

    constructor(public companiesStore: CompaniesStore) {
        makeAutoObservable(this);
    }
    public async getDetailCompany(companyId: number)
    {
        try
        {
            debugger;
            this.isProcessing = true;

            let request = new DetailCompanyRequest(companyId);
            let response = await DetailCompanyHandler.detail(request);

            if(response && response.success)
            {
                debugger;
                this.detailCompanyResponse = new DetailCompanyResponse().deserialize(response.data);
                this.editCompanyRequest = new EditCompanyRequest();
                for ( let i in this.editCompanyRequest )
                    if ( this.detailCompanyResponse.hasOwnProperty( i ) )
                        this.editCompanyRequest[i] = this.detailCompanyResponse[i];


                return this.detailCompanyResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Companies.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addCompany(request: AddCompanyRequest)
    {
        try
        {
            this.isProcessing = true;

            let response = await AddCompanyHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.companiesStore.getCompanyViewModel.getAllCompanies(new GetCompaniesRequest(20, 0));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Companies.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
