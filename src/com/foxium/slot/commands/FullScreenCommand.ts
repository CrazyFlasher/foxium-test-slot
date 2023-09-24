import {AbstractCommand} from "domwires";
import screenfull from "screenfull";

export class FullScreenCommand extends AbstractCommand
{
    public override execute(): void
    {
        super.execute();

        screenfull.request(document.getElementsByTagName("canvas")[0]);
    }
}