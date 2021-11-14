import PetrolCompaniesStore from "entities/petrol-companies/stores/PetrolCompaniesStore";
import {makeAutoObservable} from "mobx";
import DetailPetrolCompanyResponse from "../handlers/detail/DetailPetrolCompanyResponse";
import GetPetrolCompaniesHandler from "../handlers/get/GetPetrolCompaniesHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailPetrolCompanyHandler from "../handlers/detail/DetailPetrolCompanyHandler";
import DetailPetrolCompanyRequest from "../handlers/detail/DetailPetrolCompanyRequest";
import AddPetrolCompanyRequest from "../handlers/add/AddPetrolCompanyRequest";
import EditPetrolCompanyRequest from "../handlers/edit/EditPetrolCompanyRequest";
import AddPetrolCompanyHandler from "../handlers/add/AddPetrolCompanyHandler";
import {message} from "antd";
import GetPetrolCompaniesRequest from "../handlers/get/GetPetrolCompaniesRequest";
import EditPetrolCompanyHandler from "../handlers/edit/EditPetrolCompanyHandler";

export default class EditPetrolCompanyViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailPetrolCompanyResponse: DetailPetrolCompanyResponse;
    addPetrolCompanyRequest: AddPetrolCompanyRequest;
    editPetrolCompanyRequest: EditPetrolCompanyRequest;

    constructor(public petrolCompaniesStore: PetrolCompaniesStore) {
        makeAutoObservable(this);
    }
    public async getDetailPetrolCompany(petrolCompanyId: number)
    {
        try
        {

            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailPetrolCompanyRequest(petrolCompanyId);
            let response = await DetailPetrolCompanyHandler.detail(request);

            if(response && response.success)
            {

                this.detailPetrolCompanyResponse = new DetailPetrolCompanyResponse().deserialize(response.data);
                this.editPetrolCompanyRequest = new EditPetrolCompanyRequest();
                for ( let i in this.editPetrolCompanyRequest )
                    if ( this.detailPetrolCompanyResponse.hasOwnProperty( i ) )
                        this.editPetrolCompanyRequest[i] = this.detailPetrolCompanyResponse[i];


                return this.detailPetrolCompanyResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetrolCompanies.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addPetrolCompany(request: AddPetrolCompanyRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddPetrolCompanyHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.petrolCompaniesStore.getPetrolCompanyViewModel.getAllPetrolCompanies(new GetPetrolCompaniesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetrolCompanies.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editPetrolCompany(request: EditPetrolCompanyRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditPetrolCompanyHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.petrolCompaniesStore.getPetrolCompanyViewModel.getAllPetrolCompanies(new GetPetrolCompaniesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetrolCompanies.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
