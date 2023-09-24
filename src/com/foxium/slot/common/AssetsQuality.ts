import {Enum} from "domwires";
import {isMobile} from "pixi.js";

export class AssetsQuality extends Enum
{
    public static readonly HIGH: AssetsQuality = new AssetsQuality("high");
    public static readonly MEDIUM: AssetsQuality = new AssetsQuality("medium");
    public static readonly LOW: AssetsQuality = new AssetsQuality("low");

    private static _current: AssetsQuality;

    static
    {
        const forcedQuality = new URLSearchParams(window.location.search).get("quality");

        if (forcedQuality)
        {
            AssetsQuality._current = AssetsQuality.fromString(forcedQuality);
        } else
        {
            // TODO: extend quality choosing logic

            const maxDimension = Math.max(window.screen.width, window.screen.height);
            const dpr = window.devicePixelRatio;

            if(!isMobile.any && maxDimension * dpr > 2560)
            {
                AssetsQuality._current =  AssetsQuality.HIGH;
            } else
            if(isMobile.any && maxDimension * dpr <= 1280)
            {
                AssetsQuality._current =  AssetsQuality.LOW;
            } else
            {
                AssetsQuality._current =  AssetsQuality.MEDIUM;
            }
        }

        console.log("Assets quality:", AssetsQuality._current.name);
    }

    private static fromString(value: string): AssetsQuality
    {
        if (value == AssetsQuality.HIGH.name) return AssetsQuality.HIGH;
        if (value == AssetsQuality.MEDIUM.name) return AssetsQuality.MEDIUM;
        if (value == AssetsQuality.LOW.name) return AssetsQuality.LOW;

        console.warn("Unknown quality '" + value + "'. Set 'high', 'medium' or 'low'");

        return AssetsQuality.MEDIUM;
    }

    public static get current(): AssetsQuality
    {
        return this._current;
    }
}