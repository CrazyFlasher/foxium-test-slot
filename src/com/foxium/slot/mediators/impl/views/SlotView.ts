import {BaseView} from "./BaseView";
import {MovieClip} from "@pixi/animate";
import {ReelView, ReelViewMessageType} from "./ReelView";
import {AnimateContainer} from "@pixi/animate/lib/animate";
import {ButtonUI} from "../ui/ButtonUI";
import {gsap} from "gsap";
import {WinView} from "./WinView";
import {IFactoryImmutable, MessageType} from "domwires";
import {SlotConfig} from "../../../config/Config";
import {ITextsModelImmutable} from "../../../models/ITextsModel";
import {inject} from "inversify";
import {ProjectTypes} from "../../../common/ProjectTypes";

export class SlotViewMessageType extends MessageType
{
    public static readonly SPIN_CLICKED: SlotViewMessageType = new SlotViewMessageType();
}

export class SlotView extends BaseView
{
    @inject(ProjectTypes.IFactoryImmutable)
    private readonly viewFactory!: IFactoryImmutable;

    @inject(ProjectTypes.SlotConfig)
    private readonly config!: SlotConfig;

    @inject(ProjectTypes.ITextModelImmutable)
    private readonly texts!: ITextsModelImmutable;

    private readonly reelViewList: ReelView[] = [];
    private spinButton!: ButtonUI;
    private winView!: WinView;
    private spinTimeComplete!: boolean;
    private gotResult!: boolean;
    private stopPositions!: number[];
    private winAmount!: number;


    public override set assets(value: MovieClip | AnimateContainer)
    {
        super.assets = value;

        this.spinButton = new ButtonUI(this.getMovieClip("spinButton"));
        this.spinButton.button.onPress.connect(this.startSpin.bind(this));

        const reelsContainer: AnimateContainer = this.getMovieClip("reelsContainer");

        for (let i = 0; i < this.config.reels.length; i++)
        {
            const reelView = this.viewFactory.instantiateValueUnmapped<ReelView>(ReelView);
            reelView.reelIndex = i;
            reelView.assets = reelsContainer.getChildByName("reel_" + (i + 1)) as MovieClip;

            this.reelViewList.push(reelView);

            if (i === this.config.reels.length - 1)
            {
                reelView.addMessageListener(ReelViewMessageType.STOPPED, this.reelViewStopped.bind(this));
            }
        }

        this.winView = this.viewFactory.instantiateValueUnmapped<WinView>(WinView);
        this.winView.assets = this.getMovieClip("winContainer");
    }

    private reelViewStopped(): void
    {
        this.winView.value = this.winAmount;

        this.spinButton.button.enabled = true;
    }

    private startSpin(): void
    {
        this.spinButton.button.enabled = false;
        this.winView.clear();

        this.reelViewList.forEach((reelView, index) =>
            reelView.startSpin(index * this.config.timings.startEachReelInterval));

        this.spinTimeComplete = this.gotResult = false;

        gsap.delayedCall(this.config.timings.spinAnticipationDuration, () =>
        {
            this.spinTimeComplete = true;

            if (this.gotResult) this.stopReels();
        });

        this.dispatchMessage(SlotViewMessageType.SPIN_CLICKED);
    }

    public update(stopPositions: number[], winAmount: number): void
    {
        this.gotResult = true;

        this.stopPositions = stopPositions;
        this.winAmount = winAmount;

        if (this.spinTimeComplete) this.stopReels();
    }

    private stopReels(): void
    {
        this.reelViewList.forEach((reelView, index) =>
        {
            gsap.delayedCall(index * this.config.timings.stopEachReelInterval,
                () => reelView.setPosition(this.stopPositions[index], true));
        });
    }

    public orientationChanged(isHorizontal: boolean): void
    {
        const placeHolder = this.getMovieClip("spinButtonPlaceHolder_" + (isHorizontal ? "h" : "v"));
        this.spinButton.assets.position.set(placeHolder.x, placeHolder.y);
    }
}