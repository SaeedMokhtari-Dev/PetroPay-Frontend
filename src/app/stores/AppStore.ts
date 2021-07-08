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
import RechargeBalanceStore from "../../entities/recharge-balances/stores/RechargeBalanceStore";
import SubscriptionStore from "../../entities/Subscriptions/stores/SubscriptionStore";
import InvoiceSummaryStore from "../../reports/InvoiceSummaries/stores/InvoiceSummaryStore";
import InvoiceDetailStore from "../../reports/InvoiceDetails/stores/InvoiceDetailStore";
import CarBalanceStore from "../../reports/CarBalances/stores/CarBalanceStore";
import StationReportStore from "../../reports/StationReports/stores/StationReportStore";
import StationSaleStore from "../../reports/StationSales/stores/StationSaleStore";
import StationStatementStore from "../../reports/StationStatements/stores/StationStatementStore";
import CarTransactionStore from "../../reports/CarTransactions/stores/CarTransactionStore";
import AccountBalanceStore from "../../reports/AccountBalances/stores/AccountBalanceStore";
import PetrolStationListStore from "../../reports/PetrolStationLists/stores/PetrolStationListStore";
import TransferBalanceStore from "../../entities/transfer-balances/stores/TransferBalanceStore";
import PetropayAccountStore from "../../entities/PetropayAccounts/stores/PetropayAccountStore";
import PromotionCouponStore from "../../entities/promotion-coupons/stores/PromotionCouponStore";
import CarConsumptionRateStore from "../../reports/CarConsumptionRates/stores/CarConsumptionRateStore";
import CarKmConsumptionStore from "../../reports/CarKmConsumptions/stores/CarKmConsumptionStore";

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
    rechargeBalance: RechargeBalanceStore;
    subscription: SubscriptionStore;
    invoiceSummary: InvoiceSummaryStore;
    invoiceDetail: InvoiceDetailStore;
    carBalance: CarBalanceStore;
    stationReport: StationReportStore;
    stationSale: StationSaleStore;
    stationStatement: StationStatementStore;
    carTransaction: CarTransactionStore;
    accountBalance: AccountBalanceStore;
    petrolStationList: PetrolStationListStore;
    transferBalance: TransferBalanceStore;
    petropayAccount: PetropayAccountStore;
    promotionCoupon: PromotionCouponStore;
    carConsumptionRate: CarConsumptionRateStore;
    carKmConsumption: CarKmConsumptionStore;

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
        this.rechargeBalance = new RechargeBalanceStore(this);
        this.subscription = new SubscriptionStore(this);
        this.invoiceSummary = new InvoiceSummaryStore(this);
        this.invoiceDetail = new InvoiceDetailStore(this);
        this.carBalance = new CarBalanceStore(this);
        this.stationReport = new StationReportStore(this);
        this.stationSale = new StationSaleStore(this);
        this.stationStatement = new StationStatementStore(this);
        this.carTransaction = new CarTransactionStore(this);
        this.accountBalance = new AccountBalanceStore(this);
        this.petrolStationList = new PetrolStationListStore(this);
        this.transferBalance = new TransferBalanceStore(this);
        this.petropayAccount = new PetropayAccountStore(this);
        this.promotionCoupon = new PromotionCouponStore(this);
        this.carConsumptionRate = new CarConsumptionRateStore(this);
        this.carKmConsumption = new CarKmConsumptionStore(this);
    }
}
