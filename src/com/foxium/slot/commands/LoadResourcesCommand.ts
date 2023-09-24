import {AbstractCommand, lazyInject} from "domwires";
import {ProjectTypes} from "../common/ProjectTypes";
import {IResourceService} from "../services/IResourceService";

export class LoadResourcesCommand extends AbstractCommand
{
    @lazyInject(ProjectTypes.IResourceService)
    private readonly resourceService!: IResourceService;

    public override execute(): void
    {
        super.execute();

        this.resourceService.load();
    }
}