import {definableFromString} from "domwires";
import {Assets, Sprite} from "pixi.js";
import * as animate from "@pixi/animate";
import {load} from "@pixi/animate";
import {AbstractResourceService, IResourceService, ResourceServiceMessageType} from "../IResourceService";
import animateAssets from "../../common/PixiAnimateAssets";
import {AssetsQuality} from "../../common/AssetsQuality";

class PixiResourceService extends AbstractResourceService implements IResourceService
{
    protected override textsLoaded(): void
    {
        Assets.load("images/" + AssetsQuality.current.name + "/bg.jpg").then(() =>
        {
            const assets = animateAssets();
            assets.setup(animate);

            // TODO: handle errors
            load(assets, {
                createInstance: false,
                basePath: "fla/" + AssetsQuality.current.name,
                complete: () =>
                {
                    this.dispatchMessage(ResourceServiceMessageType.LOAD_COMPLETE);
                }
            });
        });
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    public override getSprite(id: string): any
    {
        return Sprite.from(id);
    }
}

definableFromString<PixiResourceService>(PixiResourceService);