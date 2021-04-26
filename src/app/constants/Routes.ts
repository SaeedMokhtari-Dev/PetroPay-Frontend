export default
{
    auth: "/auth",
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

    // PetroStation
    stationUser: "/app/stationUser",
    editStationUser: "/app/stationUser/edit/:stationUserId",
    addStationUser: "/app/stationUser/add",

    // Branch
    branch: "/app/branch",
    editBranch: "/app/branch/edit/:branchId",
    addBranch: "/app/branch/add",

    // Car
    car: "/app/car/:companyBranchId/list",
    editCar: "/app/car/edit/:carId",
    addCar: "/app/car/add/:companyBranchId",

    //Bundle
    bundle: "/app/bundle",
    editBundle: "/app/bundle/edit/:bundleId",
    addBundle: "/app/bundle/add",

    admins: "/app/company/:companyId/admins/:adminId?",

    // Admin
    auditors: "/app/auditors/:auditorId?",

    // Auditor
    mandants: "/app/mandants/:mandantId?",

    // User

    // Debtor
}
