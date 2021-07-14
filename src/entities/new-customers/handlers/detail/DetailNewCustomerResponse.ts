import IDeserialize from "app/interfaces/deserialize";

export default class DetailNewCustomerResponse implements IDeserialize
{
    custReqId: number;
    custName: string;
    custCompany: string;
    custEmail: string;
    custPhoneNumber: string;
    custAddress: string;
    custReqStatus: boolean;
    cutReqDatetime: string;


    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
