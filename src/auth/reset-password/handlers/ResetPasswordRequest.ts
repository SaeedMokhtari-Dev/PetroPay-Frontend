export default class ResetPasswordRequest
{
    constructor(
        public roleType: number,
        public email: string

    ) {
    }
}
