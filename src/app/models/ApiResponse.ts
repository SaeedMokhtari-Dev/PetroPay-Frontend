export default class ApiResponse
{
    success: boolean;
    data: any;
    message: string;
    statusCode: number;

    static error(message: string, statusCode: number = null) : ApiResponse
    {
        let response = new ApiResponse();

        response.success = false;
        response.message = message;
        response.statusCode = statusCode;

        return response;
    }
}