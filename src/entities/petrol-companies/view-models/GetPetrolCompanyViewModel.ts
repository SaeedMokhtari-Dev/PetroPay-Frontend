import PetrolCompanyItem from "../handlers/get/PetrolCompanyItem";
import AddPetrolCompanyRequest from "../handlers/add/AddPetrolCompanyRequest";
import PetrolCompaniesStore from "../stores/PetrolCompaniesStore";
import {makeAutoObservable} from "mobx";
import GetPetrolCompaniesRequest from "../handlers/get/GetPetrolCompaniesRequest";
import GetPetrolCompaniesHandler from "../handlers/get/GetPetrolCompaniesHandler";
import GetPetrolCompaniesResponse from "../handlers/get/GetPetrolCompaniesResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeletePetrolCompanyHandler from "../handlers/delete/DeletePetrolCompanyHandler";
import DeletePetrolCompanyRequest from "../handlers/delete/DeletePetrolCompanyRequest";
import {message} from "antd";

export default class GetPetrolCompanyViewModel {
    columns: any[];
    petrolCompanyList: PetrolCompanyItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    addPetrolCompanyRequest: AddPetrolCompanyRequest = new AddPetrolCompanyRequest();
    addedSuccessfully: boolean;

    constructor(public petrolCompaniesStore: PetrolCompaniesStore) {
        makeAutoObservable(this);

    }

    public async getAllPetrolCompanies(getPetrolCompaniesRequest: GetPetrolCompaniesRequest) {
        try {
            this.isProcessing = true;
            let response = await GetPetrolCompaniesHandler.get(getPetrolCompaniesRequest);


            if (response && response.success) {
                let result = response.data;
                let items = result.items;
                this.petrolCompanyList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('PetrolCompanies.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deletePetrolCompany(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeletePetrolCompanyRequest();
            request.petrolCompanyId = key;
            let response = await DeletePetrolCompanyHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllPetrolCompanies(new GetPetrolCompaniesRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('PetrolCompanies.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
