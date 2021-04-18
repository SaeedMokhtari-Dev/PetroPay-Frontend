import {delay} from "./Delay";

export const action = async<T> (method: () => Promise<T>, minExecutionTime: number = 100) =>
{
    let elapsed = 0;
    let tick = 100;

    let timer: NodeJS.Timer;

    try
    {
        startTimer();

        return await method();
    }
    finally
    {
        let diff = minExecutionTime - elapsed;

        if (diff > 0)
        {
            await delay(diff);
        }

        markAsComplete()
    }

    function markAsComplete()
    {
        clearInterval(timer);
    }

    function startTimer()
    {
        timer = setInterval(() =>
        {
            elapsed += tick;

        }, tick);
    }
}
