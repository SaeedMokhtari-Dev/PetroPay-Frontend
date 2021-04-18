import {makeAutoObservable} from "mobx";
import Sizes from "page/constants/Sizes";
import {AppStore} from "app/stores/AppStore";

export default class PageStore
{
    isSidebarCollapsed: boolean;

    currentLanguage: string;

    constructor(public appStore: AppStore)
    {
        makeAutoObservable(this);
    }
}
