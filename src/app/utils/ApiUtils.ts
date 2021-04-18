
export function endpointUrl(endpoint: string): string
{
    return process.env.REACT_APP_API_SERVER_ADDRESS + endpoint;
}