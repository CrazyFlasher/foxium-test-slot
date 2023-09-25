import {LogLevel} from "domwires/dist/com/domwires/logger/ILogger";

export function map(from: object, to: object, recursive = true): void
{
    for (const propName of Object.keys(from))
    {
        const fromValue = Reflect.get(from, propName);
        const toValue = Reflect.get(to, propName);

        if (fromValue != undefined)
        {
            if (recursive && typeof fromValue == "object")
            {
                if (toValue != undefined)
                {
                    map(fromValue, toValue);
                }
                else
                {
                    if (to instanceof Map)
                    {
                        (to as Map<unknown, unknown>).set(propName, fromValue);
                    }
                    else
                    {
                        Reflect.set(to, propName, fromValue);
                    }
                }
            }
            else
            {
                Reflect.set(to, propName, fromValue);
            }
        }
    }
}

export function logLevel(): LogLevel
{
    return process.env.DEBUG ? LogLevel.VERBOSE : LogLevel.ERROR;
}

