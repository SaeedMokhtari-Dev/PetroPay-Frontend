import EmployeesStore from "entities/employees/stores/EmployeeStore";
import {makeAutoObservable} from "mobx";
import DetailEmployeeResponse from "../handlers/detail/DetailEmployeeResponse";
import GetEmployeeHandler from "../handlers/get/GetEmployeeHandler";
import {getLocalizedString} from "../../../app/utils/Localization";
import i18next from "i18next";
import log from "loglevel";
import DetailEmployeeHandler from "../handlers/detail/DetailEmployeeHandler";
import DetailEmployeeRequest from "../handlers/detail/DetailEmployeeRequest";
import AddEmployeeRequest from "../handlers/add/AddEmployeeRequest";
import EditEmployeeRequest from "../handlers/edit/EditEmployeeRequest";
import AddEmployeeHandler from "../handlers/add/AddEmployeeHandler";
import {message} from "antd";
import GetEmployeeRequest from "../handlers/get/GetEmployeeRequest";
import EditEmployeeHandler from "../handlers/edit/EditEmployeeHandler";

export default class EditEmployeeViewModel
{
    isProcessing: boolean;
    errorMessage: string;
    key: number;
    uploadLoading: boolean;

    detailEmployeeResponse: DetailEmployeeResponse;
    addEmployeeRequest: AddEmployeeRequest;
    editEmployeeRequest: EditEmployeeRequest;

    constructor(public employeesStore: EmployeesStore) {
        makeAutoObservable(this);
    }
    public async getDetailEmployee(employeeId: number)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let request = new DetailEmployeeRequest(employeeId);
            let response = await DetailEmployeeHandler.detail(request);

            if(response && response.success)
            {

                this.detailEmployeeResponse = new DetailEmployeeResponse().deserialize(response.data);
                this.editEmployeeRequest = new EditEmployeeRequest();
                for ( let i in this.editEmployeeRequest )
                    if ( this.detailEmployeeResponse.hasOwnProperty( i ) )
                        this.editEmployeeRequest[i] = this.detailEmployeeResponse[i];


                return this.detailEmployeeResponse;
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Employees.Error.Detail.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async addEmployee(request: AddEmployeeRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await AddEmployeeHandler.add(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.employeesStore.getEmployeeViewModel.getAllEmployees(new GetEmployeesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Employees.Error.Add.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
    public async editEmployee(request: EditEmployeeRequest)
    {
        try
        {
            this.errorMessage = "";
            this.isProcessing = true;

            let response = await EditEmployeeHandler.edit(request);

            if(response && response.success)
            {
                message.success(getLocalizedString(response.message));
                /*await this.employeesStore.getEmployeeViewModel.getAllEmployees(new GetEmployeesRequest(20, 0));*/
            }
            else{
                this.errorMessage = getLocalizedString(response.message);
            }
        }
        catch(e)
        {
            this.errorMessage = i18next.t('Employees.Error.Edit.Message');
            log.error(e);
        }
        finally
        {
            this.isProcessing = false;
        }
    }
}
