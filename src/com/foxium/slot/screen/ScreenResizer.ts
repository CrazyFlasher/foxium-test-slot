import {Enum, MessageDispatcher, MessageType} from "domwires";
import {Point, Rectangle} from '@pixi/core';
import {DisplayObject} from "pixi.js";

export class ScreenResizerOrientation extends Enum
{
    public static readonly VERTICAL: ScreenResizerOrientation = new ScreenResizerOrientation();
    public static readonly HORIZONTAL: ScreenResizerOrientation = new ScreenResizerOrientation();
}

export class ScreenResizerMessageType extends MessageType
{
    public static readonly ORIENTATION_CHANGED: ScreenResizerMessageType = new ScreenResizerMessageType();
}

export class ScreenResizer extends MessageDispatcher
{
    private readonly source: DisplayObject;
    private readonly screen: Rectangle;
    private readonly padding: Rectangle;
    private appWidth!: number;
    private appHeight!: number;
    private readonly updateDelayMs: number;
    private updateTimeout!: ReturnType<typeof setTimeout>;

    private _orientation!: ScreenResizerOrientation;

    public constructor(screen: Rectangle, source: DisplayObject, appWidth: number, appHeight: number,
                       padding = new Rectangle(), updateDelayMs = 100)
    {
        super();

        this.screen = screen;
        this.source = source;
        this.padding = padding;
        this.updateDelayMs = updateDelayMs;

        this.setAppDimensions(appWidth, appHeight);

        this.init();
    }

    public setAppDimensions(appWidth: number, appHeight: number): void
    {
        this.appWidth = appWidth;
        this.appHeight = appHeight;
    }

    private init(): void
    {
        window.addEventListener("resize", this.handleResize.bind(this));

        this.update();
    }

    public override dispose(): void
    {
        window.removeEventListener("resize", this.handleResize.bind(this));

        if (this.source)
        {
            this.source.scale.set(1.0);
        }

        super.dispose();
    }

    private handleResize(): void
    {
        if (this.updateDelayMs > 0)
        {
            if (this.updateTimeout) clearTimeout(this.updateTimeout);

            this.updateTimeout = setTimeout(this.update.bind(this), this.updateDelayMs);
        }
        else
        {
            this.update();
        }
    }

    public update(): void
    {
        const width: number = this.screen.width;
        const height: number = this.screen.height;

        const decHeight: number = height * (this.padding.bottom + this.padding.top);
        const decWidth: number = width * (this.padding.left + this.padding.right);

        const scaleX: number = (width - decWidth) / this.appWidth;
        const scaleY: number = (height - decHeight) / this.appHeight;
        const scale: number = scaleX < scaleY ? scaleX : scaleY;

        this.source.scale = new Point(scale, scale);

        this.source.x = (width - this.appWidth * scale) / 2
            + (width * this.padding.left - width * this.padding.right) / 2;

        this.source.y = (height - this.appHeight * scale) / 2
            + (height * this.padding.top - height * this.padding.bottom) / 2;

        const orientation = this.screen.width > this.screen.height ? ScreenResizerOrientation.HORIZONTAL :
            ScreenResizerOrientation.VERTICAL;

        if (!this._orientation || this._orientation != orientation)
        {
            this._orientation = orientation;

            this.dispatchMessage(ScreenResizerMessageType.ORIENTATION_CHANGED);
        }
    }

    public get orientation(): ScreenResizerOrientation
    {
        return this._orientation;
    }
}