import {AbstractHierarchyObject, definableFromString} from "domwires";
import {INetService, NetServiceMessageType, Result} from "../INetService";
import {inject} from "inversify";
import {ProjectTypes} from "../../common/ProjectTypes";
import {Config} from "../../config/Config";
import {isNode} from "browser-or-node";
import fs from "fs";

type State = {
    readonly "machine-state": [
        {
            readonly reels: string[][];
            readonly win: number;
        }
    ];
};

class MockNetService extends AbstractHierarchyObject implements INetService
{
    @inject(ProjectTypes.AppConfig)
    private readonly config!: Config;

    private state!: State;
    private currentResponseIndex!: number;

    private _result!: Result;

    public get result(): Result
    {
        return this._result;
    }

    private dataLoaded(jsonStr: string): void
    {
        this.state = JSON.parse(jsonStr);
        this.spin();
    }

    public spin(): void
    {
        if (!this.state)
        {
            this.currentResponseIndex = 0;

            let value: string;

            if (isNode)
            {
                value = fs.readFileSync(this.config.netServiceConfig.baseUrl +
                    this.config.netServiceConfig.spinService, "utf-8");

                this.dataLoaded(value);
            }
            else
            {
                fetch(this.config.netServiceConfig.baseUrl + this.config.netServiceConfig.spinService).then(value =>
                {
                    value.text().then(jsonStr => this.dataLoaded(jsonStr));
                });
            }

            return;
        }

        const currentState = this.state["machine-state"][this.currentResponseIndex];

        this.currentResponseIndex++;
        if (this.currentResponseIndex == this.state["machine-state"].length) this.currentResponseIndex = 0;

        this._result = {winAmount: currentState.win, stopPositions: this.getStopPositions(currentState.reels)};

        if (process.env.DEBUG)
        {
            console.log("state:", currentState);
            console.log("result:", this._result);
        }

        // Simulating network lag
        setTimeout(() =>
        {
            this.dispatchMessage(NetServiceMessageType.GOT_RESPONSE, this._result);
        }, 250);
    }

    private getStopPositions(reels: string[][]): number[]
    {
        const result: number[] = [];

        reels.forEach((singleReel, index) =>
        {
            const configSymbolIdIdList = this.config.slotConfig.reels[index];
            const responseSymbolIdList = this.toIdList(singleReel);

            let configStr = configSymbolIdIdList.join("");
            configStr += configStr;

            const responseStr = responseSymbolIdList.join("");
            const position = configStr.indexOf(responseStr);

            if (position > -1)
            {
                result.push(position);
            } else
            {
                const errorText = "Combination '" + singleReel.join(", ") + "' is missing on reel " + index + "!\n" +
                    "Reel: " + this.toStringList(configSymbolIdIdList).join(", ");

                alert(errorText);
                throw new Error(errorText);
            }

        });

        return result;
    }

    private toIdList(singleReel: string[]): number[]
    {
        const idList: number[] = [];

        singleReel.forEach(value => idList.push(this.config.slotConfig.symbolNameToIdMapping.get(value)!));

        return idList;
    }

    private toStringList(singleReel: readonly number[]): string[]
    {
        const idList: string[] = [];

        const symNameToIdMap = this.config.slotConfig.symbolNameToIdMapping;

        singleReel.forEach(value =>
        {
            for (const key of symNameToIdMap.keys())
            {
                if (symNameToIdMap.get(key) == value)
                {
                    idList.push(key);
                    break;
                }
            }
        });

        return idList;
    }
}

definableFromString<MockNetService>(MockNetService);