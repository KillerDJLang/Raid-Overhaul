import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { Item } from "@spt/models/eft/common/tables/IItem";
import { Props } from "@spt/models/eft/common/tables/ITemplateItem";
import { IBarterScheme, ITrader } from "@spt/models/eft/common/tables/ITrader";
import { ITraderAssort, ITraderBase } from "@spt/models/eft/common/tables/ITrader";
import { ISptProfile } from "@spt/models/eft/profile/ISptProfile";
import { ITraderConfig, UpdateTime } from "@spt/models/spt/config/ITraderConfig";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ImageRouter } from "@spt/routers/ImageRouter";
import { HashUtil } from "@spt/utils/HashUtil";
import { JsonUtil } from "@spt/utils/JsonUtil";

import { Currency } from "../Refs/Enums";
import { References } from "../Refs/References";

import * as fs from "node:fs";
import * as path from "node:path";
import * as baseJson from "../../db/base.json";

export class Utils {
    constructor(public ref: References) {}

    //#region Base Utils
    public randomCount(base: number, random: number): number {
        return base + Math.floor(Math.random() * random * 2) - random;
    }

    public loadFiles(dirPath, extName, cb): void {
        if (!fs.existsSync(dirPath)) return;
        const dir = fs.readdirSync(dirPath, { withFileTypes: true });
        dir.forEach((item) => {
            const itemPath = path.normalize(`${dirPath}/${item.name}`);
            if (item.isDirectory()) this.loadFiles(itemPath, extName, cb);
            else if (extName.includes(path.extname(item.name))) cb(itemPath);
        });
    }

    public addQuests(tables, imagerouter, modPath, modName, debugLogging): void {
        let questCount = 0;
        let imageCount = 0;

        this.loadFiles(`${modPath}../db/questFiles/quests/`, [".json"], (filepath) => {
            const keys = require(filepath);
            for (const i in keys) {
                tables.templates.quests[i] = keys[i];
                questCount++;
            }
        });

        this.loadFiles(`${modPath}../db/questFiles/locales/`, [".json"], (localepath) => {
            const Locales = require(localepath);
            for (const i in Locales) {
                for (const localeID in tables.locales.global) {
                    tables.locales.global[localeID][i] = Locales[i];
                }
            }
        });

        this.loadFiles(`${modPath}../db/questFiles/pics/`, [".png", ".jpg"], (filepath) => {
            imagerouter.addRoute(`/files/quest/icon/${path.basename(filepath, path.extname(filepath))}`, filepath);
            imageCount++;
        });

        if (debugLogging) {
            this.ref.logger.log(
                `[${modName}] Loaded ${imageCount} custom images and ${questCount} custom quests.`,
                "cyan",
            );
        }
    }

    public addQuests2(tables, imagerouter, modPath, modName, debugLogging): void {
        let questCount = 0;
        let imageCount = 0;

        this.loadFiles(`${modPath}../db/questFiles2/quests/`, [".json"], (filepath) => {
            const keys = require(filepath);
            for (const i in keys) {
                tables.templates.quests[i] = keys[i];
                questCount++;
            }
        });

        this.loadFiles(`${modPath}../db/questFiles2/locales/`, [".json"], (localepath) => {
            const Locales = require(localepath);
            for (const i in Locales) {
                for (const localeID in tables.locales.global) {
                    tables.locales.global[localeID][i] = Locales[i];
                }
            }
        });

        this.loadFiles(`${modPath}../db/questFiles2/pics/`, [".png", ".jpg"], (filepath) => {
            imagerouter.addRoute(`/files/quest/icon/${path.basename(filepath, path.extname(filepath))}`, filepath);
            imageCount++;
        });

        if (debugLogging) {
            this.ref.logger.log(
                `[${modName}] Loaded ${imageCount} custom images and ${questCount} custom quests.`,
                "cyan",
            );
        }
    }

    public shuffle(array: string[]): any {
        return array.sort(() => Math.random() - 0.5);
    }

    public shufflePop(array: string[]): any {
        return this.shuffle(array).pop().toString();
    }

    public shuffleShift(array: string[]): any {
        return this.shuffle(array).shift().toString();
    }

    public shufflePullTwo(array: string[]): any {
        return this.shuffle(array).pop().toString() && this.shuffle(array).shift().toString();
    }

