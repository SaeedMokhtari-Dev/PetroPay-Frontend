export default class GetSubscriptionRequest
{
    constructor(
        public pageSize: number,
        public pageIndex: number,
        public CompanyId?: number
    ) {
    }
}
