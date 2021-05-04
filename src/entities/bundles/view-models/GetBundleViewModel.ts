import BundleItem from "../handlers/get/BundleItem";
import AddBundleRequest from "../handlers/add/AddBundleRequest";
import BundlesStore from "../stores/BundlesStore";
import {makeAutoObservable} from "mobx";
import GetBundleRequest from "../handlers/get/GetBundleRequest";
import GetBundleHandler from "../handlers/get/GetBundleHandler";
import GetBundleResponse from "../handlers/get/GetBundleResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DeleteBundleHandler from "../handlers/delete/DeleteBundleHandler";
import DeleteBundleRequest from "../handlers/delete/DeleteBundleRequest";
import {message} from "antd";

export default class GetBundleViewModel {
    columns: any[];
    bundleList: BundleItem[];
    totalSize: number;
    isProcessing: boolean;
    errorMessage: string;
    pageIndex: number;
    pageSize: number;

    addBundleRequest: AddBundleRequest = new AddBundleRequest();
    addedSuccessfully: boolean;

    constructor(public bundlesStore: BundlesStore) {
        makeAutoObservable(this);

    }

    public async getAllBundles(getBundlesRequest: GetBundleRequest) {
        try {
            this.isProcessing = true;
            let response = await GetBundleHandler.get(getBundlesRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.bundleList = items;
                this.totalSize = result.totalCount;
                this.addedSuccessfully = true;
            } else {
                this.errorMessage = getLocalizedString(response.message);
                this.addedSuccessfully = false;
            }
        } catch (e) {
            this.errorMessage = i18next.t('Bundles.Error.Get.Message');
            this.addedSuccessfully = false;
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
    public async deleteBundle(key: number)
    {
        try
        {

            this.errorMessage = "";
            let request = new DeleteBundleRequest();
            request.bundlesId = key;
            let response = await DeleteBundleHandler.delete(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                await this.getAllBundles(new GetBundleRequest(this.pageSize, this.pageIndex));
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
                message.error(this.errorMessage);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Bundles.Error.Delete.Message');
            message.error(this.errorMessage);
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }

}
