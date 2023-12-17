"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const baseJson = __importStar(require("../db/base.json"));
const assortJson = __importStar(require("../db/assort.json"));
const jsonc_1 = require("C:/snapshot/project/node_modules/jsonc");
const path = __importStar(require("path"));
const modName = "DJsRaidOverhaul";
class RaidOverhaul {
    mod;
    logger;
    container;
    static container;
    modPath = path.normalize(path.join(__dirname, ".."));
    static filterIndex = [{
            tpl: "",
            entries: [""]
        }];
    constructor() {
        this.mod = "zDJsRaidOverhaul";
    }
    //
    //
    //
    //
    //
    /**
    * @param container container
    */
    preAkiLoad(container) {
        RaidOverhaul.container = container;
        const staticRouterModService = container.resolve("StaticRouterModService");
        const logger = container.resolve("WinstonLogger");
        const profileHelper = container.resolve("ProfileHelper");
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const configServer = container.resolve("ConfigServer");
        const inventoryConfig = configServer.getConfig("aki-inventory");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const SecLB = require("../db/items/DJsSecureLunchbox.json");
        const SmolLB = require("../db/items/DJsSmallLunchbox.json");
        const AmmoLB = require("../db/items/DJsAmmoCrate.json");
        const MedsLB = require("../db/items/DJsSurgicalSet.json");
        const WeaponLB = require("../db/items/DJsWeaponCrate.json");
        const ModLB = require("../db/items/DJsModBox.json");
        const BarterLB = require("../db/items/DJsBarterCrate.json");
        logger.debug(`[${this.mod}] preAki Loading... `);
        container.afterResolution("InventoryCallbacks", (_t, result) => {
            result.openRandomLootContainer = (pmcData, body, sessionID) => {
                return RaidOverhaul.customOpenRandomLootContainer(pmcData, body, sessionID);
            };
        }, { frequency: "Always" });
        inventoryConfig.randomLootContainers["DJsSecureLunchbox"] = SecLB.randomLootContainers["DJsSecureLunchbox"];
        inventoryConfig.randomLootContainers["DJsSmallLunchbox"] = SmolLB.randomLootContainers["DJsSmallLunchbox"];
        inventoryConfig.randomLootContainers["DJsAmmoCrate"] = AmmoLB.randomLootContainers["DJsAmmoCrate"];
        inventoryConfig.randomLootContainers["DJsSurgicalSet"] = MedsLB.randomLootContainers["DJsSurgicalSet"];
        inventoryConfig.randomLootContainers["DJsWeaponCrate"] = WeaponLB.randomLootContainers["DJsWeaponCrate"];
        inventoryConfig.randomLootContainers["DJsModBox"] = ModLB.randomLootContainers["DJsModBox"];
        inventoryConfig.randomLootContainers["DJsBarterCrate"] = BarterLB.randomLootContainers["DJsBarterCrate"];
        staticRouterModService.registerStaticRouter("inventoryupdaterouter", [
            {
                url: "/ir/profile/update",
                action: (url, info, sessionID, output) => {
                    const profile = profileHelper.getPmcProfile(sessionID);
                    const hideout = info.player.Inventory.items;
                    profile.Inventory.items = hideout;
                    logger.info(`[IR] Imported extracted items to inventory (${profile._id})`);
                }
            }
        ], "ir-update-profile-route");
        this.registerProfileImage(preAkiModLoader, imageRouter);
        this.setupTraderUpdateTime(traderConfig);
        Traders_1.Traders["Requisitions"] = "Requisitions";
        logger.debug(`[${this.mod}] preAki Loaded`);
    }
    logAllMapAndExtractNames(dbLocations) {
        const extractList = {};
        for (const loc in dbLocations) {
            const thisLocExits = dbLocations[loc]?.base?.exits;
            if (!thisLocExits)
                continue;
            extractList[loc] = [];
            for (const e in thisLocExits) {
                const thisExit = thisLocExits[e];
                extractList[loc].push(thisExit.Name);
            }
        }
        console.log(extractList);
    }
    //
    //
    //
    //
    //
    //
    /**
    * @param container
    */
    postDBLoad(container) {
        const database = container.resolve("DatabaseServer").getTables();
        const globals = database.globals.config;
        this.container = container;
        const logger = this.container.resolve("WinstonLogger");
        const configServer = container.resolve("ConfigServer");
        const AirdropConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.AIRDROP);
        const db = container.resolve("DatabaseServer").getTables();
        const ImporterUtil = container.resolve("ImporterUtil");
        const JsonUtil = container.resolve("JsonUtil");
        const VFS = container.resolve("VFS");
        const locales = db.locales.global;
        const items = db.templates.items;
        const handbook = db.templates.handbook.Items;
        const modPath = path.resolve(__dirname.toString()).split(path.sep).join("/") + "/";
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        const QIconfigServer = container.resolve("ConfigServer");
        const QuestItems = QIconfigServer.getConfig("aki-lostondeath");
        const modConfig = jsonc_1.jsonc.parse(VFS.readFile(path.resolve(__dirname, "../config/config.jsonc")));
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const botTypes = this.container.resolve("DatabaseServer").getTables().bots.types;
        const jsonUtil = container.resolve("JsonUtil");
        const Ragfair = configServer.getConfig("aki-ragfair");
        const scdatabase = container.resolve("DatabaseServer").getTables();
        logger.debug(`[${this.mod}] postDb Loading... `);
        logger.log("Overhauling your raids. Watch your back out there.", "magenta");
        const mydb = ImporterUtil.loadRecursive(`${modPath}../db/`);
        const itemPath = `${modPath}../db/templates/items/`;
        const handbookPath = `${modPath}../db/templates/handbook/`;
        for (const itemFile in mydb.templates.items) {
            const item = JsonUtil.deserialize(VFS.readFile(`${itemPath}${itemFile}.json`));
            const hb = JsonUtil.deserialize(VFS.readFile(`${handbookPath}${itemFile}.json`));
            const itemId = item._id;
            items[itemId] = item;
            handbook.push({
                "Id": itemId,
                "ParentId": hb.ParentId,
                "Price": hb.Price
            });
            for (const localeID in locales) {
                for (const id in mydb.locales.en.templates) {
                    const item = mydb.locales.en.templates[id];
                    for (const locale in item) {
                        locales[localeID][`${id} ${locale}`] = item[locale];
                    }
                }
                for (const id in mydb.locales.en.preset) {
                    const item = mydb.locales.en.preset[id];
                    for (const locale in item) {
                        locales[localeID][`${id}`] = item[locale];
                    }
                }
            }
            for (const localeID in mydb.locales) {
                for (const id in mydb.locales[localeID].templates) {
                    const item = mydb.locales[localeID].templates[id];
                    for (const locale in item) {
                        locales[localeID][`${id}`] = item[locale];
                    }
                }
                for (const id in mydb.locales[localeID].preset) {
                    const item = mydb.locales[localeID].preset[id];
                    for (const locale in item) {
                        locales[localeID][`${id} ${locale}`] = item[locale];
                    }
                }
            }
            for (let location in database.locations) {
                if (location == "base")
                    continue;
                database.locations[location].base.EscapeTimeLimit = 9999999;
            }
            if (modConfig.Raid.ReduceFoodAndHydroDegrade.Enabled) {
                globals.Health.Effects.Existence.EnergyDamage = modConfig.Raid.ReduceFoodAndHydroDegrade.EnergyDecay;
                globals.Health.Effects.Existence.HydrationDamage = modConfig.Raid.ReduceFoodAndHydroDegrade.HydroDecay;
            }
            if (modConfig.Raid.ChangeAirdropValues.Enabled) {
                AirdropConfig.airdropChancePercent.bigmap = modConfig.Raid.ChangeAirdropValues.Customs;
                AirdropConfig.airdropChancePercent.woods = modConfig.Raid.ChangeAirdropValues.Woods;
                AirdropConfig.airdropChancePercent.lighthouse = modConfig.Raid.ChangeAirdropValues.Lighthouse;
                AirdropConfig.airdropChancePercent.shoreline = modConfig.Raid.ChangeAirdropValues.Interchange;
                AirdropConfig.airdropChancePercent.interchange = modConfig.Raid.ChangeAirdropValues.Shoreline;
                AirdropConfig.airdropChancePercent.reserve = modConfig.Raid.ChangeAirdropValues.Reserve;
            }
            for (const itemID in items) {
                let item = items[itemID];
                if (item._props.BlocksFolding)
                    item._props.BlocksFolding = false;
            }
            for (const itemID in items) {
                let item = items[itemID];
                if (item._props.Foldable)
                    item._props.Foldable = true;
            }
            for (const item in database.templates.items) {
                if (database.templates.items[item]._parent === "5448bf274bdc2dfc2f8b456a") {
                    if (database.templates.items[item]._props.Grids[0]._props.filters[0]) {
                        database.templates.items[item]._props.Grids[0]._props.filters[0].Filter.push(...["DJsSecureLunchbox", "DJsSmallLunchbox", "DJsAmmoCrate", "DJsSurgicalSet", "DJsWeaponCrate", "RequisitionSlips", "DJsModBox", "DJsBarterCrate"]);
                    }
                }
            }
            database.templates.items["5c093db286f7740a1b2617e3"]._props.Grids[0]._props.filters[0].Filter.push(...["DJsSecureLunchbox", "DJsSmallLunchbox"]);
            if (modConfig.Raid.SaveQuestItems) {
                QuestItems.questItems === false;
            }
            if (modConfig.Raid.NoRunThrough) {
                globals.exp.match_end.survived_exp_requirement = 0;
                globals.exp.match_end.survived_seconds_requirement = 0;
            }
            for (const id in items) {
                let base = items[id];
                if (base._parent === "5447e1d04bdc2dff2f8b4567" && modConfig.Raid.LootableMelee) {
                    items[id]._props.Unlootable = false;
                    items[id]._props.UnlootableFromSide = [];
                }
            }
            for (const bot in botTypes) {
                for (const lootSlot in botTypes[bot].inventory.items) {
                    if (botTypes[bot].inventory.items[lootSlot].includes("5783c43d2459774bbe137486")) {
                        botTypes[bot].inventory.items.Backpack.push("RequisitionSlips");
                        botTypes[bot].inventory.items.Pockets.push("RequisitionSlips");
                        botTypes[bot].inventory.items.TacticalVest.push("RequisitionSlips");
                    }
                }
            }
            for (const bot in botTypes) {
                for (const lootSlot in botTypes[bot].inventory.items) {
                    if (botTypes[bot].inventory.items[lootSlot].includes("5449016a4bdc2d6f028b456f")) {
                        botTypes[bot].inventory.items.Backpack.push("RequisitionSlips");
                        botTypes[bot].inventory.items.Pockets.push("RequisitionSlips");
                        botTypes[bot].inventory.items.TacticalVest.push("RequisitionSlips");
                    }
                }
            }
            scdatabase.templates.items["5732ee6a24597719ae0c0281"] = mydb.SecureContainers.WaistPouch["5732ee6a24597719ae0c0281"];
            scdatabase.templates.items["544a11ac4bdc2d470e8b456a"] = mydb.SecureContainers.Alpha["544a11ac4bdc2d470e8b456a"];
            scdatabase.templates.items["5857a8b324597729ab0a0e7d"] = mydb.SecureContainers.Beta["5857a8b324597729ab0a0e7d"];
            scdatabase.templates.items["5857a8bc2459772bad15db29"] = mydb.SecureContainers.Gamma["5857a8bc2459772bad15db29"];
            scdatabase.templates.items["59db794186f77448bc595262"] = mydb.SecureContainers.Epsilon["59db794186f77448bc595262"];
            scdatabase.templates.items["5c093ca986f7740a1867ab12"] = mydb.SecureContainers.Kappa["5c093ca986f7740a1867ab12"];
            this.addTraderToDb(baseJson, tables, jsonUtil);
            this.addTraderToLocales(tables, baseJson.name, "Requisitions Office", baseJson.nickname, baseJson.location, "A collection of Ex-PMC's and rogue Scavs who formed a group to aid others in Tarkov. They routinely scour the battlefield for any leftover supplies and aren't afraid to fight their old comrades for it. They may not be the most trustworthy but they do have some much needed provisions in stock.");
            Ragfair.traders[baseJson._id] = true;
            Ragfair.dynamic.blacklist.custom.push(...["DJsSecureLunchbox", "DJsSmallLunchbox", "DJsAmmoCrate", "DJsSurgicalSet", "DJsWeaponCrate", "DJsModBox", "DJsBarterCrate"]);
            logger.debug(`[${this.mod}] postDb Loaded`);
        }
    }
    static customOpenRandomLootContainer(pmcData, body, sessionID) {
        const invCon = RaidOverhaul.container.resolve("InventoryController");
        const randomUtil = RaidOverhaul.container.resolve("RandomUtil");
        const weightRanHelp = RaidOverhaul.container.resolve("WeightedRandomHelper");
        const openedItem = pmcData.Inventory.items.find(x => x._id === body.item);
        const containerDetails = invCon.itemHelper.getItem(openedItem._tpl);
        const isSealedWeaponBox = containerDetails[1]._name.includes("event_container_airdrop");
        const newItemRequest = {
            tid: "RandomLootContainer",
            items: []
        };
        let foundInRaid = true;
        if (isSealedWeaponBox) {
            const containerSettings = invCon.inventoryHelper.getInventoryConfig().sealedAirdropContainer;
            newItemRequest.items.push(...invCon.lootGenerator.getSealedWeaponCaseLoot(containerSettings));
            foundInRaid = containerSettings.foundInRaid;
        }
        else {
            const rewardContainerDetails = invCon.inventoryHelper.getRandomLootContainerRewardDetails(openedItem._tpl);
            if (rewardContainerDetails.customReward) {
                for (const itemCategory in rewardContainerDetails.rewardTplPool.chances) {
                    const min = rewardContainerDetails.rewardTplPool.chances[itemCategory].min;
                    const max = rewardContainerDetails.rewardTplPool.chances[itemCategory].max;
                    const nValue = rewardContainerDetails.rewardTplPool.chances[itemCategory].nValue;
                    const range = max - min;
                    const itemCount = randomUtil.getBiasedRandomNumber(min, max, range, nValue);
                    if (itemCount > 0) {
                        for (let i = 0; i < itemCount; i++) {
                            const chosenRewardItemTpl = weightRanHelp.getWeightedInventoryItem(rewardContainerDetails.rewardTplPool.loot[itemCategory]);
                            const existingItemInRequest = newItemRequest.items.find(x => x.item_id === chosenRewardItemTpl);
                            if (existingItemInRequest) {
                                existingItemInRequest.count++;
                            }
                            else {
                                newItemRequest.items.push({ item_id: chosenRewardItemTpl, count: 1, isPreset: false });
                            }
                        }
                    }
                }
                if (openedItem.upd) {
                    if (openedItem.upd.SpawnedInSession === true) {
                        foundInRaid = true;
                    }
                }
            }
            else {
                newItemRequest.items.push(...invCon.lootGenerator.getRandomLootContainerLoot(rewardContainerDetails));
                foundInRaid = rewardContainerDetails.foundInRaid;
            }
        }
        const output = invCon.eventOutputHolder.getOutput(sessionID);
        // Find and delete opened item from player inventory
        invCon.inventoryHelper.removeItem(pmcData, body.item, sessionID, output);
        // Add random reward items to player inventory
        invCon.inventoryHelper.addItem(pmcData, newItemRequest, output, sessionID, null, foundInRaid, null, true);
        return output;
    }
    /**
     * @param preAkiModLoader
     * @param imageRouter
     */
    registerProfileImage(preAkiModLoader, imageRouter) {
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Reqs.jpg`);
    }
    /**
     * @param traderConfig
     */
    setupTraderUpdateTime(traderConfig) {
        const traderRefreshRecord = { traderId: baseJson._id, seconds: 3600 };
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    /**
     * @param traderDetailsToAdd
     * @param tables
     * @param jsonUtil
     */
    // rome-ignore lint/suspicious/noExplicitAny: traderDetailsToAdd comes from base.json, so no type
    addTraderToDb(traderDetailsToAdd, tables, jsonUtil) {
        tables.traders[traderDetailsToAdd._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)),
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)),
            questassort: {
                started: {},
                success: {},
                fail: {}
            }
        };
    }
    /**
     * @param tables
     * @param fullName
     * @param firstName
     * @param nickName
     * @param location
     * @param description
     */
    addTraderToLocales(tables, fullName, firstName, nickName, location, description) {
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
}
module.exports = { mod: new RaidOverhaul() };
//# sourceMappingURL=mod.js.map