    public logToServer(message: string, logger: any): void {
        logger.log("[Raid Overhaul] " + message, LogTextColor.CYAN);
    }

    public profileBackup(modName, sessionID: string, path, profile: ISptProfile, randomUtil): void {
        const backupPath = path.join(__dirname, "../../ProfileBackup/");
        const profileData = JSON.stringify(profile, null, 4);
        const randomNum = randomUtil.randInt(1, 20).toString();
        const date = new Date();
        const day = date.toISOString().slice(0, 10);
        const backupName = backupPath + sessionID + "_" + "RO" + "_" + day + "_" + randomNum + "-backup.json";
        const profileCount = this.ref.vfs
            .getFilesOfType(backupPath, "json")
            .sort((a, b) => fs.statSync(a).ctimeMs - fs.statSync(b).ctimeMs);
        const maxBackups = 3;

        if (!this.ref.vfs.exists(backupPath)) {
            this.ref.logger.log(`${modName}: "${backupPath}" has been created`, LogTextColor.MAGENTA);
            this.ref.vfs.createDir(backupPath);
        }

        if (profileCount.length >= maxBackups) {
            const lastProfile = profileCount[0];
            this.ref.vfs.removeFile(lastProfile);
            profileCount.splice(0, 1);
        }

        fs.writeFile(backupName, profileData, { encoding: "utf8", flag: "w", mode: 0o666 }, (err) => {
            if (err) console.log(`[${modName}] Error Backing Up Profile;` + err);
            else {
                this.ref.logger.log(`[${modName}] Profile backup successful.`, LogTextColor.MAGENTA);
            }
        });
    }

    public getItemInHandbook(itemID: string): number {
        try {
            const hbItem = this.ref.tables.templates.handbook.Items.find((i) => i.Id === itemID);
            return hbItem.Price;
        } catch (error) {
            this.ref.logger.warning(`\nError getting Handbook ID for ${itemID}`);
        }
    }

    public getFleaPrice(itemID: string): number {
        if (typeof this.ref.tables.templates.prices[itemID] != "undefined") {
            return this.ref.tables.templates.prices[itemID];
        } else {
            return this.getItemInHandbook(itemID);
        }
    }

    public getFormCost(itemID: string): number {
        return Math.ceil(this.getFleaPrice(itemID) / this.getFleaPrice("66292e79a4d9da25e683ab55"));
    }

    public getReqCost(itemID: string): number {
        return Math.ceil(this.getFleaPrice(itemID) / this.getFleaPrice("668b3c71042c73c6f9b00704"));
    }

    public buildBaseAssort(
        ItemID: string,
        assortUtils: any,
        StockCount: number,
        LoyaltyLevelToPush: number,
        tables: any,
    ) {
        if (Math.round(this.getFleaPrice(ItemID)) <= 49999) {
            assortUtils.createBarterOffer(
                ItemID,
                StockCount,
                LoyaltyLevelToPush,
                Currency.ReqForms,
                this.getFormCost(ItemID),
                tables,
            );
        } else {
            assortUtils.createSingleOffer(ItemID, StockCount, LoyaltyLevelToPush, this.getReqCost(ItemID), tables);
        }
    }

    public getPresetFormCost(PresetID): number {
        return Math.round(
            this.ref.ragfairPriceService.getFleaPriceForOfferItems(PresetID) /
                this.getFleaPrice("66292e79a4d9da25e683ab55"),
        );
    }

    public getPresetReqCost(PresetID): number {
        return Math.ceil(
            this.ref.ragfairPriceService.getFleaPriceForOfferItems(PresetID) /
                this.getFleaPrice("668b3c71042c73c6f9b00704"),
        );
    }

