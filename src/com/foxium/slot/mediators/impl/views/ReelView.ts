import {BaseView} from "./BaseView";
import {MovieClip} from "@pixi/animate";
import {SymbolView} from "./SymbolView";
import {AnimateContainer} from "@pixi/animate/lib/animate";
import {gsap} from "gsap";
import {IFactoryImmutable, MessageType} from "domwires";
import {SlotConfig} from "../../../config/Config";
import {inject} from "inversify";
import {ProjectTypes} from "../../../common/ProjectTypes";

export class ReelViewMessageType extends MessageType
{
    public static readonly STOPPED: ReelViewMessageType = new ReelViewMessageType();
}

export class ReelView extends BaseView
{
    @inject(ProjectTypes.IFactoryImmutable)
    private readonly viewFactory!: IFactoryImmutable;

    @inject(ProjectTypes.SlotConfig)
    private readonly config!: SlotConfig;

    @inject(ProjectTypes.SymbolAssetsClass)
    private readonly symbolMovieClass!: { new(): (MovieClip | AnimateContainer) };

    private _reelIndex!: number;
    private readonly symbolViewList: SymbolView[] = [];
    private _isSpinning!: boolean;
    private originY!: number;
    private symbolHeight!: number;
    private _position!: number;

    public set reelIndex(value: number)
    {
        this._reelIndex = value;
    }

    public override set assets(value: MovieClip | AnimateContainer)
    {
        super.assets = value;

        this.init();
    }

    private init(): void
    {
        let y = 0;

        for (let i = 0; i < this.config.visibleSymbolsOnReel + 2; i++)
        {
            const symAssets = new this.symbolMovieClass();

            const sym = this.viewFactory.instantiateValueUnmapped<SymbolView>(SymbolView);
            sym.assets = symAssets;

            if (isNaN(this.symbolHeight))
            {
                this.symbolHeight = sym.normalHeight + this.config.symbolsVerticalGap;
                // y = this.symbolHeight * 2;
            }

            symAssets.y = y;
            this._assets.addChild(symAssets);
            this.symbolViewList.push(sym);

            y = (i != this.config.visibleSymbolsOnReel ? y + this.symbolHeight :
                -this.symbolHeight);
        }

        this.setPosition(0);
    }

    public startSpin(delay?: number): void
    {
        this._isSpinning = true;

        this.originY = this._assets.y;

        if (delay)
        {
            gsap.delayedCall(delay, this.spin.bind(this));
        }
        else
        {
            this.spin();
        }
    }

    private spin(): void
    {
        gsap.to(this._assets, {
            duration: this.config.timings.startSpinAccelerationDuration,
            y: this._assets.y - this.symbolHeight / 2, ease: "power2.inOut", onComplete: () =>
            {
                gsap.to(this._assets, {
                    duration: this.config.timings.startSpinAccelerationDuration / 2,
                    y: this.originY,
                    ease: "power2.in",
                    onComplete: () => this.continueSpin()
                });

                this.symbolViewList.forEach(sym => sym.startBlur());
            }
        });
    }

    private continueSpin(): void
    {
        gsap.to(this._assets, {
            duration: this.config.timings.spinIterationDuration, y: this.originY + this.symbolHeight, ease: "none", onComplete: () =>
            {
                this._assets.y = this.originY;
                this.setPosition(this._position - 1, false);
                this.continueSpin();
            }
        });
    }

    public setPosition(value: number, stop = false): void
    {
        if (stop)
        {
            this._isSpinning = false;

            this.symbolViewList.forEach(symView => symView.stopBlur());

            gsap.killTweensOf(this._assets);

            this._assets.y = this.originY + this.symbolHeight / 2;

            gsap.to(this._assets, {duration: this.config.timings.stopReelDuration, y: this.originY, ease: "power2.in"});

            this.dispatchMessage(ReelViewMessageType.STOPPED);
        }

        const symbolIdList = this.config.reels[this._reelIndex];

        if (value < 0) value = symbolIdList.length - 1;

        this._position = value;

        let next = value;

        for (let i = 0; i < this.config.visibleSymbolsOnReel + 1; i++)
        {
            this.symbolViewList[i].id = symbolIdList[next];

            next++;

            if (next >= symbolIdList.length) next = 0;
        }

        let prev = value - 1;
        if (prev < 0) prev = symbolIdList.length - 1;
        this.symbolViewList[this.config.visibleSymbolsOnReel + 1].id = symbolIdList[prev];
    }

}