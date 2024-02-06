import { References }                       from "./Refs/References";

import { DependencyContainer }              from "tsyringe";
import { IPreAkiLoadMod }                   from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod }                   from "@spt-aki/models/external/IPostDBLoadMod";
import { ConfigServer }                     from "@spt-aki/servers/ConfigServer";
import { JsonUtil }                         from "@spt-aki/utils/JsonUtil";
import { ImporterUtil }                     from "@spt-aki/utils/ImporterUtil";
import { ITraderAssort, ITraderBase }       from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime }        from "@spt-aki/models/spt/config/ITraderConfig";
import { Traders }                          from "@spt-aki/models/enums/Traders";
import { ConfigTypes }                      from "@spt-aki/models/enums/ConfigTypes";
import { VFS }                              from "@spt-aki/utils/VFS";
import { IDatabaseTables }                  from "@spt-aki/models/spt/server/IDatabaseTables";
import { DatabaseServer }                   from "@spt-aki/servers/DatabaseServer";
import { ILocations }                       from "@spt-aki/models/spt/server/ILocations";
import { IAirdropConfig }                   from "@spt-aki/models/spt/config/IAirdropConfig";
import { LogTextColor }                     from "@spt-aki/models/spt/logging/LogTextColor";
import { BotHelper }                        from "@spt-aki/helpers/BotHelper";

import * as baseJson                        from "../db/base.json";
import * as assortJson                      from "../db/assort.json";
import JSON5                                from "json5";
import * as path                            from "path";

const modName = "Raid Overhaul";

class RaidOverhaul implements IPreAkiLoadMod, IPostDBLoadMod
{
    mod: string;
    private ref: References = new References();
    static container: DependencyContainer;
    modPath: string = path.normalize(path.join(__dirname, ".."));

    constructor() 
    {
        this.mod = "zzRaidOverhaul";
    }
    
    //
    //
    //
    //
    //

    /**
    * @param container container
    */
    public preAkiLoad(container: DependencyContainer): void 
    {
        this.ref.preAkiLoad(container, "RaidOverhaul");
        this.ref.container =        container;
        const vfs =                 container.resolve<VFS>("VFS");
        const modConfig =           JSON5.parse(vfs.readFile(path.resolve(__dirname, "../config/config.json5")));
        const configServer =        container.resolve("ConfigServer");
        const traderConfig:         ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);

