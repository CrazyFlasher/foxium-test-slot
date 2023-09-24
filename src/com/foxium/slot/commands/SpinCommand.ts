import {AbstractCommand} from "domwires";
import {inject} from "inversify";
import {ProjectTypes} from "../common/ProjectTypes";
import {INetService} from "../services/INetService";

export class SpinCommand extends AbstractCommand
{
    @inject(ProjectTypes.INetService)
    private readonly netService!: INetService;

    public override execute(): void
    {
        super.execute();

        this.netService.spin();
    }
}