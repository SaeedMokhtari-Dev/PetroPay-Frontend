import Routes from "app/constants/Routes";

export function getCompanyRoute(companyId: any = null): string
{
    return Routes.company.replace('/:companyId?', companyId ? `/${companyId}` : '');
}
