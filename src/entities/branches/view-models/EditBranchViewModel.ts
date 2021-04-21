import BranchStore from "entities/branches/stores/BranchStore";
import {makeAutoObservable} from "mobx";
import DetailBranchResponse from "../handlers/detail/DetailBranchResponse";
import GetBranchHandler from "../handlers/get/GetBranchHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailBranchHandler from "../handlers/detail/DetailBranchHandler";
import DetailBranchRequest from "../handlers/detail/DetailBranchRequest";
import AddBranchRequest from "../handlers/add/AddBranchRequest";
import EditBranchRequest from "../handlers/edit/EditBranchRequest";
import AddBranchHandler from "../handlers/add/AddBranchHandler";
import {message} from "antd";
import GetBranchRequest from "../handlers/get/GetBranchRequest";
import EditBranchHandler from "../handlers/edit/EditBranchHandler";
import UserContext from "../../../identity/contexts/UserContext";

export default class EditBranchViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailBranchResponse: DetailBranchResponse;
    addBranchRequest: AddBranchRequest;
    editBranchRequest: EditBranchRequest;

    constructor(public branchStore: BranchStore) {
        makeAutoObservable(this);
    }
    public async getDetailBranch(branchId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailBranchRequest(branchId);
            let response = await DetailBranchHandler.detail(request);

            if(response && response.success)
            {

                this.detailBranchResponse = new DetailBranchResponse().deserialize(response.data);
                this.editBranchRequest = new EditBranchRequest();
                for ( let i in this.editBranchRequest )
                    if ( this.detailBranchResponse.hasOwnProperty( i ) )
                        this.editBranchRequest[i] = this.detailBranchResponse[i];


                return this.detailBranchResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Branches.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addBranch(request: AddBranchRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            request.companyId = UserContext.info.id;
            let response = await AddBranchHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.branchsStore.getBranchViewModel.getAllBranchs(new GetBranchsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Branches.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editBranch(request: EditBranchRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditBranchHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.branchsStore.getBranchViewModel.getAllBranchs(new GetBranchsRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Branches.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
