import BranchItem from "../handlers/get/BranchItem";
import AddBranchRequest from "../handlers/add/AddBranchRequest";
import BranchStore from "../stores/BranchStore";
import {makeAutoObservable} from "mobx";
import GetBranchRequest from "../handlers/get/GetBranchRequest";
import GetBranchHandler from "../handlers/get/GetBranchHandler";
import GetBranchResponse from "../handlers/get/GetBranchResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteBranchHandler from "../handlers/delete/DeleteBranchHandler";
import DeleteBranchRequest from "../handlers/delete/DeleteBranchRequest";
import {message} from "antd";
import UserContext from "../../../identity/contexts/UserContext";

export default class GetBranchViewModel {
    columns: any[];
    branchList: BranchItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    addBranchRequest: AddBranchRequest = new AddBranchRequest();
    addedSuccessfully: boolean;

    constructor(public branchStore: BranchStore) {
        makeAutoObservable(this);

    }

    public async getAllBranch(getBranchsRequest: GetBranchRequest) {
        try {
            this.isProcessing = true;
            let response = await GetBranchHandler.get(getBranchsRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.branchList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('Branches.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteBranch(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteBranchRequest();
            request.branchId = key;
            let response = await DeleteBranchHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllBranch(new GetBranchRequest(UserContext.info.id, this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Branches.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
