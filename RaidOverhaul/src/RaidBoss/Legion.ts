import type { IBossLocationSpawn } from "@spt/models/eft/common/ILocationBase";
import type { IPmcData } from "@spt/models/eft/common/IPmcData";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import type { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { TraderData } from "../Trader/ReqShop";
import type { configFile, legionProgression, debugFile } from "../Utils/Enums";
import type { Logger } from "../Utils/Logger";
import type { References } from "../Utils/References";

const botSettings = require("../Utils/ArrayFiles/botInfo.json");
const bosslegion = require("../../db/RaidBoss/bosslegion.json");
const bosslegion2 = require("../../db/RaidBoss/bosslegion2.json");

import * as fs from "node:fs";
import * as path from "node:path";
import JSON5 from "json5";

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
  public static setupRan = false;

  public preSptLoad(
    modConfig: configFile,
    ref: References,
    logger: Logger
  ): void {
    //Load or generate boss data on profile selection
    const debugOptions = JSON5.parse(
      ref.vfs.readFile(
        path.resolve(__dirname, "../Utils/ArrayFiles/debugOptions.json5")
      )
    ) as debugFile;

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
                logger.logWarning(
                  "No progress file exists for this profile, this is normal. Creating..."
                );
                this.createLegionProgressFile(logger, debugOptions);
                logger.log(
                  `Progression file for ${LegionData.profileId} created.`,
                  LogTextColor.MAGENTA
                );
              }

              if (!LegionData.setupRan) {
                const profileLevel = ref.profileHelper.getProfileByPmcId(
                  LegionData.profileId
                ).Info.Level;

                if (profileLevel != null && profileLevel < 10) {
                  logger.log(
                    `Profile is under minimum spawn level for Legion, setting spawn chance to 0. \nHe'll be on the hunt after level 10`,
                    LogTextColor.MAGENTA
                  );
                  LegionData.legionFileChance = 0;

                  const spawnChance = JSON.parse(
                    fs.readFileSync(legionSpawnPath, "utf8")
                  ) as legionProgression;
                  spawnChance.legionChance = LegionData.legionFileChance;
                  fs.writeFileSync(
                    legionSpawnPath,
                    JSON.stringify(spawnChance, null, 2),
                    "utf-8"
                  );

                  this.LoadBossData(modConfig, logger, ref);
                } else {
                  this.LoadBossData(modConfig, logger, ref);
                }
                LegionData.setupRan = true;
              }
            }
            return Promise.resolve(output);
          },
        },
      ],
      "spt"
    );

    //Modify trader rep and legion chance post raid
    ref.staticRouter.registerStaticRouter(
      `${this.routerPrefix}-RaidSaved`,
      [
        {
          url: "/client/match/local/end",
          action: async (url, info, sessionId, output) => {
            if (modConfig.Debug.ExtraLogging) {
              this.createEndpointDataFile(logger, info);
            }
            const pmcProfile: IPmcData = ref.profileHelper.getProfileByPmcId(
              LegionData.profileId
            );

            if (!pmcProfile) {
              if (modConfig.Debug.ExtraLogging) {
                logger.logWarning(
                  "No profile detected. Not pushing Legion to maps"
                );
              }
              this.removeBossSpawns(ref);

              return Promise.resolve(output);
            }

            const profileLevel = pmcProfile.Info.Level;
            if (profileLevel != null && profileLevel < 10) {
              if (modConfig.EnableCustomBoss) {
                logger.log(
                  `Profile is under minimum spawn level for Legion, setting spawn chance to 0. \nHe'll be on the hunt after level 10`,
                  LogTextColor.MAGENTA
                );
              }
              LegionData.legionFileChance = 0;
            } else {
              TraderData.traderRepLogic(
                info,
                sessionId,
                ref.traderHelper,
                logger
              );
              if (modConfig.EnableCustomBoss) {
                TraderData.legionRepLogic(
                  info,
                  sessionId,
                  ref.traderHelper,
                  logger
                );
                this.modifySpawnChance(info, output, logger);
                this.removeBossSpawns(ref);
                this.LoadBossData(modConfig, logger, ref);
              }
              if (!modConfig.EnableCustomBoss) {
                TraderData.noBossRepLogic(
                  info,
                  sessionId,
                  ref.traderHelper,
                  logger
                );
              }
            }
            return Promise.resolve(output);
          },
        },
      ],
      "spt"
    );
  }

  private LoadBossData(
    modConfig: configFile,
    logger: Logger,
    ref: References
  ): void {
    let bossLegionChance = 15;

    const botConfig = ref.configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const preset: any = botConfig.presetBatch;
    const escortAmount = ref.randomUtil.randInt(1, 4).toString();
    //const diffType = randomUtil.drawRandomFromList(botSettings.difficulties, 1).toString();
    const bossDifficulty = "normal";
    const escortDifficulty = "normal";
    const escortType = ref.randomUtil
      .drawRandomFromList(botSettings.followers, 1)
      .toString();
    const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;
    const debugOptions = JSON5.parse(
      ref.vfs.readFile(
        path.resolve(__dirname, "../Utils/ArrayFiles/debugOptions.json5")
      )
    ) as debugFile;

    if (fs.existsSync(legionSpawnPath)) {
      try {
        const spawnChance = JSON.parse(
          fs.readFileSync(legionSpawnPath, "utf8")
        ) as legionProgression;
        bossLegionChance = spawnChance?.legionChance ?? 15;
      } catch (error) {
        console.log(
          "Can't find Legion spawn chance file. Make sure you have it in your config folder."
        );
      }

      if (modConfig.Debug.ExtraLogging) {
        logger.log(
          `Current spawn chance for Legion is [${bossLegionChance}]`,
          LogTextColor.BLUE
        );
        logger.log(
          `Current Boss Difficulty is [${bossDifficulty}]`,
          LogTextColor.BLUE
        );
        logger.log(
          `Current Escort Difficulty is [${escortDifficulty}]`,
          LogTextColor.BLUE
        );
        logger.log(`Current Escort type is [${escortType}]`, LogTextColor.BLUE);
        logger.log(
          `Current number of Escorts is [${escortAmount}]`,
          LogTextColor.BLUE
        );
      }

      let bossLegionSpawn: IBossLocationSpawn = {
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
          ref.tables.bots.types["bosslegion"] = ref.jsonUtil.deserialize(
            ref.jsonUtil.serialize(bosslegion)
          );
        } catch (error) {
          logger.logError(`Error loading default Legion files: ${error}`);
        }
      }

      if (!modConfig.EnableCustomItems) {
        try {
          // biome-ignore lint/complexity/useLiteralKeys: <explanation>
          ref.tables.bots.types["bosslegion"] = ref.jsonUtil.deserialize(
            ref.jsonUtil.serialize(bosslegion2)
          );
        } catch (error) {
          logger.logError(`Error loading default Legion files: ${error}`);
        }
      }

      for (const location of Object.values(ref.tables.locations)) {
        if (location.base) {
          const zonesString =
            location.base.Id === "factory4_night"
              ? ref.tables.locations.factory4_day.base.OpenZones
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
      if (ref.preSptModLoader.getImportedModsNames().includes("SWAG")) {
        this.swagPatch(logger, ref);
        logger.log(
          "SWAG detected, modifying Legion patterns.",
          LogTextColor.MAGENTA
        );
      }
    } else {
      logger.logWarning(
        "No progress file exists for this profile, this is normal. Creating..."
      );
      this.createLegionProgressFile(logger, debugOptions);
      logger.log(
        `Progression file for ${LegionData.profileId} created.`,
        LogTextColor.MAGENTA
      );
    }
  }

  private removeBossSpawns(ref: References): void {
    const removedLocations = [];

    for (const location of Object.values(ref.tables.locations)) {
      if (location.base) {
        const removedSpawns = location.base.BossLocationSpawn.filter(
          (spawn) => spawn.BossName === "bosslegion"
        );
        location.base.BossLocationSpawn =
          location.base.BossLocationSpawn.filter(
            (spawn) => spawn.BossName !== "bosslegion"
          );

        if (removedSpawns.length > 0) {
          removedLocations.push({
            map: location.base.Id,
            zones: removedSpawns.map((spawn) => spawn.BossZone),
          });
        }
      }
    }
  }

  private swagPatch(logger: Logger, ref: References): void {
    let bossLegionChance = 15;

    const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;
    const spawnChance = JSON.parse(
      fs.readFileSync(legionSpawnPath, "utf8")
    ) as legionProgression;
    bossLegionChance = spawnChance?.legionChance ?? 15;

    try {
      const swagBossConfigPath = path.join(
        __dirname,
        "../../../SWAG/config/bossConfig.json"
      );
      const swagBossConfig = JSON.parse(
        fs.readFileSync(swagBossConfigPath, "utf-8")
      );

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

        this.modifySwagLegionSettings(logger, ref);
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

        this.modifySwagLegionSettings(logger, ref);
      }

      fs.writeFileSync(
        swagBossConfigPath,
        JSON.stringify(swagBossConfig, null, 2),
        "utf-8"
      );
    } catch (error) {
      logger.logError(`Error adding Legion to SWAG: ${error}`);
    }
  }

  private modifySwagLegionSettings(logger: Logger, ref: References) {
    let bossLegionChance = 15;

    const type = ref.randomUtil
      .drawRandomFromList(botSettings.followers, 1)
      .toString();
    //const bossDifficulty = randomUtil.drawRandomFromList(botSettings.difficulties, 1).toString();
    const bossDifficulty = "normal";
    const escortDifficulty = "normal";
    const escortCount = ref.randomUtil.randInt(1, 4).toString();
    const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;
    const spawnChance = JSON.parse(
      fs.readFileSync(legionSpawnPath, "utf8")
    ) as legionProgression;
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
      ref.vfs.writeFile(
        "./user/mods/SWAG/config/custom/legion.json",
        customSettingsFile
      );
    } catch (error) {
      logger.logError(`Error modifying Legion patterns in SWAG: ${error}`);
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private modifySpawnChance(info: any, output: any, logger: Logger) {
    let bossLegionChance = 15;

    const legionSpawnPath = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}/LegionChance.json`;
    const spawnChance = JSON.parse(
      fs.readFileSync(legionSpawnPath, "utf8")
    ) as legionProgression;
    const pmcData: IPmcData = info.results.profile;
    const victimRoles = pmcData.Stats.Eft.Victims?.map((victim) =>
      victim.Role.toLowerCase()
    );
    bossLegionChance = spawnChance?.legionChance ?? 15;

    if (victimRoles?.includes("bosslegion")) {
      bossLegionChance = 10;

      logger.log("Legion eliminated", LogTextColor.MAGENTA);
    }

    if (info.results === "Survived") {
      bossLegionChance += 1.5;
    }

    if (info.results === "Runner") {
      bossLegionChance += 3;
    }

    if (info.results === "Left") {
      bossLegionChance += 0.5;
    }

    if (info.results === "Killed") {
      bossLegionChance += 1;
    }

    if (bossLegionChance > 100) {
      bossLegionChance = 100;
    }

    if (bossLegionChance < 1) {
      bossLegionChance = 1;
    }

    spawnChance.legionChance = bossLegionChance;

    try {
      fs.writeFileSync(
        legionSpawnPath,
        JSON.stringify(spawnChance, null, 4),
        "utf-8"
      );
    } catch (error) {
      logger.logError(`Error writing progress file: ${error}`);
    }

    return output;
  }

  static RemoveLegionPatch(logger: Logger) {
    const swagFolder = path.join(__dirname, "../../../SWAG");

    if (fs.existsSync(swagFolder)) {
      const swagBossConfigPath = path.join(
        __dirname,
        "../../../SWAG/config/bossConfig.json"
      );
      const swagBossConfig = JSON.parse(
        fs.readFileSync(swagBossConfigPath, "utf-8")
      );
      swagBossConfig.CustomBosses.legion.enabled = false;

      fs.writeFileSync(
        swagBossConfigPath,
        JSON.stringify(swagBossConfig, null, 2),
        "utf-8"
      );
    } else {
      logger.logDebug("SWAG not detected. Skipping RemoveLegionPatch.");
    }
  }

  private createLegionProgressFile(
    logger: Logger,
    debugOptions: debugFile
  ): void {
    let legionProgressActual = debugOptions.baseLegionChance;
    const progressFileLegion = (LegionData.progressFile = {
      legionChance: legionProgressActual,
    });

    const progressLocFolder = `${LegionData.modLoc}/config/profiles/${LegionData.profileId}`;
    const progressLoc = `${progressLocFolder}/LegionChance.json`;
    if (!fs.existsSync(progressLocFolder)) {
      fs.mkdirSync(progressLocFolder, { recursive: true });
    }

    try {
      fs.writeFileSync(
        progressLoc,
        JSON.stringify(progressFileLegion, null, 4)
      );
    } catch (error) {
      logger.logError(`Error writing progress file: ${error}`);
    }
  }

  private createEndpointDataFile(logger: Logger, data: any): void {
    const dataLocFolder = `${LegionData.modLoc}/ROData/profiles/${LegionData.profileId}`;
    const dataLoc = `${dataLocFolder}/endpointData.json`;
    if (!fs.existsSync(dataLocFolder)) {
      fs.mkdirSync(dataLocFolder, { recursive: true });
    }

    try {
      fs.writeFileSync(dataLoc, JSON.stringify(data, null, 4));
    } catch (error) {
      logger.logError(`Error writing endpoint data file: ${error}`);
    }
  }
}
