export default class GetCarRequest
{
    constructor(
        public companyBranchId: number,
        public pageSize: number,
        public pageIndex: number
    ) {
    }
}
