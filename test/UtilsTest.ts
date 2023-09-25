/* eslint-disable @typescript-eslint/no-empty-function */

import "reflect-metadata";
import {Suite} from "mocha";
import appConfig from "../src/AppConfig";
import {expect} from "chai";
import {map} from "../src/com/foxium/slot/utils/Utils";

describe('UtilsTest', function (this: Suite)
{
    it('testMap', () =>
    {
        const json = {
            "slotConfig": {
                "currency": "USD",
                "blurSymbolsDuringSpin": false,
                "timings": {
                    "spinAnticipationDuration": 3.0
                }
            }
        };

        const config = appConfig;

        expect(config.slotConfig.timings.spinAnticipationDuration).equals(2.0);
        expect(config.slotConfig.timings.stopReelDuration).equals(0.2);
        expect(config.slotConfig.currency).equals("EUR");
        expect(config.slotConfig.blurSymbolsDuringSpin).equals(true);

        map(json, config);

        expect(config.slotConfig.timings.spinAnticipationDuration).equals(3.0);
        expect(config.slotConfig.timings.stopReelDuration).equals(0.2);
        expect(config.slotConfig.currency).equals("USD");
        expect(config.slotConfig.blurSymbolsDuringSpin).equals(false);
    });
});