import Routes from "app/constants/Routes";

export function getCompanyRoute(companyId: any = null): string
{
    return Routes.company.replace('/:companyId?', companyId ? `/${companyId}` : '');
}
export function getEmployeeMenuRoute(employeeId: any = null): string
{
    return Routes.employeeMenu.replace('/:employeeId', employeeId ? `/${employeeId}` : '');
}
export function getEmployeeEditRoute(employeeId: any = null): string
{
    return Routes.editEmployee.replace('/:employeeId', employeeId ? `/${employeeId}` : '');
}
export function getSubscriptionInvoiceRoute(invoiceNumber: any = null): string
{
    return Routes.subscriptionInvoice.replace('/:invoiceNumber', invoiceNumber ? `/${invoiceNumber}` : '');
}
export function getSubscriptionDetailRoute(subscriptionId: any = null): string
{
    return Routes.detailSubscription.replace('/:subscriptionId', subscriptionId ? `/${subscriptionId}` : '');
}

export function getRechargeBalanceDetailRoute(rechargeBalanceId: any = null): string
{
    return Routes.detailRechargeBalance.replace('/:rechargeBalanceId', rechargeBalanceId ? `/${rechargeBalanceId}` : '');
}
