import {makeAutoObservable} from "mobx";

export default class CarAmount {

    carId: number;
    amount: number;

    constructor() {
        makeAutoObservable(this);
    }
}