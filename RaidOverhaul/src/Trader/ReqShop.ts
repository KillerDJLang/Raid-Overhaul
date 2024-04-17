import { container }                            from "tsyringe";

import { DatabaseServer }                       from "@spt-aki/servers/DatabaseServer";
import { IDatabaseTables }                      from "@spt-aki/models/spt/server/IDatabaseTables";
import { ITraderConfig, UpdateTime }            from "@spt-aki/models/spt/config/ITraderConfig";
import { LogTextColor }                         from "@spt-aki/models/spt/logging/LogTextColor";
import { ILogger }                              from "@spt-aki/models/spt/utils/ILogger";
import { IPmcData }                             from "@spt-aki/models/eft/common/IPmcData";
import { RandomUtil }                           from "@spt-aki/utils/RandomUtil";
import { JsonUtil }                             from "@spt-aki/utils/JsonUtil";
import { HashUtil }                             from "@spt-aki/utils/HashUtil";
import { VFS }                                  from "@spt-aki/utils/VFS";

import { References }                           from "../Refs/References";
import { AssortUtils, TraderUtils, Utils }      from "../Refs/Utils";
import { Currency }                             from "../Refs/Enums";

import * as customPresetArray   from "../Refs/ArrayFiles/Items/customPresets.json";
import * as weaponPresetArray   from "../Refs/ArrayFiles/Items/weaponPresets.json";
import * as gearPresetArray     from "../Refs/ArrayFiles/Items/gearPresets.json";
import * as dialogue            from "../../db/dialogue.json";
import * as services            from "../../db/services.json";
import * as baseJson            from "../../db/base.json";
import * as path                from "path";

export class TraderData
{
    mod: string;
    logString: string;
    private traderHelper: TraderUtils;
    private assortUtils: AssortUtils;

    constructor(private traderConfig: ITraderConfig, private ref: References, private utils: Utils, private vfs: VFS, private randomUtil: RandomUtil, private jsonUtil: JsonUtil, private logger: ILogger) 
    {
        this.mod = "RaidOverhaul";
        this.logString = "AssortMaker";
    }

