import {makeAutoObservable} from "mobx";
import GetMenuRequest from "../handlers/get/GetMenuRequest";
import GetMenuHandler from "../handlers/get/GetMenuHandler";

import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import MenuListItem from "../handlers/list/MenuListItem";
import ListMenuResponse from "../handlers/list/ListMenuResponse";
import ListMenuRequest from "../handlers/list/ListMenuRequest";
import ListMenuHandler from "../handlers/list/ListMenuHandler";

export default class ListMenuViewModel {
    isProcessing: boolean;
    errorMessage: string;
    listMenuResponse: ListMenuResponse = new ListMenuResponse();


    constructor() {
        makeAutoObservable(this);
    }

    public async getMenuList()  {
        try {
            this.isProcessing = true;

            let request = new ListMenuRequest();
            let response = await ListMenuHandler.get(request);

            if (response && response.success) {

                this.listMenuResponse = new ListMenuResponse();
                let result = response.data;
                //let items = result.items;
                this.listMenuResponse.items = result;

                return this.listMenuResponse;
            } else {
                this.errorMessage = getLocalizedString(response.message);
            }
        } catch (e) {
            this.errorMessage = i18next.t('Menus.Error.List.Message');
            log.error(e);
        } finally {
            this.isProcessing = false;
        }
    }
}
