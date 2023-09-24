import {AbstractHierarchyObject, definableFromString, IFactory} from "domwires";
import {inject, postConstruct} from "inversify";
import {ProjectTypes} from "../../common/ProjectTypes";
import {IResourceServiceImmutable, ResourceServiceMessageType} from "../../services/IResourceService";
import {INetServiceImmutable, NetServiceMessageType} from "../../services/INetService";
import * as animate from "@pixi/animate";
import {AnimateAsset, MovieClip} from "@pixi/animate";
import {ScreenResizer, ScreenResizerMessageType, ScreenResizerOrientation} from "../../screen/ScreenResizer";
import {SlotView, SlotViewMessageType} from "./views/SlotView";
import {isMobile, Sprite} from "pixi.js";
import {ISceneMediator, SceneMediatorMessageType} from "../ISceneMediator";
import {SlotConfig} from "../../config/Config";
import animateAssets, {animateAssetsScale} from "../../common/PixiAnimateAssets";

import {ITextsModelImmutable} from "../../models/ITextsModel";
import {AssetsQuality} from "../../common/AssetsQuality";

class PixiSceneMediator extends AbstractHierarchyObject implements ISceneMediator
{
    @inject(ProjectTypes.IFactory)
    private readonly viewFactory!: IFactory;

    @inject(ProjectTypes.SlotConfig)
    private readonly config!: SlotConfig;

    @inject(ProjectTypes.ITextModelImmutable)
    private readonly textsModel!: ITextsModelImmutable;

    @inject(ProjectTypes.IResourceServiceImmutable)
    private readonly resourceService!: IResourceServiceImmutable;

    @inject(ProjectTypes.INetServiceImmutable)
    private readonly netService!: INetServiceImmutable;

    private assets!: AnimateAsset;
    
    private app!: animate.Scene;
    private gameContainer!: MovieClip;
    private screenResizer!: ScreenResizer;

    private slotView!: SlotView;
    private bgView!: Sprite;

    private appWidth!: number;
    private appHeight!: number;

    @postConstruct()
    private init(): void
    {
        this.assets = animateAssets();
        
        this.appWidth = this.assets.width;
        this.appHeight = this.assets.height;

        this.addMessageListener(ResourceServiceMessageType.LOAD_COMPLETE, this.resourceServiceLoadComplete);
        this.addMessageListener(NetServiceMessageType.GOT_RESPONSE, this.netServiceGotResponse);
    }

    private resourceServiceLoadComplete(): void
    {
        this.gameContainer = new this.assets.lib["gameContainer"]() as MovieClip;

        this.initPixi();
        this.createBgView();
        this.createGameView();
        this.createScreenResizer();
    }

    private netServiceGotResponse(): void
    {
        const result = this.netService.result;

        this.slotView.update(result.stopPositions, result.winAmount);
    }

    private initPixi(): void
    {
        this.app = new animate.Scene({
            resolution: window.devicePixelRatio || 1,
            resizeTo: window,
            autoDensity: true,
            powerPreference: "high-performance",
            antialias: false,
            clearBeforeRender: false,
            hello: true
        });

        document.body.appendChild(this.app.view as HTMLCanvasElement);
    }

    private createBgView(): void
    {
        this.bgView = this.resourceService.getSprite<Sprite>("images/" + AssetsQuality.current.name + "/bg.jpg");
        this.bgView.anchor.set(0.5);
        this.bgView.scale.set(1 / animateAssetsScale());
        this.gameContainer.addChildAt(this.bgView, 0);

        this.updateBgPos();
    }

    private createGameView(): void
    {
        this.viewFactory.mapToValue(ProjectTypes.SymbolAssetsClass, this.assets.lib["symbolContainer"]);

        this.slotView = this.viewFactory.instantiateValueUnmapped<SlotView>(SlotView);
        this.slotView.assets = this.gameContainer;

        this.slotView.addMessageListener(SlotViewMessageType.SPIN_CLICKED, this.spin.bind(this));

        this.app.stage.addChild(this.gameContainer);
    }

    private createScreenResizer(): void
    {
        this.screenResizer = new ScreenResizer(this.app.screen, this.gameContainer,
            this.appWidth, this.appHeight);

        this.screenResizer.addMessageListener(ScreenResizerMessageType.ORIENTATION_CHANGED,
            this.screenResizerOrientationChanged.bind(this));

        this.screenResizerOrientationChanged();
    }

    private spin(): void
    {
        if (isMobile.any) this.dispatchMessage(SceneMediatorMessageType.FULL_SCREEN);
        this.dispatchMessage(SceneMediatorMessageType.SPIN);
    }

    private updateBgPos(): void
    {
        this.bgView.position.set(this.appWidth / 2, this.appHeight / 2);
    }

    private screenResizerOrientationChanged(): void
    {
        if (this.screenResizer.orientation === ScreenResizerOrientation.HORIZONTAL)
        {
            this.appWidth = this.assets.width;
            this.appHeight = this.assets.height;
        }
        else
        {
            this.appWidth = this.assets.width - 320;
            this.appHeight = this.assets.height + 300;
        }

        this.slotView.orientationChanged(this.screenResizer.orientation === ScreenResizerOrientation.HORIZONTAL);
        this.screenResizer.setAppDimensions(this.appWidth, this.appHeight);
        this.updateBgPos();
        this.screenResizer.update();
    }
}

definableFromString<PixiSceneMediator>(PixiSceneMediator);