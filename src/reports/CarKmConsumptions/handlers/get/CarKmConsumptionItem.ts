import IDeserialize from "../../../../app/interfaces/deserialize";
import {makeAutoObservable} from "mobx";

export default class CarKmConsumptionItem implements IDeserialize
{
    key: string;
    carId: number;
    dateMin: string;
    odometerValueMin: number;
    dateMax: string;
    odometerValueMax: number;
    carOdometerConsumption: number;


    constructor() {
        makeAutoObservable(this);
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
