import {BaseView} from "./BaseView";
import {MovieClip, Text} from "@pixi/animate";
import {ITextsModelImmutable} from "../../../models/ITextsModel";
import {inject} from "inversify";
import {ProjectTypes} from "../../../common/ProjectTypes";
import {AnimateContainer} from "@pixi/animate/lib/animate";
import {SlotConfig} from "../../../config/Config";
import {gsap} from "gsap";

export class WinView extends BaseView
{
    @inject(ProjectTypes.SlotConfig)
    private readonly config!: SlotConfig;

    @inject(ProjectTypes.ITextModelImmutable)
    private readonly texts!: ITextsModelImmutable;

    private labelTf!: Text;
    private valueTf!: Text;
    private _amount = 0;

    public override set assets(value: MovieClip | AnimateContainer)
    {
        super.assets = value;

        this.labelTf = this.getText("labelTf");
        this.valueTf = this.getText("valueTf");

        this.localize();

        this.clear();
    }

    public set value(value: number)
    {
        gsap.to(this, {duration: 1.0, amount: value, ease: "power2.out"});
    }

    private set amount(value: number)
    {
        this._amount = value;

        this.valueTf.text = this.config.currency + " " + value.toFixed(2);
    }

    private get amount(): number
    {
        return this._amount;
    }

    private localize(): void
    {
        this.labelTf.text = this.texts.get("win_label");
    }

    public clear(): void
    {
        const tweens = gsap.getTweensOf(this, true);
        if (tweens.length > 0) tweens[0].kill(this);

        this._amount = 0;
        this.valueTf.text = "-";
    }
}