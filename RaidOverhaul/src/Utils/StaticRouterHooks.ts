import type { IPmcData } from "@spt/models/eft/common/IPmcData";
import { Base } from "../BaseFeatures/baseFeatures";
import { LegionData } from "../RaidBoss/Legion";
import { TraderData } from "../Trader/ReqShop";
import type { configFile, seasonalProgression } from "./Enums";
import type { Logger } from "./Logger";
import type { References } from "./References";
import type { Utils } from "./Utils";

import * as fs from "node:fs";
import * as path from "node:path";
import JSON5 from "json5";

const EventWeightingsConfig = require("../../config/EventWeightings.json");

export class StaticRouters {
    private routerPrefix = "[Raid Overhaul] ";

    constructor(
        public ref: References,
        public utils: Utils,
        public logger: Logger,
    ) {}

    public registerHooks(): void {
        const weatherConfigPath = path.resolve(__dirname, "../../config/SeasonsProgressionFile.json");
        const modConfig = JSON5.parse(
            this.ref.vfs.readFile(path.resolve(__dirname, "../../config/config.json5")),
        ) as configFile;
        const weatherConfig = this.ref.jsonUtil.deserialize(
            fs.readFileSync(weatherConfigPath, "utf-8"),
            "config.json",
        ) as seasonalProgression;
        const modFeatures = new Base(this.utils, this.ref, this.logger);

        //Backup profile
        this.ref.staticRouter.registerStaticRouter(
            `${this.routerPrefix}-/client/game/start`,
            [
                {
                    url: "/client/game/start",
                    action: async (url, info, sessionID, output) => {
                        const profileInfo = this.ref.profileHelper.getFullProfile(sessionID);

                        if (modConfig.BackupProfile) {
                            this.utils.profileBackup(sessionID, profileInfo);
                        }
                        return output;
                    },
                },
            ],
            "spt",
        );

        //Get and send configs to the client
        this.ref.staticRouter.registerStaticRouter(
            "GetEventConfig",
            [
                {
                    url: "/RaidOverhaul/GetEventConfig",
                    action: async (url, info, sessionId, output) => {
                        const EventWeightings = EventWeightingsConfig;

                        return JSON.stringify(EventWeightings);
                    },
                },
            ],
            "spt",
        );

        this.ref.staticRouter.registerStaticRouter(
            "GetServerConfig",
            [
                {
                    url: "/RaidOverhaul/GetServerConfig",
                    action: async (url, info, sessionId, output) => {
                        const ServerConfig = modConfig;

                        return JSON.stringify(ServerConfig);
                    },
                },
            ],
            "spt",
        );

        this.ref.staticRouter.registerStaticRouter(
            "GetWeatherConfig",
            [
                {
                    url: "/RaidOverhaul/GetWeatherConfig",
                    action: async (url, info, sessionId, output) => {
                        const WeatherConfig = weatherConfig;

                        return JSON.stringify(WeatherConfig);
                    },
                },
            ],
            "spt",
        );

        // Randomize weather pre-raid
        if (modConfig.Events.EnableWeatherOptions) {
            if (
                modConfig.Events.NoWinter &&
                !modConfig.Events.AllSeasons &&
                !modConfig.Events.SeasonalProgression &&
                !modConfig.Events.WinterWonderland
            ) {
                this.ref.staticRouter.registerStaticRouter(
                    `[${this.routerPrefix}]-/client/items`,
                    [
                        {
                            url: "/client/items",
                            action: async (url, info, sessionId, output) => {
                                modFeatures.weatherChangesNoWinter(modConfig);
                                return output;
                            },
                        },
                    ],
                    "spt",
                );
            }

            if (
                modConfig.Events.AllSeasons &&
                !modConfig.Events.NoWinter &&
                !modConfig.Events.SeasonalProgression &&
                !modConfig.Events.WinterWonderland
            ) {
                this.ref.staticRouter.registerStaticRouter(
                    `[${this.routerPrefix}]-/client/items`,
                    [
                        {
                            url: "/client/items",
                            action: async (url, info, sessionId, output) => {
                                modFeatures.weatherChangesAllSeasons(modConfig);
                                return output;
                            },
                        },
                    ],
                    "spt",
                );
            }

            if (
                modConfig.Events.SeasonalProgression &&
                !modConfig.Events.AllSeasons &&
                !modConfig.Events.NoWinter &&
                !modConfig.Events.WinterWonderland
            ) {
                this.ref.staticRouter.registerStaticRouter(
                    `[${this.routerPrefix}]-/client/items`,
                    [
                        {
                            url: "/client/items",
                            action: async (url, info, sessionId, output) => {
                                modFeatures.seasonProgression(modConfig);
                                return output;
                            },
                        },
                    ],
                    "spt",
                );
            }
        }
    }
}
