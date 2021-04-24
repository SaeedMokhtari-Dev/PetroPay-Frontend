export default class GetStationUserRequest
{
    constructor(
        public stationId: number,
        public pageSize: number,
        public pageIndex: number
    ) {
    }
}
