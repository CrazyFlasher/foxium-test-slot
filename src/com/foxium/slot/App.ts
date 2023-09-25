import "reflect-metadata";

import {AbstractApp} from "domwires/dist/com/domwires/core/app/AbstractApp";
import {Factory, FactoryConfig, IFactory, Logger} from "domwires";
import {postConstruct} from "inversify";
import {ProjectTypes} from "./common/ProjectTypes";
import {MainContext} from "./contexts/MainContext";
import factoriesConfig from "../../../FactoriesConfig";
import {Config} from "./config/Config";
import {logLevel, map} from "./utils/Utils";
import appConfig from "../../../AppConfig";

export class App extends AbstractApp<{ factoriesConfig: FactoryConfig; appConfig: Config }>
{
    @postConstruct()
    private startUp(): void
    {
        this.loadConfig(success =>
        {
            if (success)
            {
                this.initApp();
            }
            else
            {
                this.fatal("Failed to start App!");
            }
        });
    }

    private initApp(): void
    {
        // merging values from loaded config to hardcoded
        map(this.appConfigJson.factoriesConfig, factoriesConfig);
        map(this.appConfigJson.appConfig, appConfig);

        const factory: IFactory = new Factory(new Logger(logLevel()));
        factory.mapToValue(ProjectTypes.IFactory, factory);
        factory.mapToValue(ProjectTypes.FactoriesConfig, factoriesConfig);
        factory.mapToValue(ProjectTypes.AppConfig, appConfig);

        // initializing main context
        factory.getInstance<MainContext>(MainContext);
    }
}

new Factory(new Logger(logLevel())).getInstance<App>(App);