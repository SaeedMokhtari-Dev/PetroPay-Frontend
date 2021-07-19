export default class GetOdometerRecordRequest
{

    constructor(
        public pageSize: number,
        public pageIndex: number,
        public companyId?: number
    ) {
    }
}
