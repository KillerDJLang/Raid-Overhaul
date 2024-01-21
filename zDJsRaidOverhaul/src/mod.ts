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

import * as baseJson                        from "../db/base.json";
import * as assortJson                      from "../db/assort.json";
import {jsonc}                              from "jsonc";
import * as path                            from "path";

class RaidOverhaul implements IPreAkiLoadMod, IPostDBLoadMod
{
    mod: string;
    private Ref: References = new References();
    private static container: DependencyContainer;
    modPath: string = path.normalize(path.join(__dirname, ".."));

    static filterIndex = [{
        tpl:"",
        entries:[""]
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
    public preAkiLoad(container: DependencyContainer): void 
    {
        this.Ref.preAkiLoad(container, "RaidOverhaul");
        this.Ref.container =    container;
        const vfs =             container.resolve<VFS>("VFS");
        const modConfig =       jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));
        const configServer =    container.resolve("ConfigServer");
        const inventoryConfig = configServer.getConfig("aki-inventory");
        const traderConfig:     ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);

        const SecLB =           require("../db/items/DJsSecureLunchbox.json");
        const SmolLB =          require("../db/items/DJsSmallLunchbox.json");
        const AmmoLB =          require("../db/items/DJsAmmoCrate.json");
        const MedsLB =          require("../db/items/DJsSurgicalSet.json");
        const WeaponLB =        require("../db/items/DJsWeaponCrate.json");
        const ModLB =           require("../db/items/DJsModBox.json");
        const BarterLB =        require("../db/items/DJsBarterCrate.json");

		container.afterResolution("InventoryCallbacks", (_t, result) => {
            result.openRandomLootContainer = (pmcData, body, sessionID) => {
                return RaidOverhaul.customOpenRandomLootContainer(pmcData, body, sessionID)
            }
        }, {frequency: "Always"});

        inventoryConfig.randomLootContainers["DJsSecureLunchbox"] = SecLB.randomLootContainers["DJsSecureLunchbox"];
        inventoryConfig.randomLootContainers["DJsSmallLunchbox"] = SmolLB.randomLootContainers["DJsSmallLunchbox"];
        inventoryConfig.randomLootContainers["DJsAmmoCrate"] = AmmoLB.randomLootContainers["DJsAmmoCrate"];
        inventoryConfig.randomLootContainers["DJsSurgicalSet"] = MedsLB.randomLootContainers["DJsSurgicalSet"];
        inventoryConfig.randomLootContainers["DJsWeaponCrate"] = WeaponLB.randomLootContainers["DJsWeaponCrate"];
        inventoryConfig.randomLootContainers["DJsModBox"] = ModLB.randomLootContainers["DJsModBox"];
        inventoryConfig.randomLootContainers["DJsBarterCrate"] = BarterLB.randomLootContainers["DJsBarterCrate"];

