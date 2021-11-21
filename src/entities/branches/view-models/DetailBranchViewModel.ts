import {makeAutoObservable} from "mobx";
import DetailBranchResponse from "../handlers/detail/DetailBranchResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailBranchHandler from "../handlers/detail/DetailBranchHandler";
import DetailBranchRequest from "../handlers/detail/DetailBranchRequest";

export default class DetailBranchViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    detailBranchResponse: DetailBranchResponse;

    constructor() {
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
}
