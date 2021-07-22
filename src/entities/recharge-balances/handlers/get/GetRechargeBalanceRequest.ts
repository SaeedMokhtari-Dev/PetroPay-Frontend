export default class GetRechargeBalanceRequest
{
    pageSize: number;
    pageIndex: number;
    companyId: number;
    dateFrom: string;
    dateTo: string;
    status: number;

    constructor(
    ) {
    }
}