    public buildPresetAssort(
        PresetID,
        assortUtils: any,
        ArrayToPull: any,
        ItemKeys: string,
        StockCount: number,
        LoyaltyLevelToPush: number,
        tables: any,
        logstring: any,
        presetName: any,
    ) {
        const presetPrice = Math.round(this.ref.ragfairPriceService.getFleaPriceForOfferItems(PresetID));
        const slipCost = Math.round(presetPrice / this.getFleaPrice("668b3c71042c73c6f9b00704"));
        const formCost = Math.ceil(presetPrice / this.getFleaPrice("66292e79a4d9da25e683ab55"));

        try {
            if (presetPrice <= 0 || presetPrice == undefined) {
                assortUtils.createComplexOffer(
                    ArrayToPull,
                    ItemKeys,
                    StockCount,
                    LoyaltyLevelToPush,
                    this.ref.randomUtil.randInt(1, 10),
                    tables,
                );
            } else if (presetPrice <= 49999) {
                assortUtils.createComplexFormOffer(
                    ArrayToPull,
                    ItemKeys,
                    StockCount,
                    LoyaltyLevelToPush,
                    formCost,
                    tables,
                );
            } else if (presetPrice >= 50000) {
                assortUtils.createComplexOffer(ArrayToPull, ItemKeys, StockCount, LoyaltyLevelToPush, slipCost, tables);
            }
        } catch (error) {
            this.ref.logger.log(
                `[${logstring}] Error loading ${presetName} => ${error}, skipping preset.`,
                LogTextColor.RED,
            );
        }
    }

    public getItemName(itemID: string, locale = "en") {
        if (this.ref.tables.locales.global[locale][`${itemID} Name`] != undefined) {
            return this.ref.tables.locales.global[locale][`${itemID} Name`];
        } else {
            return this.ref.tables.templates.items[itemID]?._name;
        }
    }

    public addToCases(casesToAdd: string[], itemToAdd: string): void {
        const items = this.ref.tables.templates.items;

        for (const cases of casesToAdd) {
            for (const item in items) {
                if (items[item]._id === cases) {
                    if (items[item]._props?.Grids[0]._props.filters[0].Filter === undefined) {
                        this.stopHurtingMeSVM(cases);
                    }

                    if (items[item]._props?.Grids[0]._props.filters[0].Filter !== undefined) {
                        items[item]._props?.Grids[0]._props.filters[0].Filter.push(itemToAdd);
                    }
                }
            }
        }
    }

    public stopHurtingMeSVM(caseToAdd: string) {
        const unbreakFilters = [
            {
                Filter: ["54009119af1c881c07000029"],
                ExcludedFilter: [""],
            },
        ];

        this.ref.tables.templates.items[caseToAdd]._props.Grids[0]._props.filters = unbreakFilters;
    }
    //#endregion
}

export class TraderUtils {
    //#region Trader Base Utils
    public registerProfileImage(
        baseJson: any,
        modName: string,
        preSptModLoader: PreSptModLoader,
        imageRouter: ImageRouter,
        traderImageName: string,
    ): void {
        const imageFilepath = `./${preSptModLoader.getModPath(modName)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/${traderImageName}`);
    }

    public setTraderUpdateTime(
        traderConfig: ITraderConfig,
        baseJson: any,
        minSeconds: number,
        maxSeconds: number,
    ): void {
        const traderRefreshRecord: UpdateTime = {
            traderId: baseJson._id,
            seconds: {
                min: minSeconds,
                max: maxSeconds,
            },
        };
        traderConfig.updateTime.push(traderRefreshRecord);
    }

    public addTraderToDb(
        traderDetailsToAdd: any,
        tables: IDatabaseTables,
        jsonUtil: JsonUtil,
        dialogueToAdd: any,
        servicesToAdd: any,
    ): void {
        tables.traders[traderDetailsToAdd._id] = {
            assort: this.createAssortTable(),
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)) as ITraderBase,
            dialogue: jsonUtil.deserialize(jsonUtil.serialize(dialogueToAdd)),
            services: jsonUtil.deserialize(jsonUtil.serialize(servicesToAdd)),
            questassort: {
                started: {},
                success: {},
                fail: {},
            },
        };
    }

    public createAssortTable(): ITraderAssort {
        const assortTable: ITraderAssort = {
            nextResupply: 0,
            items: [],
            barter_scheme: {},
            loyal_level_items: {},
        };

        return assortTable;
    }

    public addTraderToLocales(
        baseJson: any,
        tables: IDatabaseTables,
        fullName: string,
        firstName: string,
        nickName: string,
        location: string,
        description: string,
    ) {
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
    //#endregion
}

export class AssortUtils {
    //#region AssortUtils

    protected itemsToSell: Item[] = [];
    protected barterScheme: Record<string, IBarterScheme[][]> = {};
    protected loyaltyLevel: Record<string, number> = {};
    protected hashUtil: HashUtil;
    protected logger: ILogger;

    constructor(hashutil: HashUtil, logger: ILogger) {
        this.hashUtil = hashutil;
        this.logger = logger;
    }

