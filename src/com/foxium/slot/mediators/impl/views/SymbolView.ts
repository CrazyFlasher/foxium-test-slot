import {BaseView} from "./BaseView";
import {MovieClip} from "@pixi/animate";
import {gsap} from "gsap";
import {AnimateContainer} from "@pixi/animate/lib/animate";

export class SymbolView extends BaseView
{
    private normal!: MovieClip;
    private blurred!: MovieClip;

    private _id!: number;

    public override set assets(value: MovieClip | AnimateContainer)
    {
        super.assets = value;

        this.normal = this.getMovieClip("normal");
        this.blurred = this.getMovieClip("blurred");

        this.normal.stop();
        this.blurred.stop();

        this.blur = 0.0;
    }

    public get normalHeight(): number
    {
        return this.normal.height;
    }

    public stopBlur(): void
    {
        gsap.killTweensOf(this);
        gsap.to(this, {duration: 0.2, blur: 0.0, ease: "power2.out"});
    }

    public startBlur(): void
    {
        gsap.to(this, {duration: 0.2, blur: 1.0, ease: "power2.in"});
    }

    public set id(value: number)
    {
        this._id = value;

        this.normal.gotoAndStop(value);
        this.blurred.gotoAndStop(value);
    }

    public set blur(value: number)
    {
        this.normal.alpha = 1 - value;
        this.blurred.alpha = value;

        this.normal.visible = value < 1;
        this.blurred.visible = value > 0;
    }

}