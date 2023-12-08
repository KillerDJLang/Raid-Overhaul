import { DependencyContainer }          from "tsyringe";

import { IPreAkiLoadMod }               from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod }               from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger }                      from "@spt-aki/models/spt/utils/ILogger";
import { StaticRouterModService }       from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { ProfileHelper }                from "@spt-aki/helpers/ProfileHelper";
import { DatabaseServer }               from "@spt-aki/servers/DatabaseServer";
import { IPmcData }                     from "@spt-aki/models/eft/common/IPmcData"
import { IDatabaseTables }              from "@spt-aki/models/spt/server/IDatabaseTables";
import { IAirdropConfig }               from "@spt-aki/models/spt/config/IAirdropConfig";
import { ConfigServer }                 from "@spt-aki/servers/ConfigServer";
import { ConfigTypes }                  from "@spt-aki/models/enums/ConfigTypes";
import { ILocations }                   from "@spt-aki/models/spt/server/ILocations";
import { JsonUtil }                     from "@spt-aki/utils/JsonUtil";
import { VFS }                          from "@spt-aki/utils/VFS";
import { ImporterUtil }                 from "@spt-aki/utils/ImporterUtil";
import {jsonc}                          from "jsonc";
import * as path                        from "path";

const modName = "DJsRaidOverhaul";

class RaidOverhaul implements IPreAkiLoadMod, IPostDBLoadMod
{
    private container: DependencyContainer
    private static container: DependencyContainer;
    modPath: string = path.normalize(path.join(__dirname, ".."));
    
     //
     //
     //
     //
     //

    /**
    * Loops through bots and sends each to be set to the corresponding config option
    * @param container container
    */
    public preAkiLoad(container: DependencyContainer): void 
    {
        RaidOverhaul.container = container;
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");

        //
        // LootContainer API
        // replace the function
		container.afterResolution("InventoryCallbacks", (_t, result) => {
            result.openRandomLootContainer = (pmcData, body, sessionID) => {
                return RaidOverhaul.customOpenRandomLootContainer(pmcData, body, sessionID)
            }
            }, {frequency: "Always"});

            const configServer = container.resolve("ConfigServer");
            const inventoryConfig = configServer.getConfig("aki-inventory");
            const SecLB = require("../db/items/DJsSecureLunchbox.json");
            const SmolLB = require("../db/items/DJsSmallLunchbox.json");
            const AmmoLB = require("../db/items/DJsAmmoCrate.json");
            const MedsLB = require("../db/items/DJsSurgicalSet.json");

        inventoryConfig.randomLootContainers["DJsSecureLunchbox"] = SecLB.randomLootContainers["DJsSecureLunchbox"];
        inventoryConfig.randomLootContainers["DJsSmallLunchbox"] = SmolLB.randomLootContainers["DJsSmallLunchbox"];
        inventoryConfig.randomLootContainers["DJsAmmoCrate"] = AmmoLB.randomLootContainers["DJsAmmoCrate"];
        inventoryConfig.randomLootContainers["DJsSurgicalSet"] = MedsLB.randomLootContainers["DJsSurgicalSet"];
        //
        //LootContainerAPI
        //

        staticRouterModService.registerStaticRouter
        (
            "inventoryupdaterouter",
            [
                {
                    url: "/ir/profile/update",
                    action: (url, info: IUpdateProfileRequest, sessionID, output) =>
                    {
                        const profile = profileHelper.getPmcProfile(sessionID);
                        const hideout = info.player.Inventory.items;

                        profile.Inventory.items = hideout;
                        logger.info(`[IR] Imported extracted items to inventory (${profile._id})`);
                    }
                }
            ],
            "ir-update-profile-route"
        );
    }

