export default class GetRechargeBalanceRequest
{
    constructor(
        public pageSize: number,
        public pageIndex: number,
        public companyId?: number
    ) {
    }
}