    /**
     * Start selling item with tpl
     * @param itemTpl Tpl id of the item you want trader to sell
     * @param itemId Optional - set your own Id, otherwise unique id will be generated
     */
    public createSingleAssortItem(itemTpl: string, itemId = undefined): AssortUtils {
        // Create item ready for insertion into assort table
        const newItemToAdd: Item = {
            _id: !itemId ? this.hashUtil.generate() : itemId,
            _tpl: itemTpl,
            parentId: "hideout", // Should always be "hideout"
            slotId: "hideout", // Should always be "hideout"
            upd: {
                UnlimitedCount: false,
                StackObjectsCount: 100,
            },
        };

        this.itemsToSell.push(newItemToAdd);

        return this;
    }

    public createComplexAssortItem(items: Item[]): AssortUtils {
        items[0].parentId = "hideout";
        items[0].slotId = "hideout";

        if (!items[0].upd) {
            items[0].upd = {};
        }

        items[0].upd.UnlimitedCount = false;
        items[0].upd.StackObjectsCount = 100;

        this.itemsToSell.push(...items);

        return this;
    }

    public addStackCount(stackCount: number): AssortUtils {
        this.itemsToSell[0].upd.StackObjectsCount = stackCount;

        return this;
    }

    public addUnlimitedStackCount(): AssortUtils {
        this.itemsToSell[0].upd.StackObjectsCount = 999999;
        this.itemsToSell[0].upd.UnlimitedCount = true;

        return this;
    }

    public makeStackCountUnlimited(): AssortUtils {
        this.itemsToSell[0].upd.StackObjectsCount = 999999;

        return this;
    }

    public addBuyRestriction(maxBuyLimit: number): AssortUtils {
        this.itemsToSell[0].upd.BuyRestrictionMax = maxBuyLimit;
        this.itemsToSell[0].upd.BuyRestrictionCurrent = 0;

        return this;
    }

    public addLoyaltyLevel(level: number) {
        this.loyaltyLevel[this.itemsToSell[0]._id] = level;

        return this;
    }

    public addMoneyCost(currencyType: Currency, amount: number): AssortUtils {
        this.barterScheme[this.itemsToSell[0]._id] = [
            [
                {
                    count: amount,
                    _tpl: currencyType,
                },
            ],
        ];

        return this;
    }

    public addBarterCost(itemTpl: string, count: number): AssortUtils {
        const sellableItemId = this.itemsToSell[0]._id;

        // No data at all, create
        if (Object.keys(this.barterScheme).length === 0) {
            this.barterScheme[sellableItemId] = [
                [
                    {
                        count: count,
                        _tpl: itemTpl,
                    },
                ],
            ];
        } else {
            // Item already exists, add to
            const existingData = this.barterScheme[sellableItemId][0].find((x) => x._tpl === itemTpl);
            if (existingData) {
                // itemtpl already a barter for item, add to count
                existingData.count += count;
            } else {
                // No barter for item, add it fresh
                this.barterScheme[sellableItemId][0].push({
                    count: count,
                    _tpl: itemTpl,
                });
            }
        }

        return this;
    }

    /**
     * Reset object ready for reuse
     * @returns
     */
    public export(data: ITrader, blockDupes: boolean): AssortUtils {
        const itemBeingSoldId = this.itemsToSell[0]._id;
        const itemBeingSoldTpl = this.itemsToSell[0]._tpl;
        if (blockDupes) {
            if (data.assort.items.find((x) => x._id === itemBeingSoldId)) {
                return;
            }

            if (data.assort.items.find((x) => x._tpl === itemBeingSoldTpl)) {
                return;
            }
        }

        data.assort.items.push(...this.itemsToSell);
        data.assort.barter_scheme[itemBeingSoldId] = this.barterScheme[itemBeingSoldId];
        data.assort.loyal_level_items[itemBeingSoldId] = this.loyaltyLevel[itemBeingSoldId];

        this.itemsToSell = [];
        this.barterScheme = {};
        this.loyaltyLevel = {};

        return this;
    }

