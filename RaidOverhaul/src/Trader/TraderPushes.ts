import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

import { configFile } from "../Refs/Enums";
import { References } from "../Refs/References";
import { Utils } from "../Refs/Utils";
import { TraderData } from "../Trader/ReqShop";

import * as baseJson from "../../db/base.json";
import * as baseJson2 from "../../db/base2.json";

export class pushTraderFeatures {
    constructor(
        private utils: Utils,
        private ref: References,
        private traderData: TraderData,
    ) {}

    public pushExports(modPath: any, modConfig: configFile): void {
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
            "A collection of Ex-PMC's and rogue Scavs who formed a group to aid others in Tarkov. They routinely scour the battlefield for any leftover supplies and aren't afraid to fight their old comrades for it. They may not be the most trustworthy but they do have some much needed provisions in stock.",
        );

        //Add custom quests
        this.utils.addQuests(this.ref.tables, this.ref.imageRouter, modPath, modName, modConfig.Debug.ExtraLogging);
    }

    public pushExports2(modPath: any, modConfig: configFile): void {
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
            "A collection of Ex-PMC's and rogue Scavs who formed a group to aid others in Tarkov. They routinely scour the battlefield for any leftover supplies and aren't afraid to fight their old comrades for it. They may not be the most trustworthy but they do have some much needed provisions in stock.",
        );

        //Add custom quests
        this.utils.addQuests2(this.ref.tables, this.ref.imageRouter, modPath, modName, modConfig.Debug.ExtraLogging);
    }

    public buildReqAssort(modConfig: configFile): void {
        const logString = "AssortMaker";

        //Push each type of item to the assort
        this.traderData.createPlateFluidAssort(modConfig.Debug.ExtraLogging);
        this.traderData.createGearFluidAssort(modConfig.Debug.ExtraLogging);
        this.traderData.createMedsFluidAssort(modConfig.Debug.ExtraLogging);
        this.traderData.createWeaponFluidAssort(modConfig.Debug.ExtraLogging);
        this.traderData.createSpecFluidAssort(modConfig.Debug.ExtraLogging);
        this.traderData.createModsFluidAssort(modConfig.Debug.ExtraLogging);
        this.traderData.createAmmoFluidAssort(modConfig.Debug.ExtraLogging);
        this.traderData.createItemsFluidAssort(modConfig.Debug.ExtraLogging);
        this.traderData.addContainers();
        this.traderData.addReqSlips();
        this.traderData.addReqForms();
        this.traderData.addFlares();
        this.traderData.addNewKeys();

        if (modConfig.EnableCustomItems) {
            this.traderData.addStaticItems(modConfig.Debug.ExtraLogging);
            this.traderData.addCustomPresets(modConfig.Debug.ExtraLogging);
            this.traderData.addAmmo();
        }

        for (var wepPresetCount = 0; wepPresetCount < this.ref.randomUtil.getInt(18, 37); wepPresetCount++)
            this.traderData.addWeaponPresets(wepPresetCount, modConfig.Debug.ExtraLogging);
        for (var gearPresetCount = 0; gearPresetCount < this.ref.randomUtil.getInt(15, 33); gearPresetCount++)
            this.traderData.addGearPresets(gearPresetCount, modConfig.Debug.ExtraLogging);

        //18, 34 and 12, 30

        if (modConfig.Debug.ExtraLogging) {
            this.ref.logger.log(
                `[${logString}] ${wepPresetCount} total weapon presets have been added`,
                LogTextColor.GREEN,
            );
            this.ref.logger.log(
                `[${logString}] ${gearPresetCount} total gear presets have been added`,
                LogTextColor.GREEN,
            );
        }
    }
}
