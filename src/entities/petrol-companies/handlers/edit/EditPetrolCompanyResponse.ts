import IDeserialize from "app/interfaces/deserialize";

export default class EditPetrolCompanyResponse implements IDeserialize
{
    deserialize(input: any): this
    {
        Object.assign(this, input);
        return this;
    }
}
