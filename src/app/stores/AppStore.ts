import AuthStore from "auth/stores/AuthStore";
import PageStore from "page/stores/PageStore";
import AdminStore from "admin/stores/AdminStore";
import CompaniesStore from "companies/stores/CompaniesStore";
import CustomerStore from "../../customer/stores/CustomerStore";
import SupplierStore from "../../supplier/stores/SupplierStore";

export class AppStore
{
    auth: AuthStore;
    page: PageStore;
    customer: CustomerStore;
    admin: AdminStore;
    supplier: SupplierStore;
    companies: CompaniesStore;

    constructor()
    {
        this.auth = new AuthStore(this);
        this.page = new PageStore(this);
        this.customer = new CustomerStore(this);
        this.admin = new AdminStore(this);
        this.supplier = new SupplierStore(this);
        this.companies = new CompaniesStore(this);
    }
}
