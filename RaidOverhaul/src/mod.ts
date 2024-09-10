import type { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { Traders } from "@spt/models/enums/Traders";
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import type { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import type { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import type { ITraderConfig } from "@spt/models/spt/config/ITraderConfig";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

import { Base } from "./BaseFeatures/baseFeatures";
import { ItemGenerator } from "./CustomItems/ItemGenerator";
import { LegionData } from "./RaidBoss/Legion";
import { TraderData } from "./Trader/ReqShop";
import { pushTraderFeatures } from "./Trader/TraderPushes";
import { DynamicRouters } from "./Utils/DynamicRouterHooks";
import type { configFile } from "./Utils/Enums";
import { Logger } from "./Utils/Logger";
import { References } from "./Utils/References";
import { StaticRouters } from "./Utils/StaticRouterHooks";
import { Utils } from "./Utils/Utils";

import * as fs from "node:fs";
import * as path from "node:path";
import JSON5 from "json5";
import * as baseJson from "../db/base.json";

const legionClothes = require("../db/ItemGen/Clothes/LegionClothing.json");

class RaidOverhaul implements IPreSptLoadMod, IPostDBLoadMod {
    static modName = "Raid Overhaul";

    private ref: References = new References();
    private logger: Logger = new Logger(this.ref);
    private utils: Utils = new Utils(this.ref, this.logger);

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

    public preSptLoad(container: DependencyContainer): void {
        this.ref.preSptLoad(container);
        const ragfair = this.ref.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);
        const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const traderData = new TraderData(traderConfig, this.ref, this.utils, this.logger);
        const staticRouters = new StaticRouters(this.ref, this.utils, this.logger);
        const dynamicRouters = new DynamicRouters(this.ref, this.utils, this.logger);

        const modConfig = JSON5.parse(
            this.ref.vfs.readFile(path.resolve(__dirname, "../config/config.json5")),
        ) as configFile;

        if (modConfig.RemoveFromSwag) {
            return;
        }

        traderData.registerProfileImage();
        traderData.setupTraderUpdateTime();

        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        Traders["Requisitions"] = "Requisitions";
        ragfair.traders[baseJson._id] = true;

        //Register router hooks
        staticRouters.registerHooks();
        dynamicRouters.registerHooks();
    }

    public postDBLoad(container: DependencyContainer): void {
        this.ref.postDBLoad(container);

        const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);

        //Imports
        const traderData = new TraderData(traderConfig, this.ref, this.utils, this.logger);
        const modFeatures = new Base(this.utils, this.ref, this.logger);
        const itemGenerator = new ItemGenerator(this.ref);
        const traderFeatures = new pushTraderFeatures(this.utils, this.ref, traderData);
        const modPath = `${path.resolve(__dirname.toString()).split(path.sep).join("/")}/`;
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
            this.logger.logError("Removing Legion from Swag config. Ready to uninstall.");
            return;
        }

        //Check for proper install
        if (!RaidOverhaul.pluginDepCheck()) {
            this.logger.logError(
                "Error, client portion of Raid Overhaul is missing from BepInEx/plugins folder.\nPlease install correctly.",
            );
            return;
        }

        if (!RaidOverhaul.preloaderDepCheck()) {
            this.logger.logError(
                "Error, Legion Boss Preloader is missing from BepInEx/patchers folder.\nPlease install correctly.",
            );
            return;
        }

        this.loadCustomItems(itemGenerator, modConfig);
        this.loadTraderData(traderFeatures, modFeatures, modConfig, modPath);
        this.pushModFeatures(modFeatures, modConfig);
        this.pushBossData(itemGenerator, modConfig);

        this.logger.log(`has finished modifying your raids. ${randomMessage}.`, LogTextColor.CYAN);
    }

    private loadCustomItems(itemGenerator: ItemGenerator, modConfig: configFile) {
        //Load all custom items
        itemGenerator.createCustomItems("../../db/ItemGen/Currency");
        itemGenerator.createCustomItems("../../db/ItemGen/ConstItems");
        itemGenerator.createCustomItems("../../db/ItemGen/CustomKeys");
        if (modConfig.EnableCustomItems) {
            if (this.ref.preSptModLoader.getImportedModsNames().includes("SPT-Realism")) {
                itemGenerator.createCustomItems("../../db/ItemGen/Ammo Realism");
                this.logger.log("Realism detected, modifying custom ammunition.", LogTextColor.MAGENTA);
            }

            if (!this.ref.preSptModLoader.getImportedModsNames().includes("SPT-Realism")) {
                itemGenerator.createCustomItems("../../db/ItemGen/Ammo");
            }
            itemGenerator.createCustomItems("../../db/ItemGen/Weapons");
            itemGenerator.createCustomItems("../../db/ItemGen/Gear");
        }
        this.ref.tables.locations.laboratory.base.AccessKeys.push(...["66a2fc9886fbd5d38c5ca2a6"]);
    }

    private loadTraderData(traderFeatures: pushTraderFeatures, modFeatures: Base, modConfig: configFile, modPath) {
        // Load Trader Data
        if (modConfig.EnableCustomBoss) {
            traderFeatures.pushExports(modPath, modConfig);
            traderFeatures.buildReqAssort(modConfig);
            modFeatures.traderTweaks(modConfig);
        } else if (!modConfig.EnableCustomBoss) {
            traderFeatures.pushExports2(modPath, modConfig);
            traderFeatures.buildReqAssort(modConfig);
            modFeatures.traderTweaks(modConfig);
        }
    }

    private pushModFeatures(modFeatures: Base, modConfig: configFile) {
        //Push all of the mods base features
        modFeatures.raidChanges(modConfig);
        modFeatures.itemChanges(modConfig);
        modFeatures.lootChanges(modConfig);
        modFeatures.stackChanges(modConfig);
        modFeatures.eventChanges(modConfig);
        modFeatures.weightChanges(modConfig);
        if (modConfig.Events.EnableWeatherOptions && modConfig.Events.WinterWonderland) {
            modFeatures.weatherChangesWinterWonderland(modConfig);
        }
    }

    private pushBossData(itemGenerator: ItemGenerator, modConfig: configFile) {
        // Load custom boss data
        if (modConfig.EnableCustomBoss) {
            itemGenerator.createClothingTop(legionClothes.Shirt);
            itemGenerator.createClothingBottom(legionClothes.Pants);
        } else {
            LegionData.RemoveLegionPatch();
        }
    }
}
//      \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/

module.exports = { mod: new RaidOverhaul() };
