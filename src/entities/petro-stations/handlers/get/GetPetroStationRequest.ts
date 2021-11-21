export default class GetPetroStationRequest
{
    constructor(
        public pageSize: number,
        public pageIndex: number,
        public petroCompanyId?: number
    ) {
    }
}
