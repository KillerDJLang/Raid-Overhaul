import { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { Traders } from "@spt/models/enums/Traders";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { ImageRouter } from "@spt/routers/ImageRouter";
import { DynamicRouterModService } from "@spt/services/mod/dynamicRouter/DynamicRouterModService";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";

import { Base } from "./BaseFeatures/baseFeatures";
import { ItemGenerator } from "./CustomItems/ItemGenerator";
import { LegionData } from "./RaidBoss/Legion";
import { configFile, seasonalProgression } from "./Refs/Enums";
import { References } from "./Refs/References";
import { Utils } from "./Refs/Utils";
import { TraderData } from "./Trader/ReqShop";
import { pushTraderFeatures } from "./Trader/TraderPushes";

const legionClothes = require("../db/ItemGen/Clothes/LegionClothing.json");
const EventWeightingsConfig = require("../config/EventWeightings.json");

import * as fs from "node:fs";
import * as path from "node:path";
import JSON5 from "json5";
import * as baseJson from "../db/base.json";

class RaidOverhaul implements IPreSptLoadMod, IPostDBLoadMod {
    static modName: string;
    protected profilePath: string;

    static container: DependencyContainer;
    public imageRouter: ImageRouter;

    private ref: References = new References();
    private utils: Utils = new Utils(this.ref);

    private static pluginDepCheck(): boolean {
        const pluginRO = "raidoverhaul.dll";

        try {
            const pluginPath = fs.readdirSync("./BepInEx/plugins/RaidOverhaul").map((plugin) => plugin.toLowerCase());
            return pluginPath.includes(pluginRO);
        } catch {
            return false;
        }
    }

    private static preloaderDepCheck(): boolean {
        const prePatchLegion = "legionpreloader.dll";

        try {
            const pluginPath = fs.readdirSync("./BepInEx/patchers").map((plugin) => plugin.toLowerCase());
            return pluginPath.includes(prePatchLegion);
        } catch {
            return false;
        }
    }

    constructor() {
        RaidOverhaul.modName = "Raid Overhaul";
    }

    public preSptLoad(container: DependencyContainer): void {
        this.ref.preSptLoad(container);
        const ragfair = this.ref.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);
        const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const traderData = new TraderData(traderConfig, this.ref, this.utils);
        const modFeatures = new Base(this.utils, this.ref);

        const staticRouterModService: StaticRouterModService =
            container.resolve<StaticRouterModService>("StaticRouterModService");
        const dynamicRouterModService: DynamicRouterModService =
            container.resolve<DynamicRouterModService>("DynamicRouterModService");
        const weatherConfigPath = path.resolve(__dirname, "../config/SeasonsProgressionFile.json");
        const modConfig = JSON5.parse(
            this.ref.vfs.readFile(path.resolve(__dirname, "../config/config.json5")),
        ) as configFile;
        const weatherConfig = this.ref.jsonUtil.deserialize(
            fs.readFileSync(weatherConfigPath, "utf-8"),
            "config.json",
        ) as seasonalProgression;

        if (modConfig.RemoveFromSwag) {
            return;
        }

        traderData.registerProfileImage();
        traderData.setupTraderUpdateTime();

        Traders["Requisitions"] = "Requisitions";
        ragfair.traders[baseJson._id] = true;

        //Backup profile
        staticRouterModService.registerStaticRouter(
            `${RaidOverhaul.modName}-/client/game/start`,
            [
                {
                    url: "/client/game/start",
                    action: async (url: string, info: string, sessionID: string, output: string) => {
                        const profileInfo = this.ref.profileHelper.getFullProfile(sessionID);

                        if (modConfig.BackupProfile) {
                            this.utils.profileBackup(
                                RaidOverhaul.modName,
                                sessionID,
                                path,
                                profileInfo,
                                this.ref.randomUtil,
                            );
                        }
                        return output;
                    },
                },
            ],
            "spt",
        );

        //Get and send configs to the client
        staticRouterModService.registerStaticRouter(
            "GetEventConfig",
            [
                {
                    url: "/RaidOverhaul/GetEventConfig",
                    action: async (url: string, info: string, sessionId: string, output: string) => {
                        const EventWeightings = EventWeightingsConfig;

                        return JSON.stringify(EventWeightings);
                    },
                },
            ],
            "spt",
        );

        staticRouterModService.registerStaticRouter(
            "GetServerConfig",
            [
                {
                    url: "/RaidOverhaul/GetServerConfig",
                    action: async (url: string, info: string, sessionId: string, output: string) => {
                        const ServerConfig = modConfig;

                        return JSON.stringify(ServerConfig);
                    },
                },
            ],
            "spt",
        );

        staticRouterModService.registerStaticRouter(
            "GetWeatherConfig",
            [
                {
                    url: "/RaidOverhaul/GetWeatherConfig",
                    action: async (url: string, info: string, sessionId: string, output: string) => {
                        const WeatherConfig = weatherConfig;

                        return JSON.stringify(WeatherConfig);
                    },
                },
            ],
            "spt",
        );

        //#region Randomize weather pre-raid
        if (modConfig.Events.EnableWeatherOptions) {
            if (
                modConfig.Events.NoWinter &&
                !modConfig.Events.AllSeasons &&
                !modConfig.Events.SeasonalProgression &&
                !modConfig.Events.WinterWonderland
            ) {
                staticRouterModService.registerStaticRouter(
                    `[${RaidOverhaul.modName}]-/client/items`,
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
                staticRouterModService.registerStaticRouter(
                    `[${RaidOverhaul.modName}]-/client/items`,
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
                staticRouterModService.registerStaticRouter(
                    `[${RaidOverhaul.modName}]-/client/items`,
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
        //#endregion

        //Log from the client to the server if in debug build in the client and extra debug logging is enabled in the server
        if (modConfig.Debug.ExtraLogging) {
            dynamicRouterModService.registerDynamicRouter(
                `DynamicReportError${RaidOverhaul.modName}`,
                [
                    {
                        url: "/RaidOverhaul/LogToServer/",
                        action: async (url: string) => {
                            const urlParts = url.split("/");
                            const clientMessage = urlParts[urlParts.length - 1];

                            const regex = /%20/g;
                            this.utils.logToServer(clientMessage.replace(regex, " "), this.ref.logger);

                            return JSON.stringify({ resp: "OK" });
                        },
                    },
                ],
                "LogToServer",
            );
        }

        //Modify trader rep and legion chance post raid
        staticRouterModService.registerStaticRouter(
            `${RaidOverhaul.modName}:RaidSaved`,
            [
                {
                    url: "/raid/profile/save",
                    action: async (url: string, info: string, sessionId: string, output: string) => {
                        TraderData.traderRepLogic(info, sessionId, this.ref.traderHelper);
                        if (modConfig.EnableCustomBoss) {
                            TraderData.legionRepLogic(info, sessionId, this.ref.traderHelper);
                            LegionData.modifySpawnChance(info, output);
                            LegionData.LoadBossData(modConfig);
                            if (this.ref.preSptModLoader.getImportedModsNames().includes("SWAG")) {
                                LegionData.swagPatch();
                            }
                        }
                        if (!modConfig.EnableCustomBoss) {
                            TraderData.noBossRepLogic(info, sessionId, this.ref.traderHelper);
                        }
                        return output;
                    },
                },
            ],
            "spt",
        );

        //Patch Legion into SWAG patterns
        if (modConfig.EnableCustomBoss) {
            if (this.ref.preSptModLoader.getImportedModsNames().includes("SWAG")) {
                LegionData.swagPatch();
                this.ref.logger.logWithColor(
                    "[Raid Overhaul] SWAG detected, modifying Legion patterns.",
                    LogTextColor.MAGENTA,
                );
            }
        }
    }

    public postDBLoad(container: DependencyContainer): void {
        this.ref.postDBLoad(container);

        const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);

        //Imports
        const traderData = new TraderData(traderConfig, this.ref, this.utils);
        const modFeatures = new Base(this.utils, this.ref);
        const itemGenerator = new ItemGenerator(this.ref);
        const traderFeatures = new pushTraderFeatures(this.utils, this.ref, traderData);

        //For new items
        const modPath = path.resolve(__dirname.toString()).split(path.sep).join("/") + "/";
        const modConfig = JSON5.parse(
            this.ref.vfs.readFile(path.resolve(__dirname, "../config/config.json5")),
        ) as configFile;

        //Random message on server on startup
        const messageArray = [
            "The hamsters can take a break now",
            "Time to get wrecked by Birdeye LOL",
            "Back to looking for cat pics",
            "I made sure to crank up your heart attack event chances",
            "If there's a bunch of red text it's 100% not my fault",
            "We are legion, for we are many",
            "All Hail the Cult of Cj",
            "Good luck out there",
        ];
        const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];

        //Remove boss from SWAG
        if (modConfig.RemoveFromSwag) {
            LegionData.RemoveLegionPatch();
            this.ref.logger.error(`[${RaidOverhaul.modName}] Removing Legion from Swag config. Ready to uninstall.`);
            return;
        }

        //Check for proper install
        if (!RaidOverhaul.pluginDepCheck()) {
            this.ref.logger.error(
                `[${RaidOverhaul.modName}] Error, client portion of Raid Overhaul is missing from BepInEx/plugins folder.\nPlease install correctly.`,
            );
            return;
        }

        if (!RaidOverhaul.preloaderDepCheck()) {
            this.ref.logger.error(
                `[${RaidOverhaul.modName}] Error, Legion Boss Preloader is missing from BepInEx/patchers folder.\nPlease install correctly.`,
            );
            return;
        }

        //Load all custom items
        itemGenerator.createCustomItems("../../db/ItemGen/Currency");
        itemGenerator.createCustomItems("../../db/ItemGen/ConstItems");
        itemGenerator.createCustomItems("../../db/ItemGen/CustomKeys");
        if (modConfig.EnableCustomItems) {
            if (this.ref.preSptModLoader.getImportedModsNames().includes("SPT-Realism")) {
                itemGenerator.createCustomItems("../../db/ItemGen/Ammo Realism");
                this.ref.logger.logWithColor(
                    "[RaidOverhaul] Realism detected, modifying custom ammunition.",
                    LogTextColor.MAGENTA,
                );
            }

            if (!this.ref.preSptModLoader.getImportedModsNames().includes("SPT-Realism")) {
                itemGenerator.createCustomItems("../../db/ItemGen/Ammo");
            }
            itemGenerator.createCustomItems("../../db/ItemGen/Weapons");
            itemGenerator.createCustomItems("../../db/ItemGen/Gear");
        }
        this.ref.tables.locations.laboratory.base.AccessKeys.push(...["66a2fc9886fbd5d38c5ca2a6"]);

        // Load custom boss data
        if (modConfig.EnableCustomBoss) {
            itemGenerator.createClothingTop(legionClothes.Shirt);
            itemGenerator.createClothingBottom(legionClothes.Pants);
            LegionData.LoadBossData(modConfig);
            traderFeatures.pushExports(modPath, modConfig);
        }

        if (!modConfig.EnableCustomBoss) {
            traderFeatures.pushExports2(modPath, modConfig);
            LegionData.RemoveLegionPatch();
        }

        // Load Trader Data
        traderFeatures.buildReqAssort(modConfig);

        //Push all of the mods base features
        modFeatures.raidChanges(modConfig);
        modFeatures.itemChanges(modConfig);
        modFeatures.lootChanges(modConfig);
        modFeatures.stackChanges(modConfig);
        modFeatures.traderTweaks(modConfig);
        modFeatures.eventChanges(modConfig);
        modFeatures.weightChanges(modConfig);
        if (modConfig.Events.EnableWeatherOptions && modConfig.Events.WinterWonderland) {
            modFeatures.weatherChangesWinterWonderland(modConfig);
        }

        this.ref.logger.logWithColor(
            `[${RaidOverhaul.modName}] has finished modifying your raids. ${randomMessage}.`,
            LogTextColor.CYAN,
        );
    }
}
//      \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/

module.exports = { mod: new RaidOverhaul() };