    logAllMapAndExtractNames(dbLocations:ILocations):void{
        const extractList = {}
        for (const loc in dbLocations){

            const thisLocExits = dbLocations[loc]?.base?.exits
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
    * @param container Dependency container
    */
    public postDBLoad(container: DependencyContainer)
    {
        const database =            container.resolve<DatabaseServer>("DatabaseServer").getTables() as IDatabaseTables;
        const globals =             database.globals.config;
        this.container =            container
        const logger =              this.container.resolve<ILogger>("WinstonLogger")
        const configServer =        container.resolve<ConfigServer>("ConfigServer")
        const AirdropConfig =       configServer.getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);
        const db =                  container.resolve<DatabaseServer>("DatabaseServer").getTables();
        const ImporterUtil =        container.resolve<ImporterUtil>("ImporterUtil");
        const JsonUtil =            container.resolve<JsonUtil>("JsonUtil");
        const VFS =                 container.resolve<VFS>("VFS");
        const locales =             db.locales.global;
        const items =               db.templates.items;
        const handbook =            db.templates.handbook.Items;
        const modPath =             path.resolve(__dirname.toString()).split(path.sep).join("/")+"/";
        const databaseServer =      container.resolve<DatabaseServer>("DatabaseServer");
        const tables =              databaseServer.getTables();
        const QIconfigServer =      container.resolve("ConfigServer");
        const QuestItems =          QIconfigServer.getConfig("aki-lostondeath");
        const modConfig =           jsonc.parse(VFS.readFile(path.resolve(__dirname, "../config/config.jsonc")));

        
        const botTypes = [
            "usec",
            "bear",
            "exusec",
            "followerbully",
            "pmcbot",
            "followersanitar",
            "followertagilla",
            "followergluharassault",
            "followergluharsecurity",
            "followergluharscout",
            "followergluharsnipe",
            "followerkojaniy",
            "assault"
        ];

        const mydb = ImporterUtil.loadRecursive(`${modPath}../db/`);


        const itemPath = `${modPath}../db/templates/items/`;
        const handbookPath = `${modPath}../db/templates/handbook/`;
        
        for(const itemFile in mydb.templates.items) {
            const item = JsonUtil.deserialize(VFS.readFile(`${itemPath}${itemFile}.json`));
            const hb = JsonUtil.deserialize(VFS.readFile(`${handbookPath}${itemFile}.json`));

            const itemId = item._id;
            //logger.info(itemId);

            items[itemId] = item;
            //logger.info(hb.ParentId);
            //logger.info(hb.Price);
            handbook.push({
                "Id": itemId,
                "ParentId": hb.ParentId,
                "Price": hb.Price
            });

            for (const bot in tables.bots.types) {
                for (const lootSlot in tables.bots.types[bot].inventory.items) {
                    if (botTypes.includes(bot)) {
                        if (tables.bots.types[bot].inventory.items[lootSlot].includes("5783c43d2459774bbe137486")) {
                                tables.bots.types[bot].inventory.items.Backpack.push(itemId);
                                tables.bots.types[bot].inventory.items.TacticalVest.push(itemId);
                        }
                    }
                }
            }
        }
        //logger.info("Test");
        // default localization
        for (const localeID in locales)
        {
            for (const id in mydb.locales.en.templates) {
                const item = mydb.locales.en.templates[id];
                //logger.info(item);
                for(const locale in item) {
                    //logger.info(locale);
                    //logger.info(item[locale]);
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }
                
            }
            for (const id in mydb.locales.en.preset) {
                const item = mydb.locales.en.preset[id];
                for(const locale in item) {
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id}`] = item[locale];
                }
                
            }
        }
        for (const localeID in mydb.locales)
        {
            for (const id in mydb.locales[localeID].templates) {
                const item = mydb.locales[localeID].templates[id];
                //logger.info(item);
                for(const locale in item) {
                    locales[localeID][`${id}`] = item[locale];
                }
                
            }
            for (const id in mydb.locales[localeID].preset) {
                const item = mydb.locales[localeID].preset[id];
                for(const locale in item) {
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }               
            }
        }

        for (let location in database.locations)
        {
            if (location == "base") continue;
            database.locations[location].base.EscapeTimeLimit = 9999999;
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

        for (const item in database.templates.items) {
			if (database.templates.items[item]._parent === "5448bf274bdc2dfc2f8b456a") {
				if (database.templates.items[item]._props.Grids[0]._props.filters[0]) {
					database.templates.items[item]._props.Grids[0]._props.filters[0].Filter.push(...["DJsSecureLunchbox", "DJsSmallLunchbox", "DJsAmmoCrate", "DJsSurgicalSet"]);
				}
			}
		}
		database.templates.items["5c093db286f7740a1b2617e3"]._props.Grids[0]._props.filters[0].Filter.push(...["DJsSecureLunchbox", "DJsSmallLunchbox", "DJsAmmoCrate", "DJsSurgicalSet"]);


        if(modConfig.Raid.SaveQuestItems)
        {
            QuestItems.questItems = false;
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
        logger.log("Finished Overhauling your raids. Watch your back out there.", "magenta") 
    }
    
    //
    //LootContainerAPI
    //

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
		
		let foundInRaid = false;
		

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
}


interface IUpdateProfileRequest
{
    player: IPmcData;
}

module.exports = { mod: new RaidOverhaul() };
