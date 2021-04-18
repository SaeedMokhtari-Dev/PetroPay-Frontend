export function isNullOrEmpty(str: string): boolean
{
    return (!str || str.length === 0 || !str.trim());
}