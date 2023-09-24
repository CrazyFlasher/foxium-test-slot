import {AbstractHierarchyObject, IHierarchyObject, IHierarchyObjectImmutable, MessageType} from "domwires";
import {inject} from "inversify";
import {ProjectTypes} from "../common/ProjectTypes";
import {ITextsModel} from "../models/ITextsModel";

export class ResourceServiceMessageType extends MessageType
{
    public static readonly LOAD_COMPLETE: ResourceServiceMessageType = new ResourceServiceMessageType();
    public static readonly LOAD_ERROR: ResourceServiceMessageType = new ResourceServiceMessageType();

    public constructor(name?: string)
    {
        super(name);
    }
}

export interface IResourceServiceImmutable extends IHierarchyObjectImmutable
{
    getSprite<T>(id: string): T;
}

export interface IResourceService extends IResourceServiceImmutable, IHierarchyObject
{
    load(): IResourceService;
}

export abstract class AbstractResourceService extends AbstractHierarchyObject implements IResourceService
{
    @inject(ProjectTypes.ITextModel)
    private readonly textsModel!: ITextsModel;

    public load(): IResourceService
    {
        this.loadTexts();

        return this;
    }

    private loadTexts(): IResourceService
    {
        fetch("./texts.csv").then(value =>
        {
            value.text().then(jsonStr =>
            {
                this.textsModel.fromCsv(jsonStr);

                this.textsLoaded();
            });
        });

        return this;
    }

    protected textsLoaded(): void
    {
        this.dispatchMessage(ResourceServiceMessageType.LOAD_COMPLETE);
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public getSprite<T>(id: string): T
    {
        throw new Error("override!");
    }

}