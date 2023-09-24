import "reflect-metadata";

import "../src/com/foxium/slot/services/impl/MockNetService";

import {Suite} from "mocha";
import appConfig from "../src/AppConfig";
import {INetService, NetServiceMessageType} from "../src/com/foxium/slot/services/INetService";
import {Factory, IFactory, Logger} from "domwires";
import {LogLevel} from "domwires/dist/com/domwires/logger/ILogger";
import {ProjectTypes} from "../src/com/foxium/slot/common/ProjectTypes";
import {FactoriesConfig} from "../src/FactoriesConfig";
import {expect} from "chai";
import {map} from "../src/com/foxium/slot/utils/Utils";

describe('MockNetServiceTest', function (this: Suite)
{
    let service: INetService;

    beforeEach(() =>
    {
        const factory: IFactory = new Factory(new Logger(LogLevel.INFO));
        const factoriesConfig: FactoriesConfig = {
            modelFactory: new Map([
                [ProjectTypes.INetService, {implementation: ProjectTypes.MockNetService}],
            ]),
        };

        const config = appConfig;
        const netConfig = {
            netServiceConfig: {baseUrl: "./assets/template/"}
        };

        map(netConfig, config);

        factory.appendMappingConfig(factoriesConfig.modelFactory!);
        factory.mapToValue(ProjectTypes.AppConfig, config);

        service = factory.getInstance(ProjectTypes.INetService);
    });

    it('testReelPosition', done =>
    {
        let iteration = 0;

        service.addMessageListener(NetServiceMessageType.GOT_RESPONSE, () =>
        {
            if (iteration < 5)
            {
                const stopPos = service.result.stopPositions.toString();

                if (iteration == 0)
                {
                    expect(stopPos).equals("0,0,0");
                } else
                if (iteration == 1)
                {
                    expect(stopPos).equals("3,0,3");
                } else
                if (iteration == 2)
                {
                    expect(stopPos).equals("0,0,6");
                } else
                if (iteration == 3)
                {
                    expect(stopPos).equals("6,3,9");
                } else
                if (iteration == 4)
                {
                    expect(stopPos).equals("9,6,12");
                }

                iteration++;

                service.spin();
            }
            else
            {
                done();
            }
        });

        service.spin();
    });
});