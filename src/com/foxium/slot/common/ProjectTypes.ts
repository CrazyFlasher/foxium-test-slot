export class ProjectTypes
{
    public static readonly string = "string";
    public static readonly number = "number";
    public static readonly IFactory = "IFactory";
    public static readonly IFactoryImmutable = "IFactoryImmutable";
    public static readonly FactoriesConfig = "FactoriesConfig";
    public static readonly AppConfig = "AppConfig";
    public static readonly SlotConfig = "SlotConfig";


    public static readonly SymbolAssetsClass = "SymbolAssetsClass";
    public static readonly ITextModel = "ITextModel";
    public static readonly ITextModelImmutable = "ITextModelImmutable";
    public static readonly IResourceService = "IResourceService";
    public static readonly IResourceServiceImmutable = "IResourceServiceImmutable";
    public static readonly INetService = "INetService";
    public static readonly INetServiceImmutable = "INetServiceImmutable";
    public static readonly ISceneMediator = "ISceneMediator";

    // implementations

    public static readonly MockNetService = "MockNetService";
    public static readonly PixiSceneMediator = "PixiSceneMediator";
    public static readonly PixiResourceService = "PixiResourceService";
}