    //#region Base Trader Methods
    public registerProfileImage(): void
    {
        const imageFilepath = `./${this.ref.preAkiModLoader.getModPath(this.mod)}res`;
    
        this.ref.imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Reqs.jpg`);
    }
    
    public setupTraderUpdateTime(): void
    {
        const traderRefreshRecord: UpdateTime = {
            traderId: baseJson._id,
            seconds: {
                min: 1800,
                max: 7200
            } 
        };
        this.traderConfig.updateTime.push(traderRefreshRecord);
    }
           
    public pushTrader(): void
    {
        this.traderHelper = new TraderUtils();
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();

        this.traderHelper.addTraderToDb(baseJson, tables, this.jsonUtil, dialogue, services)
    }
    
    public addTraderToLocales(tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string): void
    {
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) 
        {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }

    public createItemFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const itemArray =                       JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/itemArray.json")));

        var count = 0

        itemArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(30, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 10);
                const randomEuroCount =     this.randomUtil.randInt(150, 5000);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.Euros, randomEuroCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Assort Item from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total items have been added`, LogTextColor.GREEN)
        }
    }
    //#endregion
    //
    //
    //
    //#region Create Assorts
    public createAmmoFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const ammoArray =                       JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/ammoArray.json")));

        var count = 0

        ammoArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(20, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 300); 
                const randomEuroCount =     this.randomUtil.randInt(5, 20);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.Euros, randomEuroCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Assort Ammo from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total types of ammo have been added`, LogTextColor.GREEN);
        }
    }

    //
    //
    //

    public createPlateFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const plateArray =                      JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/plateArray.json")));

        var count = 0

        plateArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(23, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 10);
                const randomReqSlipCount =  this.randomUtil.randInt(1, 10);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Plates from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total plates have been added`, LogTextColor.GREEN);
        }
    }

    //
    //
    //

    public createMedsFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const medsArray =                       JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/medsArray.json")));

        var count = 0

        medsArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(30, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 10);
                const randomReqSlipCount =  this.randomUtil.randInt(1, 4);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Meds from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total meds have been added`, LogTextColor.GREEN);
        }
    }

    //
    //
    //

    public createModsFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const modsArray =                       JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/modsArray.json")));

        var count = 0

        modsArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(10, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 10);
                const randomEuroCount =     this.randomUtil.randInt(150, 1500);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.Euros, randomEuroCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Weapon Mods from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total weapon mods have been added`, LogTextColor.GREEN);
        }
    }
    
    //
    //
    //

    public createGearFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const gearArray =                       JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/gearArray.json")));

        var count = 0

        gearArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(15, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 10);
                const randomReqSlipCount =  this.randomUtil.randInt(1, 7);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Gear from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total pieces of gear have been added`, LogTextColor.GREEN);
        }
    }

    //
    //
    //

    public createWeaponFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const weaponArray =                     JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/weaponArray.json")));

        var count = 0

        weaponArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(15, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 10);
                const randomReqSlipCount =  this.randomUtil.randInt(1, 10);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Weapons from Fluid Assort Trader Generator:` + error);
                }
            }
        }) 

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total weapons have been added`, LogTextColor.GREEN);
        }
    }
    
    //
    //
    //

    public createKeyFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const keyArray =                        JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/keyArray.json")));

        var count = 0

        keyArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(3, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 3);
                const randomReqSlipCount =  this.randomUtil.randInt(2, 10);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Keys from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total keys have been added`, LogTextColor.GREEN);
        }
    }

    //
    //
    //

    public createSpecFluidAssort(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const keyArray =                        JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/specArray.json")));

        var count = 0

        keyArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(5, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 1);
                const randomReqSlipCount =  this.randomUtil.randInt(4, 20);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Special Items from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total special items have been added`, LogTextColor.GREEN);
        }
    }

    //
    //
    //

    public addStaticItems(probabilityHelper, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);
        const staticArray =                     JSON.parse(this.vfs.readFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/staticArray.json")));

        var count = 0

        staticArray.forEach((item) => 
        {
            if (probabilityHelper.rollChance(35, 100))
            {
                const randomAssortCount =   this.randomUtil.randInt(0, 7);
                const randomReqSlipCount =  this.randomUtil.randInt(1, 10);
                const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
                count++
                try
                {
                    this.assortUtils.createSingleAssortItem(item)
                                    .addStackCount(randomAssortCount)
                                    .addLoyaltyLevel(randomLoyaltyLevel)
                                    .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                    .export(tables.traders[baseJson._id], true);
                }
                catch(error)
                {
                    this.logger.error(`[${this.logString}] Error loading Static Items from Fluid Assort Trader Generator:` + error);
                }
            }
        })

        if (debugLogging)
        {
            this.logger.log(`[${this.logString}] ${count} total static items have been added`, LogTextColor.GREEN);
        }
    }

    //
    //
    //

    public addReqSlips(): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);

        const randomBrtAssortCount =    this.randomUtil.randInt(0, 20);
        const randomAssortCount =       this.randomUtil.randInt(0, 20);
        const randomReqBrtCount =       this.randomUtil.randInt(1, 5);
        const randomEuroCount =         this.randomUtil.randInt(250, 600);

        this.assortUtils.createSingleAssortItem("RequisitionSlips")
                        .addStackCount(randomBrtAssortCount)
                        .addLoyaltyLevel(1)
                        .addBarterCost("5d235b4d86f7742e017bc88a", randomReqBrtCount)
                        .export(tables.traders[baseJson._id], false);

        this.assortUtils.createSingleAssortItem("RequisitionSlips")
                        .addStackCount(randomAssortCount)
                        .addLoyaltyLevel(1)
                        .addMoneyCost(Currency.Euros, randomEuroCount)
                        .export(tables.traders[baseJson._id], false);
    }

    //
    //
    //

    public addFlares(): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);

        const randomAssortCount =       this.randomUtil.randInt(1, 5);
        const randomReqSlipCount =      this.randomUtil.randInt(2, 6);

        this.assortUtils.createSingleAssortItem("62178be9d0050232da3485d9")
                        .addStackCount(randomAssortCount)
                        .addLoyaltyLevel(1)
                        .addBarterCost(Currency.ReqSlips, randomReqSlipCount)
                        .export(tables.traders[baseJson._id], false);
    }

    //
    //
    //

    public addWeaponPresets(count, debugLogging): void 
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);

        const randomAssortCount =   this.randomUtil.randInt(0, 10);
        const randomReqSlipCount =  this.randomUtil.randInt(2, 6);
        const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
        var keys =                  Object.keys(weaponPresetArray);
        const shuffledKeys =        this.utils.shuffle(keys).shift();

        if (shuffledKeys == "undefined")
        {
            const reshuffledKeys = this.utils.shuffle(keys).shift();

            try
            {
                this.logger.log(`[${this.logString}] ${weaponPresetArray[reshuffledKeys]._name} has been added to the Req Shop`, LogTextColor.GREEN);

                this.assortUtils.createComplexAssortItem(weaponPresetArray[reshuffledKeys]._items)
                                .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                .addStackCount(randomAssortCount)
                                .addLoyaltyLevel(randomLoyaltyLevel)
                                .export(tables.traders[baseJson._id], true);
                                count++
            }
            catch(error)
            {
                return;
            }
        }

        else
        {
            try
            {
                if (debugLogging)
                {
                    this.logger.log(`[${this.logString}] ${weaponPresetArray[shuffledKeys]._name} has been added to the Req Shop`, LogTextColor.GREEN);
                }

                this.assortUtils.createComplexAssortItem(weaponPresetArray[shuffledKeys]._items)
                                .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                .addStackCount(randomAssortCount)
                                .addLoyaltyLevel(randomLoyaltyLevel)
                                .export(tables.traders[baseJson._id], true);
                                count++
            }
            catch(error)
            {
                return;
            }
        }
    }

    //
    //
    //

    public addGearPresets(count, debugLogging): void 
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);

        const randomAssortCount =   this.randomUtil.randInt(0, 10);
        const randomReqSlipCount =  this.randomUtil.randInt(1, 6);
        const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
        var keys =                  Object.keys(gearPresetArray);
        const shuffledKeys =        this.utils.shuffle(keys).shift();

        if (shuffledKeys == "undefined")
        {
            const reshuffledKeys = this.utils.shuffle(keys).shift();

            try
            {
                this.logger.log(`[${this.logString}] ${gearPresetArray[reshuffledKeys]._name} has been added to the Req Shop`, LogTextColor.GREEN);

                this.assortUtils.createComplexAssortItem(gearPresetArray[reshuffledKeys]._items)
                                .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                .addStackCount(randomAssortCount)
                                .addLoyaltyLevel(randomLoyaltyLevel)
                                .export(tables.traders[baseJson._id], true);
                                count++
            }
            catch(error)
            {
                return;
            }
        }

        else
        {
            try
            {
                if (debugLogging)
                {
                    this.logger.log(`[${this.logString}] ${gearPresetArray[shuffledKeys]._name} has been added to the Req Shop`, LogTextColor.GREEN);
                }

                this.assortUtils.createComplexAssortItem(gearPresetArray[shuffledKeys]._items)
                                .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                .addStackCount(randomAssortCount)
                                .addLoyaltyLevel(randomLoyaltyLevel)
                                .export(tables.traders[baseJson._id], true);
                                count++
            }
            catch(error)
            {
                return;
            }
        }
    }

    //
    //
    //

    public addCustomPresets(count, debugLogging): void
    {
        const databaseServer: DatabaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const hashUtil: HashUtil =              container.resolve<HashUtil>("HashUtil");
        const tables =                          databaseServer.getTables();
        this.assortUtils =                      new AssortUtils(hashUtil, this.ref.logger);

        const randomAssortCount =   this.randomUtil.randInt(1, 3);
        const randomReqSlipCount =  this.randomUtil.randInt(3, 6);
        const randomLoyaltyLevel =  this.randomUtil.randInt(1, 4);
        var keys =                  Object.keys(customPresetArray);
        const shuffledKeys =        this.utils.shufflePullTwo(keys);

        if (shuffledKeys == "undefined")
        {
            const reshuffledKeys = this.utils.shufflePullTwo(keys);

            try
            {
                this.logger.log(`[${this.logString}] ${customPresetArray[reshuffledKeys]._name} has been added to the Req Shop`, LogTextColor.GREEN);

                this.assortUtils.createComplexAssortItem(customPresetArray[reshuffledKeys]._items)
                                .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                .addStackCount(randomAssortCount)
                                .addLoyaltyLevel(randomLoyaltyLevel)
                                .export(tables.traders[baseJson._id], true);
                                count++
            }
            catch(error)
            {
                return;
            }
        }

        else
        {
            try
            {
                if (debugLogging)
                {
                    this.logger.log(`[${this.logString}] ${customPresetArray[shuffledKeys]._name} has been added to the Req Shop`, LogTextColor.GREEN);
                }

                this.assortUtils.createComplexAssortItem(customPresetArray[shuffledKeys]._items)
                                .addMoneyCost(Currency.ReqSlips, randomReqSlipCount)
                                .addStackCount(randomAssortCount)
                                .addLoyaltyLevel(randomLoyaltyLevel)
                                .export(tables.traders[baseJson._id], true);
                                count++
            }
            catch(error)
            {
                return;
            }
        }                
    }
    //#endregion
    //
    //
    //
    //#region Reputation Change Logic
    static traderRepLogic(info: any, sessionId: string, traderHelper: any): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const logString = "Rep Logic";

        try 
        {
            if (info.exit === "Left")
            {
                return;
            }

            else if (info.exit === "killed") 
            {
                return;
            }

            else if (info.exit === "runner")
            {
                return;
            }

            else if (info.exit === "survived")
            {
                traderHelper.addStandingToTrader(sessionId, "Requisitions", 0.03)
                return;
            }
        }
        catch(error)
        {
            logger.error(`[${logString}] Error modifying Trader Rep on Successful Raid Exfil:` + error);
        }
    }

    static legionRepLogic(info: any, sessionId: string, traderHelper: any): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const logString = "Rep Logic";

        try 
        {
            const pmcData: IPmcData = info.profile;
            const victimRole = pmcData.Stats.Eft.Victims?.map(victim => victim.Role.toLowerCase());

            if (victimRole?.includes("bosslegion"))
            {
                traderHelper.addStandingToTrader(sessionId, "Requisitions", 0.15);
                return;
            }

            else
            {
                return;
            }
        }
        catch(error)
        {
            logger.error(`[${logString}] Error modifying Trader Rep on killing Legion:` + error);
        }
    }
    //#endregion
}