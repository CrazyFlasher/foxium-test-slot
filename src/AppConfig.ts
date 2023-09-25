import {Config} from "./com/foxium/slot/config/Config";

const appConfig: Config = {
    netServiceConfig: {
        baseUrl: "./",
        spinService: "results.json"
    },

    slotConfig: {
        currency: "EUR",
        timings: {
            startSpinAccelerationDuration: 0.4,
            spinIterationDuration: 0.1,
            spinAnticipationDuration: 2.0,
            stopEachReelInterval: 0.5,
            startEachReelInterval: 0.25,
            stopReelDuration: 0.2,
        },
        blurSymbolsDuringSpin: true,
        visibleSymbolsOnReel: 3,
        symbolsVerticalGap: 50,
        symbolNameToIdMapping: new Map<string, number>([
            ["H1", 0], ["H2", 1], ["H3", 2], ["H4", 3],
            ["L1", 4], ["L2", 5], ["L3", 6], ["L4", 7],
            ["WILD", 8]
        ]),
        reels: [
            [0, 5, 4, 0, 5, 7, 8, 5, 4, 4, 5, 7, 0, 2, 4, 0, 5, 3, 4, 3, 0, 7, 0, 4, 2, 7, 8],
            [5, 0, 4, 8, 0, 4, 4, 0, 6, 5, 2, 4, 5, 0, 3, 2, 5, 1, 2, 0, 4],
            [6, 1, 3, 6, 5, 3, 6, 1, 8, 8, 1, 3, 4, 1, 3, 6, 2, 3, 6, 1, 2, 8, 1, 4, 4, 2, 5]
        ]
    }
};

export default appConfig;