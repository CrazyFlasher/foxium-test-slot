import "../services/INetService";
import "../models/ITextsModel";

import "../mediators/impl/PixiSceneMediator";
import "../services/impl/PixiResourceService";
import "../services/impl/MockNetService";

import {AbstractContext, Factory, IFactory} from "domwires";
import {IResourceService, ResourceServiceMessageType} from "../services/IResourceService";
import {ISceneMediator, SceneMediatorMessageType} from "../mediators/ISceneMediator";
import {ProjectTypes} from "../common/ProjectTypes";
import {inject} from "inversify";
import {INetService} from "../services/INetService";
import {SpinCommand} from "../commands/SpinCommand";
import {FactoriesConfig} from "../../../../FactoriesConfig";
import {FullScreenCommand} from "../commands/FullScreenCommand";
import {Config} from "../config/Config";
import {AllowsFullScreenGuards} from "../commands/guards/AllowsFullScreenGuards";
import {ITextsModel} from "../models/ITextsModel";
import {LoadResourcesCommand} from "../commands/LoadResourcesCommand";
import {RemovePreloaderCommand} from "../commands/RemovePreloaderCommand";

export class MainContext extends AbstractContext
{
    @inject(ProjectTypes.AppConfig)
    private appConfig!: Config;

    @inject(ProjectTypes.FactoriesConfig)
    private factoriesConfig!: FactoriesConfig;

    private resourceService!: IResourceService;
    private netService!: INetService;
    private sceneMediator!: ISceneMediator;
    private textsModel!: ITextsModel;

    private modelFactory!: IFactory;
    private mediatorFactory!: IFactory;
    private viewFactory!: IFactory;

    protected override init(): void
    {
        super.init();

        this.createFactories();
        this.createTextsModel();
        this.createResourceService();
        this.createNetService();
        this.createMediators();
        this.mapCommands();

        this.executeCommand(LoadResourcesCommand);
    }

    private mapCommands(): void
    {
        this.map(ResourceServiceMessageType.LOAD_COMPLETE, RemovePreloaderCommand);
        this.map(SceneMediatorMessageType.SPIN, SpinCommand);
        this.map(SceneMediatorMessageType.FULL_SCREEN, FullScreenCommand).addGuards(AllowsFullScreenGuards);
    }

    private createFactories(): void
    {
        this.modelFactory = new Factory(this.logger);
        this.mediatorFactory = new Factory(this.logger);
        this.viewFactory = new Factory(this.logger);

        this.modelFactory.appendMappingConfig(this.factoriesConfig.modelFactory!);
        this.mediatorFactory.appendMappingConfig(this.factoriesConfig.mediatorFactory!);
        this.viewFactory.appendMappingConfig(this.factoriesConfig.viewFactory!);

        // mediatorFactory will inject viewFactory to instances
        this.mediatorFactory.mapToValue(ProjectTypes.IFactory, this.viewFactory);

        // viewFactory will inject itself to instances
        this.viewFactory.mapToValue(ProjectTypes.IFactoryImmutable, this.viewFactory);

        this.mapConfig();
    }

    private mapConfig(): void
    {
        // modelFactory will inject appConfig to instances
        this.modelFactory.mapToValue(ProjectTypes.AppConfig, this.appConfig);

        // mediatorFactory will inject slotConfig to instances
        this.mediatorFactory.mapToValue(ProjectTypes.SlotConfig, this.appConfig.slotConfig);

        // viewFactory will inject slotConfig to instances
        this.viewFactory.mapToValue(ProjectTypes.SlotConfig, this.appConfig.slotConfig);
    }

    private createMediators(): void
    {
        this.sceneMediator = this.mediatorFactory.getInstance(ProjectTypes.ISceneMediator);

        this.addMediator(this.sceneMediator);
    }

    private createResourceService(): void
    {
        this.resourceService = this.modelFactory.getInstance(ProjectTypes.IResourceService);

        // mediatorFactory will inject resourceService immutable interface to instances
        this.mediatorFactory.mapToValue(ProjectTypes.IResourceServiceImmutable, this.resourceService);

        // Internal context factory will inject resourceService mutable interface to commands
        this.factory.mapToValue(ProjectTypes.IResourceService, this.resourceService);

        this.addModel(this.resourceService);
    }

    private createNetService(): void
    {
        this.netService = this.modelFactory.getInstance(ProjectTypes.INetService);

        // mediatorFactory will inject netService immutable interface to instances
        this.mediatorFactory.mapToValue(ProjectTypes.INetServiceImmutable, this.netService);

        // Internal context factory will inject netService mutable interface to commands
        this.factory.mapToValue(ProjectTypes.INetService, this.netService);

        this.addModel(this.netService);
    }

    private createTextsModel(): void
    {
        this.textsModel = this.modelFactory.getInstance(ProjectTypes.ITextModel);

        // modelFactory will inject textsModel to instances
        this.modelFactory.mapToValue(ProjectTypes.ITextModel, this.textsModel);

        // viewFactory will inject textsModel immutable interface to instances
        this.viewFactory.mapToValue(ProjectTypes.ITextModelImmutable, this.textsModel);

        this.addModel(this.textsModel);
    }
}