        if (modConfig.Trader.Enabled)
        {
            if (modConfig.Trader.AllowRandomization)
            {
                this.Ref.onUpdateModService.registerOnUpdate(
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

    logAllMapAndExtractNames( locations: ILocations ):void{
        const extractList = {}
        for (const loc in locations){

            const thisLocExits = locations[loc]?.base?.exits
            if (!thisLocExits) continue

            extractList[loc] = []

            for (const e in thisLocExits){
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
        this.Ref.postDBLoad(container);
        this.Ref.container =    container
        const databaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const tables =          databaseServer.getTables();
        const configServer =    container.resolve<ConfigServer>("ConfigServer")
        const ImporterUtil =    container.resolve<ImporterUtil>("ImporterUtil");
        const JsonUtil =        container.resolve<JsonUtil>("JsonUtil");
        const QuestItems =      configServer.getConfig("aki-lostondeath");
        const Ragfair =         configServer.getConfig("aki-ragfair");
        const AirdropConfig =   configServer.getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);
        const globals =         this.Ref.tables.globals.config;
        const locales =         this.Ref.tables.locales.global;
        const items =           this.Ref.tables.templates.items;
        const handbook =        this.Ref.tables.templates.handbook.Items;
        const stamina =         this.Ref.tables.globals.config.Stamina;
        const botTypes =        this.Ref.tables.bots.types
        const Mastering =       this.Ref.tables.globals.config.Mastering
        const modPath =         path.resolve(__dirname.toString()).split(path.sep).join("/")+"/";
        const vfs =             container.resolve<VFS>("VFS");
        const modConfig =       jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));
        const mydb =            ImporterUtil.loadRecursive(`${modPath}../db/`);
        const itemPath =        `${modPath}../db/templates/items/`;
        const handbookPath =    `${modPath}../db/templates/handbook/`;

        this.Ref.logger.log("Overhauling your raids. Watch your back out there.", "magenta")
        
        for(const itemFile in mydb.templates.items)
        {
            const item = JsonUtil.deserialize(this.Ref.vfs.readFile(`${itemPath}${itemFile}.json`));
            const hb = JsonUtil.deserialize(this.Ref.vfs.readFile(`${handbookPath}${itemFile}.json`));

            const itemId = item._id;

            items[itemId] = item;

            handbook.push({
                "Id": itemId,
                "ParentId": hb.ParentId,
                "Price": hb.Price
            });

            if (modConfig.Trader.AllowRandomization)
            {
                this.modifyReqs();
            }
        }

        for (const localeID in locales)
        {
            for (const id in mydb.locales.en.templates) {
                const item = mydb.locales.en.templates[id];

                for(const locale in item) {
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }
                
            }
            for (const id in mydb.locales.en.preset) {
                const item = mydb.locales.en.preset[id];
                for(const locale in item) {
                    locales[localeID][`${id}`] = item[locale];
                }
                
            }
        }

        for (const localeID in mydb.locales)
        {
            for (const id in mydb.locales[localeID].templates) {
                const item = mydb.locales[localeID].templates[id];

                for(const locale in item) {
                    locales[localeID][`${id}`] = item[locale];
                }
                
            }
            for (const id in mydb.locales[localeID].preset) {
                const item = mydb.locales[localeID].preset[id];

                for(const locale in item) {
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }               
            }
        }

        for (const weapon in mydb.globals.config.Mastering) Mastering.push(mydb.globals.config.Mastering[weapon]);
        for (const weapon in Mastering) 
        {
            if (Mastering[weapon].Name == "M4") Mastering[weapon].Templates.push("MCM4", "Aug762a", "STM46");
        }

        if (modConfig.Raid.EnableExtendedRaids)
        {
            for (let location in this.Ref.tables.locations)
            {
                if (location == "base") continue;
                this.Ref.tables.locations[location].base.EscapeTimeLimit = modConfig.Raid.TimeLimit * 60;
                this.Ref.tables.locations[location].base.EscapeTimeLimitCoop = modConfig.Raid.TimeLimit * 60;
            }
        }
        
        if (modConfig.Raid.ReduceFoodAndHydroDegrade.Enabled) {
          globals.Health.Effects.Existence.EnergyDamage = modConfig.Raid.ReduceFoodAndHydroDegrade.EnergyDecay;
          globals.Health.Effects.Existence.HydrationDamage = modConfig.Raid.ReduceFoodAndHydroDegrade.HydroDecay;
        }

        if (modConfig.Raid.ChangeAirdropValues.Enabled){
          AirdropConfig.airdropChancePercent.bigmap = modConfig.Raid.ChangeAirdropValues.Customs;
          AirdropConfig.airdropChancePercent.woods = modConfig.Raid.ChangeAirdropValues.Woods;
          AirdropConfig.airdropChancePercent.lighthouse = modConfig.Raid.ChangeAirdropValues.Lighthouse;
          AirdropConfig.airdropChancePercent.shoreline = modConfig.Raid.ChangeAirdropValues.Interchange;
          AirdropConfig.airdropChancePercent.interchange = modConfig.Raid.ChangeAirdropValues.Shoreline;
          AirdropConfig.airdropChancePercent.reserve = modConfig.Raid.ChangeAirdropValues.Reserve;
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
            let item = items[itemID];
            if (item._props.BlocksFolding)
                item._props.BlocksFolding = false
        }
    
        for (const itemID in items)
        {
            let item = items[itemID];
            if (item._props.Foldable)
                item._props.Foldable = true
        }

        for (const item in this.Ref.tables.templates.items) {
			if (this.Ref.tables.templates.items[item]._parent === "5448bf274bdc2dfc2f8b456a") {
				if (this.Ref.tables.templates.items[item]._props.Grids[0]._props.filters[0]) {
					this.Ref.tables.templates.items[item]._props.Grids[0]._props.filters[0].Filter.push(...["DJsSecureLunchbox", "DJsSmallLunchbox", "DJsAmmoCrate", "DJsSurgicalSet", "DJsWeaponCrate", "RequisitionSlips", "DJsModBox", "DJsBarterCrate"]);
				}
			}
		}
		this.Ref.tables.templates.items["5c093db286f7740a1b2617e3"]._props.Grids[0]._props.filters[0].Filter.push(...["DJsSecureLunchbox", "DJsSmallLunchbox"]);


        if(modConfig.Raid.SaveQuestItems)
        {
            QuestItems.questItems === false;
        }
        
        if (modConfig.Raid.NoRunThrough)
        {
            globals.exp.match_end.survived_exp_requirement = 0;
            globals.exp.match_end.survived_seconds_requirement = 0;
        }
        
        for (const id in items)
        {
            let base = items[id]

            if (base._parent === "5447e1d04bdc2dff2f8b4567" && modConfig.Raid.LootableMelee)
            {
                items[id]._props.Unlootable = false
                items[id]._props.UnlootableFromSide = [];
            }
        }

        for (const id in items)
        {
            let base = items[id]

            if (base._parent === "5b3f15d486f77432d0509248" && modConfig.Raid.LootableArmbands)
            {
                items[id]._props.Unlootable = false
                items[id]._props.UnlootableFromSide = [];
            }
        }

        for (const bot in botTypes) {
            for (const lootSlot in botTypes[bot].inventory.items) {
                botTypes[bot].inventory.items.Backpack.push("RequisitionSlips");
                botTypes[bot].inventory.items.Pockets.push("RequisitionSlips");
                botTypes[bot].inventory.items.TacticalVest.push("RequisitionSlips");
            }
        }

        if (modConfig.Raid.ContainerChanges) {
        this.Ref.tables.templates.items["5732ee6a24597719ae0c0281"] = mydb.SecureContainers.WaistPouch["5732ee6a24597719ae0c0281"];
        this.Ref.tables.templates.items["544a11ac4bdc2d470e8b456a"] = mydb.SecureContainers.Alpha["544a11ac4bdc2d470e8b456a"];
        this.Ref.tables.templates.items["5857a8b324597729ab0a0e7d"] = mydb.SecureContainers.Beta["5857a8b324597729ab0a0e7d"];
        this.Ref.tables.templates.items["5857a8bc2459772bad15db29"] = mydb.SecureContainers.Gamma["5857a8bc2459772bad15db29"];
        this.Ref.tables.templates.items["59db794186f77448bc595262"] = mydb.SecureContainers.Epsilon["59db794186f77448bc595262"];
        this.Ref.tables.templates.items["5c093ca986f7740a1867ab12"] = mydb.SecureContainers.Kappa["5c093ca986f7740a1867ab12"];
        }

        if (modConfig.Raid.PocketChanges) {
            this.Ref.tables.templates.items["627a4e6b255f7527fb05a0f6"] = mydb.Pockets.Pockets["627a4e6b255f7527fb05a0f6"];
        }

        if (modConfig.Trader.Enabled)
        {
            this.addTraderToDb(baseJson, tables, JsonUtil);
            this.addTraderToLocales(tables, baseJson.name, "Requisitions Office", baseJson.nickname, baseJson.location, "A collection of Ex-PMC's and rogue Scavs who formed a group to aid others in Tarkov. They routinely scour the battlefield for any leftover supplies and aren't afraid to fight their old comrades for it. They may not be the most trustworthy but they do have some much needed provisions in stock.");
    
            Ragfair.traders[baseJson._id] = true;
        }
        
        Ragfair.dynamic.blacklist.custom.push(...["DJsSecureLunchbox", "DJsSmallLunchbox", "DJsAmmoCrate", "DJsSurgicalSet", "DJsWeaponCrate", "DJsModBox", "DJsBarterCrate"])

        items["590c60fc86f77412b13fddcf"]._props.Grids[0]._props.filters[0].Filter.push("RequisitionSlips");
        items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter.push("RequisitionSlips");
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
		} else {
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

							} else {
								newItemRequest.items.push({item_id: chosenRewardItemTpl, count: 1, isPreset: false});
							}
						}
					}
				}
				
				if (openedItem.upd) {
					if (openedItem.upd.SpawnedInSession === true) {
						foundInRaid = true;
					}
				}
				
			} else {

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
    private registerProfileImage(): void
    {
        const imageFilepath = `./${this.Ref.preAkiModLoader.getModPath(this.mod)}res`;

        this.Ref.imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Reqs.jpg`);
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
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }

    private modifyReqs (): void
	{
        const vfs =         this.Ref.container.resolve<VFS>("VFS");
        const modConfig =   jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));

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
}

module.exports = { mod: new RaidOverhaul() };
