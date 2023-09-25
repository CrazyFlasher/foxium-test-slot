import {FactoryConfig} from "domwires";
import {ProjectTypes} from "./com/foxium/slot/common/ProjectTypes";

export type FactoriesConfig = {
    readonly modelFactory?: FactoryConfig;
    readonly mediatorFactory?: FactoryConfig;
    readonly viewFactory?: FactoryConfig;
};

const factoriesConfig: FactoriesConfig = {
    modelFactory: new Map([
        // Using this value from config.json as showcase
        // [ProjectTypes.INetService, {implementation: ProjectTypes.MockNetService}],

        [ProjectTypes.IResourceService, {implementation: ProjectTypes.PixiResourceService}],
    ]),

    mediatorFactory: new Map([
        [ProjectTypes.ISceneMediator, {implementation: ProjectTypes.PixiSceneMediator}],
    ]),

    viewFactory: new Map()
};

export default factoriesConfig;