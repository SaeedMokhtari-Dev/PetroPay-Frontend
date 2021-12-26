export default class GetOdometerRecordRequest
{

    constructor(
        public pageSize: number,
        public pageIndex: number,
        public companyId?: number,
        public branchId?: number,
        public exportToFile?: boolean
    ) {
    }
}
