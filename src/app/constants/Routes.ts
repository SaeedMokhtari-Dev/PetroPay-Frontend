export default
{
    auth: "/auth",
    login: "/auth/:roleType",

    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password/:token",
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
    addRechargeBalance: "/app/rechargeBalance/add",

    // Subscription
    subscription: "/app/subscription",
    editSubscription: "/app/subscription/edit/:subscriptionId",
    carAddSubscription: "/app/subscription/carAdd/:subscriptionId",
    addSubscription: "/app/subscription/add",

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
    paymentTransferAccount: "/app/pPetroPayAccount/payment",

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
}
