import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

import type { configFile, debugFile } from "../Utils/Enums";
import type { References } from "../Utils/References";
import type { Utils } from "../Utils/Utils";
import type { TraderData } from "./ReqShop";

import * as baseJson from "../../db/base.json";
import * as baseJson2 from "../../db/base2.json";

export class pushTraderFeatures {
  constructor(
    private utils: Utils,
    private ref: References,
    private traderData: TraderData
  ) {}

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public pushExports(modPath: any, debugConfig: debugFile): void {
    const modName = "RaidOverhaul";

    //Add Req Shop to the game
    this.traderData.pushTrader();

    //Add Req Shop to Locales
    this.traderData.addTraderToLocales(
      this.ref.tables,
      baseJson.name,
      "Requisitions Office",
      baseJson.nickname,
      baseJson.location,
      "A collection of Ex-PMC's and rogue Scavs who formed a group to aid others in Tarkov. They routinely scour the battlefield for any leftover supplies and aren't afraid to fight their old comrades for it. They may not be the most trustworthy but they do have some much needed provisions in stock."
    );

    //Add custom quests
    this.utils.addQuests(
      this.ref.tables,
      this.ref.imageRouter,
      modPath,
      modName,
      debugConfig.debugMode
    );
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public pushExports2(modPath: any, debugConfig: debugFile): void {
    const modName = "RaidOverhaul";

    //Add Req Shop to the game
    this.traderData.pushTrader2();

    //Add Req Shop to Locales
    this.traderData.addTraderToLocales2(
      this.ref.tables,
      baseJson2.name,
      "Requisitions Office",
      baseJson2.nickname,
      baseJson2.location,
      "A collection of Ex-PMC's and rogue Scavs who formed a group to aid others in Tarkov. They routinely scour the battlefield for any leftover supplies and aren't afraid to fight their old comrades for it. They may not be the most trustworthy but they do have some much needed provisions in stock."
    );

    //Add custom quests
    this.utils.addQuests2(
      this.ref.tables,
      this.ref.imageRouter,
      modPath,
      modName,
      debugConfig.debugMode
    );
  }

  public buildReqAssort(modConfig: configFile, debugConfig: debugFile): void {
    const logString = "AssortMaker";

    //Push each type of item to the assort
    this.traderData.createPlateFluidAssort(debugConfig.debugMode);
    this.traderData.createGearFluidAssort(debugConfig.debugMode);
    this.traderData.createMedsFluidAssort(debugConfig.debugMode);
    this.traderData.createWeaponFluidAssort(debugConfig.debugMode);
    this.traderData.createSpecFluidAssort(debugConfig.debugMode);
    this.traderData.createModsFluidAssort(debugConfig.debugMode);
    this.traderData.createAmmoFluidAssort(debugConfig.debugMode);
    this.traderData.createItemsFluidAssort(debugConfig.debugMode);
    this.traderData.addContainers();
    this.traderData.addReqSlips();
    this.traderData.addReqForms();
    this.traderData.addFlares();
    this.traderData.addNewKeys();

    if (modConfig.EnableCustomItems) {
      this.traderData.addStaticItems(debugConfig.debugMode);
      this.traderData.addCustomPresets(debugConfig.debugMode);
      this.traderData.addAmmo();
    }

    // biome-ignore lint/style/noVar: <explanation>
    // biome-ignore lint/correctness/noInnerDeclarations: <explanation>
    for (
      var wepPresetCount = 0;
      wepPresetCount < this.ref.randomUtil.getInt(18, 37);
      wepPresetCount++
    ) {
      this.traderData.addWeaponPresets(debugConfig.debugMode);
    }
    // biome-ignore lint/style/noVar: <explanation>
    // biome-ignore lint/correctness/noInnerDeclarations: <explanation>
    for (
      var gearPresetCount = 0;
      gearPresetCount < this.ref.randomUtil.getInt(15, 33);
      gearPresetCount++
    ) {
      this.traderData.addGearPresets(debugConfig.debugMode);
    }

    if (debugConfig.debugMode) {
      this.ref.logger.log(
        `[${logString}] ${wepPresetCount} total weapon presets have been added`,
        LogTextColor.GREEN
      );
      this.ref.logger.log(
        `[${logString}] ${gearPresetCount} total gear presets have been added`,
        LogTextColor.GREEN
      );
    }
  }
}
