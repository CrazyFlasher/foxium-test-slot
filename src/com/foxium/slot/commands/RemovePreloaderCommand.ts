import {AbstractCommand} from "domwires";

export class RemovePreloaderCommand extends AbstractCommand
{
    public override execute(): void
    {
        super.execute();

        document.querySelector(".preloader")!.remove();
    }
}