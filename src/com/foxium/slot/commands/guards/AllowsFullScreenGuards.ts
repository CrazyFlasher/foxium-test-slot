import {AbstractGuards} from "domwires";
import screenfull from "screenfull";

export class AllowsFullScreenGuards extends AbstractGuards
{
    public override get allows(): boolean
    {
        return screenfull.isEnabled && !screenfull.isFullscreen;
    }
}