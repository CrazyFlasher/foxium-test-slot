export type TimingsConfig = {
    readonly startSpinAccelerationDuration: number;
    readonly spinAnticipationDuration: number;
    readonly stopEachReelInterval: number;
    readonly startEachReelInterval: number;
    readonly stopReelDuration: number;
    readonly spinIterationDuration: number;
};

export type SlotConfig = {
    readonly currency: string;
    readonly timings: TimingsConfig;
    readonly visibleSymbolsOnReel: number;
    readonly symbolsVerticalGap: number;
    readonly symbolNameToIdMapping: ReadonlyMap<string, number>;
    readonly reels: ReadonlyArray<ReadonlyArray<number>>;
};

export type NetServiceConfig = {
    readonly baseUrl: string;
    readonly spinService: string;
};

export type Config = {
    readonly slotConfig: SlotConfig;

    readonly netServiceConfig: NetServiceConfig;
};

