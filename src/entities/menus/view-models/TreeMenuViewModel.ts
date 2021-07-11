import {makeAutoObservable} from "mobx";
import GetMenuRequest from "../handlers/get/GetMenuRequest";
import GetMenuHandler from "../handlers/get/GetMenuHandler";

import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import MenuTreeItem from "../handlers/tree/MenuTreeItem";
import TreeMenuResponse from "../handlers/tree/TreeMenuResponse";
import TreeMenuRequest from "../handlers/tree/TreeMenuRequest";
import TreeMenuHandler from "../handlers/tree/TreeMenuHandler";

export default class TreeMenuViewModel {
    isProcessing: boolean;
    errorMessage: string;
    treeMenuResponse: TreeMenuResponse[] = [];


    constructor() {
        makeAutoObservable(this);
    }

    public async getMenuTree()  {
        try {
            this.isProcessing = true;

            let request = new TreeMenuRequest();
            let response = await TreeMenuHandler.get(request);

            if (response && response.success) {
                this.treeMenuResponse = [];
                let result = response.data;
                this.treeMenuResponse = result;

                return this.treeMenuResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Menus.Error.Tree.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
