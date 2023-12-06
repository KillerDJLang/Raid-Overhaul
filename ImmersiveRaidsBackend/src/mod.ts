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
import * as path                        from "path";
import * as modConfig                   from "../config/config.json";
import { ConfigTypes }                  from "@spt-aki/models/enums/ConfigTypes";
import { ILocations }                   from "@spt-aki/models/spt/server/ILocations";

const modName = "DJsRaidOverhaul";

class RaidOverhaul implements IPreAkiLoadMod, IPostDBLoadMod
{
    private container: DependencyContainer
    private logger :ILogger

    modPath:              string = path.normalize(path.join(__dirname, ".."));
    private static container: DependencyContainer;

     //
     //
     //
     //
     //
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
        this.container = container    
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");

        //
        // LootContainer API
        // replace the function
		container.afterResolution("InventoryCallbacks", (_t, result) => {
		result.openRandomLootContainer = (pmcData, body, sessionID) => {
			return RaidOverhaul.customOpenRandomLootContainer(pmcData, body, sessionID)
		}
		}, {frequency: "Always"});

        // constants
		const configServer = container.resolve("ConfigServer");
		const inventoryConfig = configServer.getConfig("aki-inventory");
		const modDb = require("../db/items/itemData.json");
		
		// add iskra loot
		inventoryConfig.randomLootContainers["590c5d4b86f774784e1b9c45"] = modDb.randomLootContainers["590c5d4b86f774784e1b9c45"];	
		// add western mre loot
		inventoryConfig.randomLootContainers["590c5f0d86f77413997acfab"] = modDb.randomLootContainers["590c5f0d86f77413997acfab"];
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
                        Logger.info(`[IR] Imported extracted items to inventory (${profile._id})`);
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
    //
    //
    //
    //

    /**
    * @param container Dependency container
    */
    public postDBLoad(container: DependencyContainer)
    {
        const database =          container.resolve<DatabaseServer>("DatabaseServer").getTables() as IDatabaseTables;
        const globals =           database.globals.config;
        this.container =          container
        this.logger =             this.container.resolve<ILogger>("WinstonLogger")
        const configServer =      container.resolve<ConfigServer>("ConfigServer")
        const AirdropConfig =     configServer.getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);

        //
        //LootContainerAPI
        //


		const modDb = require("../db/items/itemData.json");
		
		// replace iskra in database
		database.templates.items["590c5d4b86f774784e1b9c45"] = modDb.items["590c5d4b86f774784e1b9c45"];
		database.templates.prices["590c5d4b86f774784e1b9c45"] = 24000
		
		// replace western MRE
		database.templates.items["590c5f0d86f77413997acfab"] = modDb.items["590c5f0d86f77413997acfab"];
		database.templates.prices["590c5f0d86f77413997acfab"] = 27000
		
		// adjust prices	
		const iskraPrice = database.templates.handbook.Items.find(i => i.Id === "590c5d4b86f774784e1b9c45");
		iskraPrice.Price = 21125;
		
		const mrePrice = database.templates.handbook.Items.find(i => i.Id === "590c5f0d86f77413997acfab");
		mrePrice.Price = 24832;
		
		//adjust container filters
		// secured containers
		for (const item in database.templates.items) {
			if (database.templates.items[item]._parent === "5448bf274bdc2dfc2f8b456a") {
				if (database.templates.items[item]._props.Grids[0]._props.filters[0]) {
					database.templates.items[item]._props.Grids[0]._props.filters[0].Filter.push(...["590c5d4b86f774784e1b9c45", "590c5f0d86f77413997acfab"]);
				}
			}
		}
		
		// Holodilnick container
		database.templates.items["5c093db286f7740a1b2617e3"]._props.Grids[0]._props.filters[0].Filter.push(...["590c5d4b86f774784e1b9c45", "590c5f0d86f77413997acfab"]);


        //
        //LootContainerAPI
        //


        for (let location in database.locations)
        {
            if (location == "base") continue;
            database.locations[location].base.EscapeTimeLimit = 9999999; // literally makes it so the game session lasts a couple months lmao
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
          AirdropConfig.planeVolume = modConfig.Raid.ChangeAirdropValues.PlaneVolume;
          AirdropConfig.airdropMinStartTimeSeconds = modConfig.Raid.ChangeAirdropValues.MinStartTimeSeconds;
          AirdropConfig.airdropMaxStartTimeSeconds = modConfig.Raid.ChangeAirdropValues.MaxStartTimeSeconds;
        }
      this.logger.log("Finished Overhauling your raids. Watch your back out there.", "magenta")  
    }

    //
    //LootContainerAPI
    //

    static customOpenRandomLootContainer(pmcData, body, sessionID) {
		const logger = RaidOverhaul.container.resolve("WinstonLogger");

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

//
//
//
//
//
//
//
//
//
//

interface IUpdateProfileRequest
{
    player: IPmcData;
}

module.exports = { mod: new RaidOverhaul() };