export default class ChangePasswordRequest
{
    constructor(
        public token: string,
        public newPassword: string,
        public confirmPassword: string
    ) {
    }
}