import { container } from "tsyringe";

import type { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import type { BossLocationSpawn } from "@spt/models/eft/common/ILocationBase";
import type { IPmcData } from "@spt/models/eft/common/IPmcData";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import type { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { ConfigServer } from "@spt/servers/ConfigServer";
import type { DatabaseService } from "@spt/services/DatabaseService";
import type { JsonUtil } from "@spt/utils/JsonUtil";
import type { RandomUtil } from "@spt/utils/RandomUtil";
import type { VFS } from "@spt/utils/VFS";
import type { configFile, legionProgression } from "../Utils/Enums";
import type { References } from "../Utils/References";
import { TraderData } from "../Trader/ReqShop";

const botSettings = require("../Utils/ArrayFiles/botInfo.json");
const bosslegion = require("../../db/RaidBoss/bosslegion.json");
const bosslegion2 = require("../../db/RaidBoss/bosslegion2.json");

import * as fs from "node:fs";
import * as path from "node:path";

export class LegionData {
    // biome-ignore lint/complexity/noUselessConstructor: <explanation>
    constructor() {}

    private routerPrefix = "[Raid Overhaul] ";
    public static modLoc = path.join(__dirname, "..", "..");
    public static legionFileChance: number;
    public static profileId: string;
    public static progressFile: {
        legionChance: number;
    };

    public preSptLoad(modConfig: configFile, ref: References): void {
        //Load or generate boss data on profile selection
        ref.staticRouter.registerStaticRouter(
            `${this.routerPrefix}-ProfileSelected`,
            [
                {
                    url: "/client/game/profile/select",
                    action: async (url, info, sessionId, output) => {
                        LegionData.profileId = info.uid;

                        if (modConfig.EnableCustomBoss) {
                            const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;

                            if (!fs.existsSync(legionSpawnPath)) {
                                const logString = "Boss Legion";
                                
                                ref.logger.warning(`[${logString}] No progress file exists for this profile, this is normal. Creating...`);
                                LegionData.createLegionProgressFile(15);
                                ref.logger.log(`[${logString}] Progression file for ${LegionData.profileId} created.`, LogTextColor.MAGENTA);
                            }
                        }
                        return output;
                    },
                },
            ],
            "spt",
        );

        //Modify trader rep and legion chance post raid
        ref.staticRouter.registerStaticRouter(
            `${this.routerPrefix}-RaidSaved`,
            [
                {
                    url: "/raid/profile/save",
                    action: async (url, info, sessionId, output) => {
                        const pmcData: IPmcData = info.profile;
                        LegionData.profileId = pmcData._id;
                        
                        TraderData.traderRepLogic(info, sessionId, ref.traderHelper);
                        if (modConfig.EnableCustomBoss) {
                            TraderData.legionRepLogic(info, sessionId, ref.traderHelper);
                            LegionData.modifySpawnChance(info, output);
                            LegionData.LoadBossData(modConfig);
                        }
                        if (!modConfig.EnableCustomBoss) {
                            TraderData.noBossRepLogic(info, sessionId, ref.traderHelper);
                        }
                        return output;
                    },
                },
            ],
            "spt",
        );
    }

    static LoadBossData(modConfig: configFile): void {
        let bossLegionChance = 15;

        const logger = container.resolve<ILogger>("WinstonLogger");
        const logString = "Boss Legion";
        const tables = container.resolve<DatabaseService>("DatabaseService").getTables();
        const randomUtil = container.resolve<RandomUtil>("RandomUtil");
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const preSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const preset: any = botConfig.presetBatch;
        const escortAmount = randomUtil.randInt(1, 4).toString();
        //const diffType = randomUtil.drawRandomFromList(botSettings.difficulties, 1).toString();
        const bossDifficulty = "impossible";
        const escortDifficulty = randomUtil.drawRandomFromList(botSettings.difficulties, 1).toString();
        const escortType = randomUtil.drawRandomFromList(botSettings.followers, 1).toString();
        const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;

        if (fs.existsSync(legionSpawnPath)) {
            try {
                const spawnChance = JSON.parse(fs.readFileSync(legionSpawnPath, "utf8")) as legionProgression;
                bossLegionChance = spawnChance?.legionChance ?? 15;
            } catch (error) {
                console.log("Can't find Legion spawn chance file. Make sure you have it in your config folder.");
            }

            if (modConfig.Debug.ExtraLogging) {
                logger.log(
                    `[${logString}] Current spawn chance for Legion is [${bossLegionChance}]`,
                    LogTextColor.BLUE,
                );
                logger.log(`[${logString}] Current Boss Difficulty is [${bossDifficulty}]`, LogTextColor.BLUE);
                logger.log(`[${logString}] Current Escort Difficulty is [${escortDifficulty}]`, LogTextColor.BLUE);
                logger.log(`[${logString}] Current Escort type is [${escortType}]`, LogTextColor.BLUE);
                logger.log(`[${logString}] Current number of Escorts is [${escortAmount}]`, LogTextColor.BLUE);
            }

            let bossLegionSpawn: BossLocationSpawn = {
                BossChance: bossLegionChance,
                BossDifficult: bossDifficulty,
                BossEscortAmount: escortAmount,
                BossEscortDifficult: escortDifficulty,
                BossEscortType: escortType,
                BossName: "bosslegion",
                BossPlayer: false,
                BossZone: "?",
                RandomTimeSpawn: false,
                Time: -1,
                TriggerId: "",
                TriggerName: "",
                spawnMode: ["regular", "pve"],
            };

            preset.bosslegion = 1;
            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            botConfig.equipment["bosslegion"] = botSettings.equipmentSettings;
            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            botConfig.itemSpawnLimits["bosslegion"] = {};
            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            botConfig.walletLoot["bosslegion"] = botConfig.walletLoot["bossgluhar"];
            botConfig.bosses.push("bosslegion");

            if (modConfig.EnableCustomItems) {
                try {
                    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                    tables.bots.types["bosslegion"] = jsonUtil.deserialize(jsonUtil.serialize(bosslegion));
                } catch (error) {
                    logger.error(`[${logString}] Error loading default Legion files: ${error}`);
                }
            }

            if (!modConfig.EnableCustomItems) {
                try {
                    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                    tables.bots.types["bosslegion"] = jsonUtil.deserialize(jsonUtil.serialize(bosslegion2));
                } catch (error) {
                    logger.error(`[${logString}] Error loading default Legion files: ${error}`);
                }
            }

            for (const location of Object.values(tables.locations)) {
                if (location.base) {
                    const zonesString =
                        location.base.Id === "factory4_night"
                            ? tables.locations.factory4_day.base.OpenZones
                            : location.base.OpenZones;
                    if (!zonesString) {
                        continue;
                    }

                    const foundOpenZones = zonesString
                        .split(",")
                        .map((zone) => zone.trim())
                        .filter((zone) => zone && !zone.includes("Snipe"));

                    if (foundOpenZones.length === 0) {
                        continue;
                    }

                    const randomIndex = Math.floor(Math.random() * foundOpenZones.length);
                    const randomZone = foundOpenZones[randomIndex];

                    bossLegionSpawn = {
                        ...bossLegionSpawn,
                        BossZone: randomZone,
                    };
                    location.base.BossLocationSpawn.push(bossLegionSpawn);
                }
            }

            //Patch Legion into SWAG patterns
            if (preSptModLoader.getImportedModsNames().includes("SWAG")) {
                LegionData.swagPatch();
                logger.log("SWAG detected, modifying Legion patterns.", LogTextColor.MAGENTA);
            }
        } else {
            logger.warning(`[${logString}] No progress file exists for this profile, this is normal. Creating...`);
            LegionData.createLegionProgressFile(bossLegionChance);
            logger.log(`[${logString}] Progression file for ${LegionData.profileId} created.`, LogTextColor.MAGENTA);
        }
    }

    static swagPatch(): void {
        let bossLegionChance = 15;

        const logger = container.resolve<ILogger>("WinstonLogger");
        const logString = "Boss Legion";
        const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;

        const spawnChance = JSON.parse(fs.readFileSync(legionSpawnPath, "utf8")) as legionProgression;
        bossLegionChance = spawnChance?.legionChance ?? 15;

        try {
            const swagBossConfigPath = path.join(__dirname, "../../../SWAG/config/bossConfig.json");
            const swagBossConfig = JSON.parse(fs.readFileSync(swagBossConfigPath, "utf-8"));

            if (!swagBossConfig.CustomBosses.legion.enabled) {
                swagBossConfig.CustomBosses.legion.enabled = true;
            }

            if (swagBossConfig.CustomBosses.legion.useProgressSpawnChance) {
                swagBossConfig.CustomBosses.legion.useProgressSpawnChance = false; //temp until nooky can change the swag path for the progress file
                swagBossConfig.CustomBosses.legion.customs = bossLegionChance;
                swagBossConfig.CustomBosses.legion.factory = bossLegionChance;
                swagBossConfig.CustomBosses.legion.factory_night = bossLegionChance;
                swagBossConfig.CustomBosses.legion.groundzero = bossLegionChance;
                swagBossConfig.CustomBosses.legion.groundzero_high = bossLegionChance;
                swagBossConfig.CustomBosses.legion.interchange = bossLegionChance;
                swagBossConfig.CustomBosses.legion.laboratory = bossLegionChance;
                swagBossConfig.CustomBosses.legion.lighthouse = bossLegionChance;
                swagBossConfig.CustomBosses.legion.reserve = bossLegionChance;
                swagBossConfig.CustomBosses.legion.shoreline = bossLegionChance;
                swagBossConfig.CustomBosses.legion.streets = bossLegionChance;
                swagBossConfig.CustomBosses.legion.woods = bossLegionChance;

                LegionData.modifySwagLegionSettings();
            } else {
                swagBossConfig.CustomBosses.legion.customs = bossLegionChance;
                swagBossConfig.CustomBosses.legion.factory = bossLegionChance;
                swagBossConfig.CustomBosses.legion.factory_night = bossLegionChance;
                swagBossConfig.CustomBosses.legion.groundzero = bossLegionChance;
                swagBossConfig.CustomBosses.legion.groundzero_high = bossLegionChance;
                swagBossConfig.CustomBosses.legion.interchange = bossLegionChance;
                swagBossConfig.CustomBosses.legion.laboratory = bossLegionChance;
                swagBossConfig.CustomBosses.legion.lighthouse = bossLegionChance;
                swagBossConfig.CustomBosses.legion.reserve = bossLegionChance;
                swagBossConfig.CustomBosses.legion.shoreline = bossLegionChance;
                swagBossConfig.CustomBosses.legion.streets = bossLegionChance;
                swagBossConfig.CustomBosses.legion.woods = bossLegionChance;

                LegionData.modifySwagLegionSettings();
            }

            fs.writeFileSync(swagBossConfigPath, JSON.stringify(swagBossConfig, null, 2), "utf-8");
        } catch (error) {
            logger.error(`[${logString}] Error adding Legion to SWAG: ${error}`);
        }
    }

    private static modifySwagLegionSettings() {
        const logString = "Boss Legion";

        let bossLegionChance = 15;

        const logger = container.resolve<ILogger>("WinstonLogger");
        const vfs = container.resolve<VFS>("VFS");
        const randomUtil = container.resolve<RandomUtil>("RandomUtil");
        const type = randomUtil.drawRandomFromList(botSettings.followers, 1).toString();
        //const bossDifficulty = randomUtil.drawRandomFromList(botSettings.difficulties, 1).toString();
        const bossDifficulty = "impossible";
        const escortDifficulty = randomUtil.drawRandomFromList(botSettings.difficulties, 1).toString();
        const escortCount = randomUtil.randInt(1, 4).toString();
        const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;
        const spawnChance = JSON.parse(fs.readFileSync(legionSpawnPath, "utf8")) as legionProgression;
        bossLegionChance = spawnChance?.legionChance ?? 15;

        try {
            const customSettings = {
                customs: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: escortCount,
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                factory: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: "2",
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                factory_night: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: "2",
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                groundzero: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: escortCount,
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                interchange: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: escortCount,
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                laboratory: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: "3",
                        BossEscortType: type,
                        BossDifficult: "impossible",
                        BossEscortDifficult: "impossible",
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                lighthouse: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: escortCount,
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                reserve: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: escortCount,
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                shoreline: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: escortCount,
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                streets: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: escortCount,
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
                woods: [
                    {
                        BossChance: bossLegionChance,
                        BossEscortAmount: escortCount,
                        BossEscortType: type,
                        BossDifficult: bossDifficulty,
                        BossEscortDifficult: escortDifficulty,
                        BossName: "bosslegion",
                        BossZone: null,
                        Time: -1,
                    },
                ],
            };
            const customSettingsFile = JSON.stringify(customSettings, null, 2);
            vfs.writeFile("./user/mods/SWAG/config/custom/legion.json", customSettingsFile);
        } catch (error) {
            logger.error(`[${logString}] Error modifying Legion patterns in SWAG: ${error}`);
        }
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static modifySpawnChance(info: any, output: any) {
        let bossLegionChance = 15;

        const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;
        const spawnChance = JSON.parse(fs.readFileSync(legionSpawnPath, "utf8")) as legionProgression;
        const pmcData: IPmcData = info.profile;
        const victimRoles = pmcData.Stats.Eft.Victims?.map((victim) => victim.Role.toLowerCase());
        const aggressorName = pmcData.Stats.Eft.Aggressor?.Name?.toLowerCase();
        bossLegionChance = spawnChance?.legionChance ?? 15;

        if (victimRoles?.includes("bosslegion")) {
            bossLegionChance = 10;
        }

        if (aggressorName === "legion") {
            bossLegionChance /= 2;
        }

        if (info.exit === "survived") {
            bossLegionChance += 1.5;
        }

        if (info.exit === "runner") {
            bossLegionChance += 3;
        }

        if (info.exit === "Left") {
            bossLegionChance += 0.5;
        }

        if (info.exit === "killed") {
            bossLegionChance += 1;
        }

        if (bossLegionChance > 100) {
            bossLegionChance = 100;
        }

        if (bossLegionChance < 1) {
            bossLegionChance = 1;
        }

        spawnChance.legionChance = bossLegionChance;

        fs.writeFileSync(legionSpawnPath, JSON.stringify(spawnChance, null, 2), "utf-8");

        return output;
    }

    static RemoveLegionPatch() {
        const swagBossConfigPath = path.join(__dirname, "../../../SWAG/config/bossConfig.json");
        const swagBossConfig = JSON.parse(fs.readFileSync(swagBossConfigPath, "utf-8"));

        swagBossConfig.CustomBosses.legion.enabled = false;

        fs.writeFileSync(swagBossConfigPath, JSON.stringify(swagBossConfig, null, 2), "utf-8");
    }

    static createLegionProgressFile(legionFileChance: number): void {
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        const progressFileLegion = (LegionData.progressFile = {
            legionChance: legionFileChance,
        });

        const progressLocFolder = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}`;
        const progressLoc = `${progressLocFolder}/LegionChance.json`;
        const logger = container.resolve<ILogger>("WinstonLogger");
        if (!fs.existsSync(progressLocFolder)) {
            fs.mkdirSync(progressLocFolder, { recursive: true });
        }

        try {
            fs.writeFileSync(progressLoc, JSON.stringify(progressFileLegion, null, 4));
        } catch (error) {
            logger.error(`Error writing progress file: ${error}`);
        }
    }
}
