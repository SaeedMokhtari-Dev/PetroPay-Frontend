export default
{
    auth: "/auth",
    login: "/auth/:roleType",

    resetPassword: "/auth/password/reset",
    changePassword: "/auth/password/change/:token",
    unknown: "/unknown",

    app: "/app",

    // Admin
    // Company
    company: "/app/company",
    editCompany: "/app/company/edit/:companyId",
    addCompany: "/app/company/add",

    // PetroStation
    petroStation: "/app/petroStation",
    editPetroStation: "/app/petroStation/edit/:petroStationId",
    addPetroStation: "/app/petroStation/add",
    paymentPetroStation: "/app/petroStation/payment/:petroStationId",

    // PetroStation
    stationUser: "/app/stationUser",
    editStationUser: "/app/stationUser/edit/:stationUserId",
    addStationUser: "/app/stationUser/add",

    // RechargeBalance
    rechargeBalance: "/app/rechargeBalance",
    editRechargeBalance: "/app/rechargeBalance/edit/:rechargeBalanceId",
    detailRechargeBalance: "/app/rechargeBalance/detail/:rechargeBalanceId",
    addRechargeBalance: "/app/rechargeBalance/add",

    // Subscription
    subscription: "/app/subscription",
    editSubscription: "/app/subscription/edit/:subscriptionId",
    detailSubscription: "/app/subscription/detail/:subscriptionId",
    carAddSubscription: "/app/subscription/carAdd/:subscriptionId",
    addSubscription: "/app/subscription/add",
    subscriptionInvoice: "/app/subscription/invoice/:invoiceNumber",


    // Branch
    branch: "/app/branch",
    branchList: "/app/branch/:companyId",
    editBranch: "/app/branch/edit/:branchId",
    addBranch: "/app/branch/add/new",

    // Car
    car: "/app/car",
    branchCars: "/app/car/:companyBranchId/list",
    editCar: "/app/car/edit/:carId",
    addCar: "/app/car/add",

    //Bundle
    bundle: "/app/bundle",
    editBundle: "/app/bundle/edit/:bundleId",
    addBundle: "/app/bundle/add",

    //TransferBalance
    transferBalance: "/app/transferBalance",

    //PetroPayAccount
    petropayAccountList: "/app/petroPayAccount",
    paymentTransferAccount: "/app/petroPayAccount/payment",

    //PromotionCoupon
    promotionCoupon: "/app/promotionCoupon",
    editPromotionCoupon: "/app/promotionCoupon/edit/:promotionCouponId",
    addPromotionCoupon: "/app/promotionCoupon/add",

    //AppSetting
    appSetting: "/app/appSetting",

    //OdometerRecord
    odometerRecord: "/app/odometerRecord",
    editOdometerRecord: "/app/odometerRecord/edit/:odometerRecordId",
    addOdometerRecord: "/app/odometerRecord/add",

    //Menu
    menu: "/app/menu",
    editMenu: "/app/menu/edit/:menuId",
    addMenu: "/app/menu/add",

    //Employee
    employee: "/app/employee",
    editEmployee: "/app/employee/edit/:employeeId",
    addEmployee: "/app/employee/add",

    employeeMenu: "/app/employeeMenu/:employeeId",

    //NewCustomer
    newCustomer: "/app/newCustomer",
    editNewCustomer: "/app/newCustomer/edit/:newCustomerId",
    addNewCustomer: "/app/newCustomer/add",


    //Reports
    accountBalance: '/app/accountBalance',
    invoiceSummary: '/app/invoiceSummary',
    invoiceDetail: '/app/invoiceDetail/:invoiceId',
    carBalance: '/app/carBalance',
    stationReport: '/app/stationReport',
    stationSale: '/app/stationSale',
    stationStatement: '/app/stationStatement',
    carTransaction: '/app/carTransaction',
    petrolStationList: '/app/petrolStationLists',
    carConsumptionRate: '/app/carConsumptionRate',
    carKmConsumption: '/app/carKmConsumption',
    carOdometerMax: '/app/carOdometerMax',
    carOdometerMin: '/app/carOdometerMin',
    odometerBetweenDate: '/app/odometerBetweenDate',
    odometerHistory: '/app/odometerHistory',
}