        if (modConfig.Trader.Enabled)
        {
            if (modConfig.Trader.AllowRandomization)
            {
                this.ref.onUpdateModService.registerOnUpdate(
                    "MyCustomOnUpdateMod",
                    ( timeSinceLastRun: number ) => this.customFunctionThatRunsOnLoad( timeSinceLastRun ),
                    () => "custom-onupdate-mod"
                );
            }

            this.registerProfileImage();
            this.setupTraderUpdateTime(traderConfig);

            Traders["Requisitions"] = "Requisitions";
        }   
    }

    public customFunctionThatRunsOnLoad ( timeSinceLastRun: number ): boolean
    {
        if ( timeSinceLastRun > 30 * 60 )
        {
            this.modifyReqs();
            return true;
        }

        return false;
    }

    logAllMapAndExtractNames( locations: ILocations ):void
    {
        const extractList = {}
        for (const loc in locations)
        {

            const thisLocExits = locations[loc]?.base?.exits
            if (!thisLocExits) continue

            extractList[loc] = []

            for (const e in thisLocExits)
            {
                const thisExit = thisLocExits[e]
                extractList[loc].push(thisExit.Name)
            }
            
        }
        console.log(extractList)
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
    public postDBLoad(container: DependencyContainer)
    {
        this.ref.postDBLoad(container);
        this.ref.container =    container;
        const databaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const tables =          databaseServer.getTables();
        const configServer =    container.resolve<ConfigServer>("ConfigServer")
        const importerUtil =    container.resolve<ImporterUtil>("ImporterUtil");
        const jsonUtil =        container.resolve<JsonUtil>("JsonUtil");
        const questItems =      configServer.getConfig("aki-lostondeath");
        const ragfair =         configServer.getConfig("aki-ragfair");
        const maps =            configServer.getConfig("aki-location");
        const airdropConfig =   configServer.getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);
        const globals =         this.ref.tables.globals.config;
        const locales =         this.ref.tables.locales.global;
        const items =           this.ref.tables.templates.items;
        const handbook =        this.ref.tables.templates.handbook.Items;
        const stamina =         this.ref.tables.globals.config.Stamina;
        const botTypes =        this.ref.tables.bots.types
        const mastering =       this.ref.tables.globals.config.Mastering
        const traders =         this.ref.tables.traders;
        const modPath =         path.resolve(__dirname.toString()).split(path.sep).join("/")+"/";
        const vfs =             container.resolve<VFS>("VFS");
        const modConfig =       JSON5.parse(vfs.readFile(path.resolve(__dirname, "../config/config.json5")));
        const newItemDB =       importerUtil.loadRecursive(`${modPath}../db/NewItems/`);
        const alteredItemDB =   importerUtil.loadRecursive(`${modPath}../db/AlteredContainers/`);
        const itemPath =        `${modPath}../db/NewItems/templates/items/`;
        const handbookPath =    `${modPath}../db/NewItems/templates/handbook/`;
        const shotgun =         JSON.parse(vfs.readFile(path.resolve(__dirname, "../config/AmmoList/Shotgun.json")));
        const flares =          JSON.parse(vfs.readFile(path.resolve(__dirname, "../config/AmmoList/UBGL.json")));
        const sniper =          JSON.parse(vfs.readFile(path.resolve(__dirname, "../config/AmmoList/Sniper.json")));
        const smg =             JSON.parse(vfs.readFile(path.resolve(__dirname, "../config/AmmoList/SMG.json")));
        const rifle =           JSON.parse(vfs.readFile(path.resolve(__dirname, "../config/AmmoList/Rifle.json")));
        const assort =          JSON.parse(vfs.readFile(path.resolve(__dirname, "../db/assort.json")));

        const messageArray =    ["The hamsters can take a break now", "Time to get wrecked by Birdeye LOL", "Back to looking for cat pics", "I made sure to crank up your heart attack event chances", "If there's a bunch of red text it's 100% not my fault", "We are legion, for we are many", "All Hail the Cult of Cj", "Good luck out there"];
        const randomMessage =   messageArray[Math.floor(Math.random() * messageArray.length)];

        const unbreakWithSVM = [
            {
                "Filter": ["54009119af1c881c07000029"],
                "ExcludedFilter": [""]
            }
        ];

        this.ref.logger.log(`[${modName}] has finished modifying your raids. ${randomMessage}.`, LogTextColor.CYAN)
        
        for (const itemFile in newItemDB.templates.items)
        {
            const item = jsonUtil.deserialize(this.ref.vfs.readFile(`${itemPath}${itemFile}.json`));
            const hb = jsonUtil.deserialize(this.ref.vfs.readFile(`${handbookPath}${itemFile}.json`));

            const itemId = item._id;

            items[itemId] = item;

            handbook.push({
                "Id": itemId,
                "ParentId": hb.ParentId,
                "Price": hb.Price
            });

            if (modConfig.Trader.Enabled)
            {
                if (modConfig.Trader.AllowRandomization)
                {
                    this.modifyReqs();
                }
            }
        }

        for (const localeID in locales)
        {
            for (const id in newItemDB.locales.en.templates)
            {
                const item = newItemDB.locales.en.templates[id];

                for (const locale in item)
                {
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }
                
            }
            for (const id in newItemDB.locales.en.preset)
            {
                const item = newItemDB.locales.en.preset[id];
                for (const locale in item)
                {
                    locales[localeID][`${id}`] = item[locale];
                }
                
            }
        }

        for (const localeID in newItemDB.locales)
        {
            for (const id in newItemDB.locales[localeID].templates)
            {
                const item = newItemDB.locales[localeID].templates[id];

                for (const locale in item)
                {
                    locales[localeID][`${id}`] = item[locale];
                }
                
            }
            for (const id in newItemDB.locales[localeID].preset)
            {
                const item = newItemDB.locales[localeID].preset[id];

                for (const locale in item)
                {
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }               
            }
        }

        for (const weapon in newItemDB.globals.config.Mastering) mastering.push(newItemDB.globals.config.Mastering[weapon]);
        for (const weapon in mastering) 
        {
            if (mastering[weapon].Name == "M4") mastering[weapon].Templates.push("MCM4");
            if (mastering[weapon].Name == "AUG") mastering[weapon].Templates.push("Aug762a");
            if (mastering[weapon].Name == "STM-9") mastering[weapon].Templates.push("STM46");
        }

        if (modConfig.Raid.EnableExtendedRaids)
        {
            for (const location in this.ref.tables.locations)
            {
                if (location == "base") continue;
                this.ref.tables.locations[location].base.EscapeTimeLimit = modConfig.Raid.TimeLimit * 60;
                this.ref.tables.locations[location].base.EscapeTimeLimitCoop = modConfig.Raid.TimeLimit * 60;
            }
        }
        
        if (modConfig.Raid.ReduceFoodAndHydroDegrade.Enabled)
        {
            globals.Health.Effects.Existence.EnergyDamage = modConfig.Raid.ReduceFoodAndHydroDegrade.EnergyDecay;
            globals.Health.Effects.Existence.HydrationDamage = modConfig.Raid.ReduceFoodAndHydroDegrade.HydroDecay;
        }

        if (modConfig.Raid.ChangeAirdropValues.Enabled)
        {
            airdropConfig.airdropChancePercent.bigmap = modConfig.Raid.ChangeAirdropValues.Customs;
            airdropConfig.airdropChancePercent.woods = modConfig.Raid.ChangeAirdropValues.Woods;
            airdropConfig.airdropChancePercent.lighthouse = modConfig.Raid.ChangeAirdropValues.Lighthouse;
            airdropConfig.airdropChancePercent.shoreline = modConfig.Raid.ChangeAirdropValues.Interchange;
            airdropConfig.airdropChancePercent.interchange = modConfig.Raid.ChangeAirdropValues.Shoreline;
            airdropConfig.airdropChancePercent.reserve = modConfig.Raid.ChangeAirdropValues.Reserve;
        }
        
        if (modConfig.Weight.Enabled) 
        {
            stamina.BaseOverweightLimits["x"] = modConfig.Weight.MinWeight
            stamina.BaseOverweightLimits["y"] = modConfig.Weight.MaxWeight
            stamina.WalkOverweightLimits["x"] = modConfig.Weight.WalkMinWeight
            stamina.WalkOverweightLimits["y"] = modConfig.Weight.WalkMaxWeight
            stamina.WalkSpeedOverweightLimits["x"] = modConfig.Weight.WalkSpeedMinWeight
            stamina.WalkSpeedOverweightLimits["y"] = modConfig.Weight.WalkSpeedMaxWeight
            stamina.SprintOverweightLimits["x"] = modConfig.Weight.SprintMinWeight
            stamina.SprintOverweightLimits["y"] = modConfig.Weight.SprintMaxWeight
        }
        
        for (const itemID in items)
        {
            const item = items[itemID];
            if (item._props.BlocksFolding)
                item._props.BlocksFolding = false
        }
    
        for (const itemID in items)
        {
            const item = items[itemID];
            if (item._props.Foldable)
                item._props.Foldable = true
        }

        if (modConfig.EnableSVMFix === false)
        {
            this.ref.tables.templates.items["590c60fc86f77412b13fddcf"]._props.Grids[0]._props.filters[0].Filter.push("RequisitionSlips");
            this.ref.tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter.push("RequisitionSlips");
        }


        if (modConfig.Raid.SaveQuestItems)
        {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            questItems.questItems === false;
        }
        
        if (modConfig.Raid.NoRunThrough)
        {
            globals.exp.match_end.survived_exp_requirement = 0;
            globals.exp.match_end.survived_seconds_requirement = 0;
        }
        
        for (const id in items)
        {
            const base = items[id]

            if (base._parent === "5447e1d04bdc2dff2f8b4567" && modConfig.Raid.LootableMelee)
            {
                items[id]._props.Unlootable = false
                items[id]._props.UnlootableFromSide = [];
            }
        }

        for (const id in items)
        {
            const base = items[id]

            if (base._parent === "5b3f15d486f77432d0509248" && modConfig.Raid.LootableArmbands)
            {
                items[id]._props.Unlootable = false
                items[id]._props.UnlootableFromSide = [];
            }
        }

        if (modConfig.Raid.ReqSlipsOnBosses === true)
        {
            for (const eachBot in botTypes)
            {
                const type = this.findBotType(eachBot)
        
                if (type !== "Ignore")
                {
                    botTypes[eachBot].inventory.items.TacticalVest.push("RequisitionSlips");
                    botTypes[eachBot].inventory.items.Pockets.push("RequisitionSlips");
                }
            }
        }

        if (modConfig.Raid.ReqSlipsOnBosses === false)
        {
            for (const bot in botTypes)
            {
                for (const lootslot in this.ref.tables.bots.types[bot].inventory.items)
                {
                    if (this.ref.tables.bots.types[bot].inventory.items[lootslot].includes("5c0e531d86f7747fa23f4d42" || "5ed5166ad380ab312177c100" || "5783c43d2459774bbe137486"))
                    {
                        botTypes[bot].inventory.items.TacticalVest.push("RequisitionSlips");
                        botTypes[bot].inventory.items.Pockets.push("RequisitionSlips");
                    }
                }
            }
        }

        if (modConfig.Raid.ContainerChanges) 
        {
            this.ref.tables.templates.items["5732ee6a24597719ae0c0281"] = alteredItemDB.SecureContainers.WaistPouch["5732ee6a24597719ae0c0281"];
            this.ref.tables.templates.items["544a11ac4bdc2d470e8b456a"] = alteredItemDB.SecureContainers.Alpha["544a11ac4bdc2d470e8b456a"];
            this.ref.tables.templates.items["5857a8b324597729ab0a0e7d"] = alteredItemDB.SecureContainers.Beta["5857a8b324597729ab0a0e7d"];
            this.ref.tables.templates.items["5857a8bc2459772bad15db29"] = alteredItemDB.SecureContainers.Gamma["5857a8bc2459772bad15db29"];
            this.ref.tables.templates.items["59db794186f77448bc595262"] = alteredItemDB.SecureContainers.Epsilon["59db794186f77448bc595262"];
            this.ref.tables.templates.items["5c093ca986f7740a1867ab12"] = alteredItemDB.SecureContainers.Kappa["5c093ca986f7740a1867ab12"];

            for (const container in this.ref.tables.templates.items) 
            {
                if (this.ref.tables.templates.items[container]._parent === "5448bf274bdc2dfc2f8b456a") 
                {
                    if (!this.ref.tables.templates.items[container]._props.Grids[0]._props.filters) 
                    {
                        this.ref.tables.templates.items[container]._props.Grids[0]._props.filters = unbreakWithSVM;
                    }
                }
            }
        }

        if (modConfig.Raid.PocketChanges) 
        {
            this.ref.tables.templates.items["627a4e6b255f7527fb05a0f6"] = alteredItemDB.Pockets.Pockets["627a4e6b255f7527fb05a0f6"];

            for (const pockets in this.ref.tables.templates.items) 
            {
                if (this.ref.tables.templates.items[pockets]._parent === "557596e64bdc2dc2118b4571") 
                {
                    if (!this.ref.tables.templates.items[pockets]._props.Grids[0]._props.filters) 
                    {
                        this.ref.tables.templates.items[pockets]._props.Grids[0]._props.filters = unbreakWithSVM;
                    }
                }
            }
        }

        if (modConfig.Trader.Enabled)
        {
            this.addTraderToDb(baseJson, tables, jsonUtil);
            this.addTraderToLocales(tables, baseJson.name, "Requisitions Office", baseJson.nickname, baseJson.location, "A collection of Ex-PMC's and rogue Scavs who formed a group to aid others in Tarkov. They routinely scour the battlefield for any leftover supplies and aren't afraid to fight their old comrades for it. They may not be the most trustworthy but they do have some much needed provisions in stock.");
    
            ragfair.traders[baseJson._id] = true;
        }
        
        if (modConfig.Insurance.Enabled) 
        {
            traders["54cb50c76803fa8b248b4571"].base.insurance.min_return_hour = modConfig.Insurance.PraporMinReturn;
            traders["54cb50c76803fa8b248b4571"].base.insurance.max_return_hour = modConfig.Insurance.PraporMaxReturn;
            traders["54cb57776803fa99248b456e"].base.insurance.min_return_hour = modConfig.Insurance.TherapistMinReturn;
            traders["54cb57776803fa99248b456e"].base.insurance.max_return_hour = modConfig.Insurance.TherapistMaxReturn;
        }

        if (modConfig.Trader.Enabled)
        {
            for (const item in assort.loyal_level_items)
            {
                if (modConfig.Trader.LL1Items)
                {
                    tables.traders["Requisitions"].assort.loyal_level_items[item] = 1;
                }

                else
                {
                    tables.traders["Requisitions"].assort.loyal_level_items[item] = assort.loyal_level_items[item];
                }
            }
        }

        if (modConfig.AdvancedStackTuning.Enabled && !modConfig.BasicStackTuning.Enabled)
        {
            for (const id of shotgun)
            {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.ShotgunStack
            }

            for (const id of flares)
            {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.FlaresAndUBGL
            }

            for (const id of sniper)
            {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.SniperStack
            }

            for (const id of smg)
            {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.SMGStack
            }

            for (const id of rifle)
            {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.RifleStack
            }
        }

        if (modConfig.BasicStackTuning.Enabled && !modConfig.AdvancedStackTuning.Enabled)
        {
            for (const id in items)
            {
                if (items[id]._parent === "5485a8684bdc2da71d8b4567" && items[id]._props.StackMaxSize !== undefined)
                {
                    items[id]._props.StackMaxSize *= modConfig.BasicStackTuning.StackMultiplier
                }
            }
        }

        if (modConfig.BasicStackTuning.Enabled && modConfig.AdvancedStackTuning.Enabled)
        {
            this.ref.logger.log(`[${modName}] Error multiplying your ammo stacks. Make sure you only have ONE of the Stack Tuning options enabled`, LogTextColor.RED)
        }

        if (modConfig.MoneyStackMultiplier.Enabled)
        {
            for (const id in items)
            {
                if (items[id]._parent === "543be5dd4bdc2deb348b4569"  && items[id]._props.StackMaxSize !== undefined)
                {
                    items[id]._props.StackMaxSize = modConfig.MoneyStackMultiplier.MoneyMultiplier
                }
            }
        }

        if (modConfig.Raid.HolsterAnything)
        {
            const inventory = items["55d7217a4bdc2d86028b456d"]
            const holster = inventory._props.Slots[2]
    
            holster._props.filters[0].Filter.push("5422acb9af1c889c16000029");
        }

        if (modConfig.Raid.LowerExamineTime)
        {
            for (const id in items)
            {
                items[id]._props.ExamineTime = 0.1
            }
        }

        if (modConfig.Trader.DisableFleaBlacklist)
        {
            ragfair.dynamic.blacklist.enableBsgList = false;
        }

        if (modConfig.Loot.EnableLootOptions)
        {
            maps.looseLootMultiplier.bigmap = modConfig.Loot.Locations.Customs;
            maps.looseLootMultiplier.factory4_day = modConfig.Loot.Locations.FactoryDay;
            maps.looseLootMultiplier.factory4_night = modConfig.Loot.Locations.FactoryNight;
            maps.looseLootMultiplier.interchange = modConfig.Loot.Locations.Interchange;
            maps.looseLootMultiplier.laboratory = modConfig.Loot.Locations.Labs;
            maps.looseLootMultiplier.rezervbase = modConfig.Loot.Locations.Reserve;
            maps.looseLootMultiplier.shoreline = modConfig.Loot.Locations.Shoreline;
            maps.looseLootMultiplier.woods = modConfig.Loot.Locations.Woods;
            maps.looseLootMultiplier.lighthouse = modConfig.Loot.Locations.Lighthouse;
            maps.looseLootMultiplier.tarkovstreets = modConfig.Loot.Locations.Streets;

            maps.staticLootMultiplier.bigmap = modConfig.Loot.Locations.Customs;
            maps.staticLootMultiplier.factory4_day = modConfig.Loot.Locations.FactoryDay;
            maps.staticLootMultiplier.factory4_night = modConfig.Loot.Locations.FactoryNight;
            maps.staticLootMultiplier.interchange = modConfig.Loot.Locations.Interchange;
            maps.staticLootMultiplier.laboratory = modConfig.Loot.Locations.Labs;
            maps.staticLootMultiplier.rezervbase = modConfig.Loot.Locations.Reserve;
            maps.staticLootMultiplier.shoreline = modConfig.Loot.Locations.Shoreline;
            maps.staticLootMultiplier.woods = modConfig.Loot.Locations.Woods;
            maps.staticLootMultiplier.lighthouse = modConfig.Loot.Locations.Lighthouse;
            maps.staticLootMultiplier.tarkovstreets = modConfig.Loot.Locations.Streets;
        }
    }
    
    /**
     * @param preAkiModLoader
     * @param imageRouter
     */
    private registerProfileImage(): void
    {
        const imageFilepath = `./${this.ref.preAkiModLoader.getModPath(this.mod)}res`;

        this.ref.imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Reqs.jpg`);
    }

    /**
     * @param traderConfig
     */
    private setupTraderUpdateTime(traderConfig: ITraderConfig): void
    {
        const traderRefreshRecord: UpdateTime = { traderId: baseJson._id, seconds: 3600 }
        traderConfig.updateTime.push(traderRefreshRecord);
    }

    /**
     * @param traderDetailsToAdd
     * @param tables
     * @param jsonUtil
     */
    
    // rome-ignore lint/suspicious/noExplicitAny: traderDetailsToAdd comes from base.json, so no type
    private  addTraderToDb(traderDetailsToAdd: any, tables: IDatabaseTables, jsonUtil: JsonUtil): void
    {
        tables.traders[traderDetailsToAdd._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)) as ITraderAssort,
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)) as ITraderBase,
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
    private addTraderToLocales(tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string)
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

    private modifyReqs (): void
    {
        const vfs =         this.ref.container.resolve<VFS>("VFS");
        const modConfig =   JSON5.parse(vfs.readFile(path.resolve(__dirname, "../config/config.json5")));

        for ( const item of assortJson.items )
        {
            if ( item.parentId != "hideout" )
            {
                continue;
            }

            let count = 0;

            {
                count = this.randomCount( modConfig.Trader.RandomizationRange, modConfig.Trader.RandomizationRange )
            }

            if ( count < 0 )
            {
                count = 0;
            }

            item.upd.StackObjectsCount = count;

            if ( item.upd.UnlimitedCount )
            {
                item.upd.UnlimitedCount = false;
            }
        }
    }

    private randomCount ( base: number, random: number ): number
    {
        return ( base + Math.floor( Math.random() * random * 2 ) - random )
    }

    private findBotType(input :string):string
    {

        const botHelper = this.ref.container.resolve<BotHelper>("BotHelper")
  
        switch (input) 
        {
            case "usec":
            case "bear":
                return "PMC"
        
            case "assault":
            case "marksman":
                return "Scav"
  
            case "bossboarsniper":
            case "sectantwarrior":
                return "Follower"
  
            case "pmcbot":
                return "Raider"
  
            case "exusec":
                return "Rogue"
  
            case "sectantpriest":
                return "Boss"
        
            default:
                if (botHelper.isBotFollower(input)) return "Follower"
                if (botHelper.isBotBoss(input)) return "Boss"
                return "Ignore"
        }
    }
}

module.exports = { mod: new RaidOverhaul() };