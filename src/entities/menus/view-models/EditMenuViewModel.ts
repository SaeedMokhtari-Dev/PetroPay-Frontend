import MenuStore from "entities/menus/stores/MenuStore";
import {makeAutoObservable} from "mobx";
import DetailMenuResponse from "../handlers/detail/DetailMenuResponse";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailMenuHandler from "../handlers/detail/DetailMenuHandler";
import DetailMenuRequest from "../handlers/detail/DetailMenuRequest";
import AddMenuRequest from "../handlers/add/AddMenuRequest";
import EditMenuRequest from "../handlers/edit/EditMenuRequest";
import AddMenuHandler from "../handlers/add/AddMenuHandler";
import {message} from "antd";
import EditMenuHandler from "../handlers/edit/EditMenuHandler";

export default class EditMenuViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailMenuResponse: DetailMenuResponse;
    addMenuRequest: AddMenuRequest;
    editMenuRequest: EditMenuRequest;

    constructor(public menuStore: MenuStore) {
        makeAutoObservable(this);
    }
    public async getDetailMenu(menuId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailMenuRequest(menuId);
            let response = await DetailMenuHandler.detail(request);

            if(response && response.success)
            {

                this.detailMenuResponse = new DetailMenuResponse().deserialize(response.data);
                this.editMenuRequest = new EditMenuRequest();
                for ( let i in this.editMenuRequest )
                    if ( this.detailMenuResponse.hasOwnProperty( i ) )
                        this.editMenuRequest[i] = this.detailMenuResponse[i];


                return this.detailMenuResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Menus.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addMenu(request: AddMenuRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddMenuHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.menuStore.getMenuViewModel.getAllMenus(new GetMenusRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Menus.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editMenu(request: EditMenuRequest)
    {
        try
        {
            debugger;
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditMenuHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.menuStore.getMenuViewModel.getAllMenus(new GetMenusRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Menus.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
