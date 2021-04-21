export default class GetBranchRequest
{
    constructor(
        public companyId: number,
        public pageSize: number,
        public pageIndex: number
    ) {
    }
}
