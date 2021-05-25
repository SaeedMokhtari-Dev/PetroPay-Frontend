import BundleItem from "../handlers/get/BundleItem";

import BundlesStore from "../stores/BundlesStore";
import {makeAutoObservable} from "mobx";
import GetBundleRequest from "../handlers/get/GetBundleRequest";
import GetBundleHandler from "../handlers/get/GetBundleHandler";

import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";

export default class ListBundleViewModel {
    bundleList: BundleItem[];
    isProcessing: boolean;
    errorMessage: string;

    constructor() {
        makeAutoObservable(this);
    }

    public async getAllBundles() {
        try {
            this.isProcessing = true;
            const getBundlesRequest: GetBundleRequest = new GetBundleRequest(10000, 0);

            let response = await GetBundleHandler.get(getBundlesRequest);


            if (response && response.success) {

                let result = response.data;
                let items = result.items;
                this.bundleList = items;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Bundles.Error.Get.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
