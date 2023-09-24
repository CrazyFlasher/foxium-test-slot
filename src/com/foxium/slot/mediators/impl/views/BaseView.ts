import {MovieClip, Text} from "@pixi/animate";
import {AnimateContainer} from "@pixi/animate/lib/animate";
import {MessageDispatcher} from "domwires";

export class BaseView extends MessageDispatcher
{
    protected _assets!: MovieClip | AnimateContainer;

    public set assets(value: MovieClip | AnimateContainer)
    {
        if (this._assets) throw new Error("assets already assigned!");

        this._assets = value;
    }

    public getMovieClip(nameOrIndex: string | number): MovieClip
    {
        return (typeof nameOrIndex === "string" ? this._assets.getChildByName(nameOrIndex) :
            this._assets.getChildAt(nameOrIndex)) as MovieClip;
    }

    public getText(name: string): Text
    {
        return this._assets.getChildByName(name) as Text;
    }
}