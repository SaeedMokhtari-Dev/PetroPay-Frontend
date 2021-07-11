import {makeAutoObservable} from "mobx";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import {message} from "antd";
import EmployeeStore from "../stores/EmployeeStore";
import DetailEmployeeMenuResponse from "../handlers/employeeMenuDetail/DetailEmployeeMenuResponse";
import AddEmployeeMenuRequest from "../handlers/employeeMenuAdd/AddEmployeeMenuRequest";
import DetailEmployeeMenuRequest from "../handlers/employeeMenuDetail/DetailEmployeeMenuRequest";
import DetailEmployeeMenuHandler from "../handlers/employeeMenuDetail/DetailEmployeeMenuHandler";
import AddEmployeeMenuHandler from "../handlers/employeeMenuAdd/AddEmployeeMenuHandler";

export default class EditEmployeeMenuViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailEmployeeMenuResponse: DetailEmployeeMenuResponse;
    addEmployeeMenuRequest: AddEmployeeMenuRequest;

    constructor(public employeeStore: EmployeeStore) {
        makeAutoObservable(this);
    }
    public async getDetailEmployeeMenu(employeeId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailEmployeeMenuRequest(employeeId);
            let response = await DetailEmployeeMenuHandler.detail(request);

            if(response && response.success)
            {
                this.detailEmployeeMenuResponse = new DetailEmployeeMenuResponse().deserialize(response.data);
                this.addEmployeeMenuRequest = new AddEmployeeMenuRequest();
                this.addEmployeeMenuRequest.employeeId = this.detailEmployeeMenuResponse.employeeId;
                this.addEmployeeMenuRequest.menuIds = this.detailEmployeeMenuResponse.menuIds;

                return this.detailEmployeeMenuResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('EmployeeMenus.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addEmployeeMenu(request: AddEmployeeMenuRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddEmployeeMenuHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.employeeMenusStore.getEmployeeMenuViewModel.getAllEmployeeMenus(new GetEmployeeMenusRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('EmployeeMenus.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
