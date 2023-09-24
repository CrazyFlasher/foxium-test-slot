import {Container} from "pixi.js";
import {Button} from "@pixi/ui";

export class ButtonUI
{
    private readonly _button: Button;
    private readonly _assets: Container;

    public constructor(assets: Container)
    {
        this._assets = assets;

        const buttonUp = () => assets.scale.set(1.0);

        this._button = new Button(assets);
        this._button.onDown.connect(() => assets.scale.set(1.1));
        this._button.onUp.connect(buttonUp);
        this._button.onUpOut.connect(buttonUp);
    }

    public get button(): Button
    {
        return this._button;
    }

    public get assets(): Container
    {
        return this._assets;
    }
}