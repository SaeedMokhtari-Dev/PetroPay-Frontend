import BundlesStore from "entities/bundles/stores/BundlesStore";
import {makeAutoObservable} from "mobx";
import DetailBundleResponse from "../handlers/detail/DetailBundleResponse";
import GetBundleHandler from "../handlers/get/GetBundleHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailBundleHandler from "../handlers/detail/DetailBundleHandler";
import DetailBundleRequest from "../handlers/detail/DetailBundleRequest";
import AddBundleRequest from "../handlers/add/AddBundleRequest";
import EditBundleRequest from "../handlers/edit/EditBundleRequest";
import AddBundleHandler from "../handlers/add/AddBundleHandler";
import {message} from "antd";
import GetBundleRequest from "../handlers/get/GetBundleRequest";
import EditBundleHandler from "../handlers/edit/EditBundleHandler";

export default class EditBundleViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailBundleResponse: DetailBundleResponse;
    addBundleRequest: AddBundleRequest;
    editBundleRequest: EditBundleRequest;

    constructor(public bundlesStore: BundlesStore) {
        makeAutoObservable(this);
    }
    public async getDetailBundle(bundleId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailBundleRequest(bundleId);
            let response = await DetailBundleHandler.detail(request);

            if(response && response.success)
            {

                this.detailBundleResponse = new DetailBundleResponse().deserialize(response.data);
                this.editBundleRequest = new EditBundleRequest();
                for ( let i in this.editBundleRequest )
                    if ( this.detailBundleResponse.hasOwnProperty( i ) )
                        this.editBundleRequest[i] = this.detailBundleResponse[i];


                return this.detailBundleResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Bundles.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addBundle(request: AddBundleRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddBundleHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.bundlesStore.getBundleViewModel.getAllBundles(new GetBundlesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Bundles.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editBundle(request: EditBundleRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditBundleHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.bundlesStore.getBundleViewModel.getAllBundles(new GetBundlesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Bundles.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
