import IDeserialize from "app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";
import AdminItem from "./PetrolStationItem";
import CompanyListItem from "./CompanyListItem";
import PetrolStationItem from "./PetrolStationItem";

export default class GetAdminResponse implements IDeserialize
{
    companyListItems: CompanyListItem[] = [];
    petrolStationItems: PetrolStationItem[] = [];
    subscriptionRequests: number;
    rechargeRequests: number;
    carRequests: number;

    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this
    {
        Object.assign(this, input);

        this.companyListItems = this.companyListItems.map(x => new CompanyListItem().deserialize(x));
        this.petrolStationItems =
            this.petrolStationItems.map(x => new PetrolStationItem().deserialize(x));

        return this;
    }
}
