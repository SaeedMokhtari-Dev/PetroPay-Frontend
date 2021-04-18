export default
{
    auth: "/auth",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password/:token",
    unknown: "/unknown",

    app: "/app",

    // Admin
    company: "/app/company",
    editCompany: "/app/company/edit/:companyId",
    addCompany: "/app/company/add",
    admins: "/app/company/:companyId/admins/:adminId?",

    // Admin
    auditors: "/app/auditors/:auditorId?",

    // Auditor
    mandants: "/app/mandants/:mandantId?",

    // User

    // Debtor
}
