export default class LoginRequest
{
    constructor(
        public roleType: number,
        public username: string,
        public password: string
    ) {
    }
}
