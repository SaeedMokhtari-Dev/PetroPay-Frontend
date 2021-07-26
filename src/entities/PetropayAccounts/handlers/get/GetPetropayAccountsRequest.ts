export default class GetPetropayAccountsRequest
{
    pageSize: number;
    pageIndex: number;

    dateFrom: string;
    dateTo: string;
    petropayAccountId: number;
    exportToFile: boolean;

    constructor(
    ) {
    }
}