    public pushFromTraderAssort(
        items: Item[],
        itemTpl: string,
        count: number,
        stackCount: number,
        level: number,
        data: ITrader,
        blockDupes: boolean,
    ) {
        items[0].parentId = "hideout";
        items[0].slotId = "hideout";

        if (!items[0].upd) {
            items[0].upd = {};
        }

        items[0].upd.UnlimitedCount = false;
        items[0].upd.StackObjectsCount = 100;

        this.itemsToSell.push(...items);

        const sellableItemId = this.itemsToSell[0]._id;

        // No data at all, create
        if (Object.keys(this.barterScheme).length === 0) {
            this.barterScheme[sellableItemId] = [
                [
                    {
                        count: count,
                        _tpl: itemTpl,
                    },
                ],
            ];
        } else {
            // Item already exists, add to
            const existingData = this.barterScheme[sellableItemId][0].find((x) => x._tpl === itemTpl);
            if (existingData) {
                // itemtpl already a barter for item, add to count
                existingData.count += count;
            } else {
                // No barter for item, add it fresh
                this.barterScheme[sellableItemId][0].push({
                    count: count,
                    _tpl: itemTpl,
                });
            }
        }

        this.itemsToSell[0].upd.StackObjectsCount = stackCount;

        this.loyaltyLevel[this.itemsToSell[0]._id] = level;

        const itemBeingSoldId = this.itemsToSell[0]._id;
        const itemBeingSoldTpl = this.itemsToSell[0]._tpl;
        if (blockDupes) {
            if (data.assort.items.find((x) => x._id === itemBeingSoldId)) {
                return;
            }

            if (data.assort.items.find((x) => x._tpl === itemBeingSoldTpl)) {
                return;
            }
        }

        data.assort.items.push(...this.itemsToSell);
        data.assort.barter_scheme[itemBeingSoldId] = this.barterScheme[itemBeingSoldId];
        data.assort.loyal_level_items[itemBeingSoldId] = this.loyaltyLevel[itemBeingSoldId];

        this.itemsToSell = [];
        this.barterScheme = {};
        this.loyaltyLevel = {};
    }

    public getCustomPresets(
        StockCount: number,
        LoyaltyLevel: number,
        importerUtil: any,
        ragfairPriceService: any,
        tables: any,
    ) {
        const profiles = importerUtil.loadRecursive("user/profiles/");
        const presetPool = [];
        for (const profile in profiles) {
            if (!profiles[profile]?.userbuilds) continue;
            for (const weaponBuild of profiles[profile].userbuilds.weaponBuilds) {
                const presetItems = weaponBuild.Items;
                const baseID = presetItems[0]._id;
                const baseTpl = presetItems[0]._tpl;
                if (presetPool.includes(baseID)) {
                    continue;
                }
                presetPool.push(baseID);
                presetItems[0] = {
                    _id: baseID,
                    _tpl: baseTpl,
                    parentId: "hideout",
                    slotId: "hideout",
                    BackgroundColor: "yellow",
                    upd: {
                        UnlimitedCount: false,
                        StackObjectsCount: StockCount,
                    },
                    preWeapon: true,
                };
                const finalPresetItems = structuredClone(presetItems);
                for (const finalPreset of finalPresetItems) {
                    this.itemsToSell.push(...finalPreset);
                    this.addBarterCost(
                        Currency.ReqSlips,
                        this.getPresetReqCost(finalPreset, ragfairPriceService, tables),
                    );
                    this.addLoyaltyLevel(LoyaltyLevel);
                    this.export(tables.traders[baseJson._id], false);
                }
            }
        }
    }

    public getPresetReqCost(PresetID, ragfairPriceService: any, tables: any): number {
        return Math.ceil(
            ragfairPriceService.getFleaPriceForOfferItems(PresetID) /
                this.getFleaPrice("668b3c71042c73c6f9b00704", tables),
        );
    }

    public getFleaPrice(itemID: string, tables: any): number {
        if (typeof tables.templates.prices[itemID] != "undefined") {
            return tables.templates.prices[itemID];
        } else {
            return this.getItemInHandbook(itemID, tables);
        }
    }

    public getItemInHandbook(itemID: string, tables: any): number {
        try {
            const hbItem = tables.templates.handbook.Items.find((i) => i.Id === itemID);
            return hbItem.Price;
        } catch (error) {
            this.logger.warning(`\nError getting Handbook ID for ${itemID}`);
        }
    }

    public createSingleOffer(
        ItemToAdd: string,
        StockCount: number,
        LoyaltyLevelToPush: number,
        ReqCost: number,
        tables: any,
    ) {
        this.createSingleAssortItem(ItemToAdd)
            .addStackCount(StockCount)
            .addLoyaltyLevel(LoyaltyLevelToPush)
            .addBarterCost(Currency.ReqSlips, ReqCost)
            .export(tables.traders[baseJson._id], false);
    }

