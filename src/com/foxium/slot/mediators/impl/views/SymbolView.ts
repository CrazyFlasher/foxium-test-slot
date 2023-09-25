import {BaseView} from "./BaseView";
import {MovieClip} from "@pixi/animate";
import {gsap} from "gsap";
import {AnimateContainer} from "@pixi/animate/lib/animate";
import {inject} from "inversify";
import {ProjectTypes} from "../../../common/ProjectTypes";
import {SlotConfig} from "../../../config/Config";

export class SymbolView extends BaseView
{
    @inject(ProjectTypes.SlotConfig)
    private readonly config!: SlotConfig;

    private normal!: MovieClip;
    private blurred: MovieClip | undefined;

    private _id!: number;

    public override set assets(value: MovieClip | AnimateContainer)
    {
        super.assets = value;

        this.normal = this.getMovieClip("normal");
        this.blurred = this.getMovieClip("blurred");

        this.normal.stop();
        this.blurred.stop();

        if (!this.config.blurSymbolsDuringSpin)
        {
            this.blurred.removeFromParent();
            this.blurred = undefined;
        } else
        {
            this.blur = 0.0;
        }
    }

    public get normalHeight(): number
    {
        return this.normal.height;
    }

    public stopBlur(): void
    {
        if (this.config.blurSymbolsDuringSpin)
        {
            gsap.killTweensOf(this);
            gsap.to(this, {duration: 0.2, blur: 0.0, ease: "power2.out"});
        }
    }

    public startBlur(): void
    {
        if (this.config.blurSymbolsDuringSpin)
        {
            gsap.to(this, {duration: 0.2, blur: 1.0, ease: "power2.in"});
        }
    }

    public set id(value: number)
    {
        this._id = value;

        this.normal.gotoAndStop(value);
        if (this.blurred) this.blurred.gotoAndStop(value);
    }

    public set blur(value: number)
    {
        if (this.config.blurSymbolsDuringSpin)
        {
            this.normal.alpha = 1 - value;
            this.normal.visible = value < 1;

            if (this.blurred)
            {
                this.blurred.alpha = value;
                this.blurred.visible = value > 0;
            }
        }
    }

}