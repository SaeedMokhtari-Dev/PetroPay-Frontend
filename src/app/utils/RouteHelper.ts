import Routes from "app/constants/Routes";

export function getCompanyRoute(companyId: any = null): string
{
    return Routes.company.replace('/:companyId?', companyId ? `/${companyId}` : '');
}

export function getAdminsRoute(companyId: any, adminId: any = null): string
{
    return Routes.admins
        .replace(':companyId', companyId)
        .replace('/:adminId?', adminId ? `/${adminId}` : '');
}

export function getAuditorsRoute(auditorId: string)
{
    return Routes.auditors.replace('/:auditorId?', auditorId ? `/${auditorId}` : '');
}