    public createSingleCashOffer(
        ItemToAdd: string,
        StockCount: number,
        LoyaltyLevelToPush: number,
        CurrencyToUse: any,
        ReqCost: number,
        tables: any,
    ) {
        this.createSingleAssortItem(ItemToAdd)
            .addStackCount(StockCount)
            .addLoyaltyLevel(LoyaltyLevelToPush)
            .addMoneyCost(CurrencyToUse, ReqCost)
            .export(tables.traders[baseJson._id], false);
    }

    public createBarterOffer(
        ItemToAdd: string,
        StockCount: number,
        LoyaltyLevelToPush: number,
        BarterToUse: string,
        ReqCost: number,
        tables: any,
    ) {
        this.createSingleAssortItem(ItemToAdd)
            .addStackCount(StockCount)
            .addLoyaltyLevel(LoyaltyLevelToPush)
            .addBarterCost(BarterToUse, ReqCost)
            .export(tables.traders[baseJson._id], false);
    }

    public createComplexOffer(
        ArrayToPull: any,
        ItemKeys: string,
        StockCount: number,
        LoyaltyLevelToPush: number,
        ReqCost: number,
        tables: any,
    ) {
        this.createComplexAssortItem(ArrayToPull[ItemKeys]._items)
            .addMoneyCost(Currency.ReqSlips, ReqCost)
            .addStackCount(StockCount)
            .addLoyaltyLevel(LoyaltyLevelToPush)
            .export(tables.traders[baseJson._id], true);
    }

    public createComplexFormOffer(
        ArrayToPull: any,
        ItemKeys: string,
        StockCount: number,
        LoyaltyLevelToPush: number,
        ReqCost: number,
        tables: any,
    ) {
        this.createComplexAssortItem(ArrayToPull[ItemKeys]._items)
            .addMoneyCost(Currency.ReqForms, ReqCost)
            .addStackCount(StockCount)
            .addLoyaltyLevel(LoyaltyLevelToPush)
            .export(tables.traders[baseJson._id], true);
    }

    public createPresetFormOffer(
        PresetItem: any,
        StockCount: number,
        LoyaltyLevelToPush: number,
        ReqCost: number,
        tables: any,
    ) {
        this.createComplexAssortItem(PresetItem)
            .addMoneyCost(Currency.ReqForms, ReqCost)
            .addStackCount(StockCount)
            .addLoyaltyLevel(LoyaltyLevelToPush)
            .export(tables.traders[baseJson._id], true);
    }

    public createPresetSlipOffer(
        PresetItem: any,
        StockCount: number,
        LoyaltyLevelToPush: number,
        ReqCost: number,
        tables: any,
    ) {
        this.createComplexAssortItem(PresetItem)
            .addMoneyCost(Currency.ReqSlips, ReqCost)
            .addStackCount(StockCount)
            .addLoyaltyLevel(LoyaltyLevelToPush)
            .export(tables.traders[baseJson._id], true);
    }
    //#endregion
}
//#region Item Gen Types
export type ItemGeneratorSettings = {
    newItem: {
        ItemToClone: string;
        newID: string;
        parentID: string;
        OverrideProperties: Props;
        LocalePush: {
            en: {
                name: string;
                shortName: string;
                description: string;
            };
        };
        HandbookParent: string;
        HandbookPrice: number;
        CloneToFilters?: boolean;
        PushMastery?: boolean;
        AddToBots?: boolean;
        BotLootItemToClone?: string;
        QuestPush?: {
            AddToQuests: boolean;
            QuestConditionType: string;
            QuestTargetConditionToClone: string;
        };
        LootPush?: {
            AddToStaticLoot: boolean;
            LootContainersToAdd: string[];
            StaticLootProbability: number;
        };
        AddToCases?: boolean;
        CasesToPush?: string[];
        PushToFleaBlacklist?: boolean;
        SlotInfo?: {
            AddToSlot: boolean;
            Slot: number;
        };
    };
};

export type ClothingTopSettings = {
    NewOutfitID: string;
    BundlePath: string;
    HandsToClone: string;
    HandsBundlePath: string;
};

export type ClothingBottomSettings = {
    NewBottomsID: string;
    BundlePath: string;
};
//#endregion
