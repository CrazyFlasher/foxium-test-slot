import animateAssetHigh from "../../../../../assets/fla/high/lib.js";
import animateAssetMedium from "../../../../../assets/fla/medium/lib.js";
import animateAssetLow from "../../../../../assets/fla/low/lib.js";

import {AssetsQuality} from "./AssetsQuality";
import {AnimateAsset} from "@pixi/animate";

const animateAssets = (): AnimateAsset =>
{
    if (AssetsQuality.current == AssetsQuality.HIGH) return animateAssetHigh;
    if (AssetsQuality.current == AssetsQuality.MEDIUM) return animateAssetMedium;

    return animateAssetLow;
};

export const animateAssetsScale = (): number =>
{
    return parseFloat(animateAssets().spritesheets[0].data.meta.scale);
};

export default animateAssets;