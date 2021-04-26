import AuthStore from "auth/stores/AuthStore";
import PageStore from "page/stores/PageStore";
import AdminStore from "admin/stores/AdminStore";
import CompaniesStore from "entities/companies/stores/CompaniesStore";
import CustomerStore from "../../customer/stores/CustomerStore";
import SupplierStore from "../../supplier/stores/SupplierStore";
import BundlesStore from "../../entities/bundles/stores/BundlesStore";
import BranchStore from "../../entities/branches/stores/BranchStore";
import PetroStationStore from "../../entities/petro-stations/stores/PetroStationStore";
import StationUserStore from "../../entities/station-users/stores/StationUserStore";
import CarStore from "../../entities/cars/stores/CarStore";

export class AppStore
{
    auth: AuthStore;
    page: PageStore;
    customer: CustomerStore;
    admin: AdminStore;
    supplier: SupplierStore;
    companies: CompaniesStore;
    bundles: BundlesStore;
    branch: BranchStore;
    petroStation: PetroStationStore;
    stationUser: StationUserStore;
    car: CarStore;

    constructor()
    {
        this.auth = new AuthStore(this);
        this.page = new PageStore(this);
        this.customer = new CustomerStore(this);
        this.admin = new AdminStore(this);
        this.supplier = new SupplierStore(this);
        this.companies = new CompaniesStore(this);
        this.bundles = new BundlesStore(this);
        this.branch = new BranchStore(this);
        this.petroStation = new PetroStationStore(this);
        this.stationUser = new StationUserStore(this);
        this.car = new CarStore(this);
    }
}
