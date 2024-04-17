import { Item }                         from "@spt-aki/models/eft/common/tables/IItem";
import { IBarterScheme, ITrader }       from "@spt-aki/models/eft/common/tables/ITrader";
import { IAkiProfile }                  from "@spt-aki/models/eft/profile/IAkiProfile";
import { ILogger }                      from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor }                 from "@spt-aki/models/spt/logging/LogTextColor";
import { HashUtil }                     from "@spt-aki/utils/HashUtil";
import { PreAkiModLoader }              from "@spt-aki/loaders/PreAkiModLoader";
import { ITraderBase, ITraderAssort }   from "@spt-aki/models/eft/common/tables/ITrader";
import { ITemplateItem, Props }         from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { ITraderConfig, UpdateTime }    from "@spt-aki/models/spt/config/ITraderConfig";
import { IDatabaseTables }              from "@spt-aki/models/spt/server/IDatabaseTables";
import { ImageRouter }                  from "@spt-aki/routers/ImageRouter";
import { JsonUtil }                     from "@spt-aki/utils/JsonUtil";

import { Currency,
         Quests,
         BossAndFollow,
         Locales,
         StaticLoot,
         SlotPushes}                    from "../Refs/Enums";
import { References, DeepPartial }      from "../Refs/References"

import * as path                        from "path";
const fs = require('fs');

export class Utils
{
    constructor(private ref: References) 
    {}

    //#region Base Utils
    public randomCount ( base: number, random: number ): number
    {
        return ( base + Math.floor( Math.random() * random * 2 ) - random )
    }

    public loadFiles(dirPath, extName, cb): void
    {
        if (!fs.existsSync(dirPath)) return
        const dir = fs.readdirSync(dirPath, { withFileTypes: true })
        dir.forEach(item => {
            const itemPath = path.normalize(`${dirPath}/${item.name}`)
            if (item.isDirectory()) this.loadFiles(itemPath, extName, cb)
            else if (extName.includes(path.extname(item.name))) cb(itemPath)
        });
    }

    public addQuests(tables, imagerouter, modPath, modName, debugLogging): void
    {
        let questCount = 0
        let imageCount = 0

        this.loadFiles(`${modPath}../db/questFiles/quests/`, [".json"], function(filepath) {
            const keys = require(filepath)
            for (const i in keys) 
            {
				tables.templates.quests[i] = keys[i];
				questCount++;
			}
        })

        this.loadFiles(`${modPath}../db/questFiles/locales/`, [".json"], function(localepath) {
        const Locales = require(localepath)
            for(const i in Locales) {
                for (const localeID in tables.locales.global) {
                    tables.locales.global[localeID][i] = Locales[i];
                }
            }
        })

        this.loadFiles(`${modPath}../db/questFiles/pics/`, [".png", ".jpg"], function(filepath) {
            imagerouter.addRoute(`/files/quest/icon/${path.basename(filepath, path.extname(filepath))}`, filepath)
            imageCount++
        })

        if (debugLogging)
        {
            this.ref.logger.log(`[${modName}] Loaded ${imageCount} custom images and ${questCount} custom quests.`, "cyan")
        }
    }

    public shuffle(array: string[]): any
    {
        return array.sort(() => Math.random() - 0.5);
    }

    public shufflePop(array: string[]): any
    {
        return this.shuffle(array).pop().toString;
    }

    public shuffleShift(array: string[]): any
    {
        return this.shuffle(array).shift().toString;
    }

    public shufflePullTwo(array: string[]): any
    {
        return this.shuffle(array).pop().toString() && this.shuffle(array).shift().toString();
    }

    public logToServer(message: string, logger: any): void
    {
        logger.log("[Raid Overhaul] " + message, LogTextColor.CYAN);
    }

    public profileBackup(vfs, logger, modName, sessionID: string, path, profile: IAkiProfile, randomUtil): void
    {
        const backupPath =   path.join(__dirname, "../../ProfileBackup/");
        const profileData =  JSON.stringify(profile, null, 4);
        const randomNum =    randomUtil.randInt( 1, 20 ).toString();
        const date =         new Date();
        const day =          date.toISOString().slice(0, 10);
        const backupName =   backupPath + sessionID + "_" + "RO" + "_" + day + "_" + randomNum + "-backup.json";
        const profileCount = vfs.getFilesOfType(backupPath, "json").sort((a, b) => fs.statSync(a).ctimeMs - fs.statSync(b).ctimeMs);
        const maxBackups =   3

        if (!vfs.exists(backupPath)) 
        {
            logger.log(`${modName}: "${backupPath}" has been created`, LogTextColor.MAGENTA);
            vfs.createDir(backupPath);
        }

        if (profileCount.length >= maxBackups)
        {
            const lastProfile = profileCount[0];
            vfs.removeFile(lastProfile);
            profileCount.splice(0, 1);
        }

        fs.writeFile(backupName, profileData, {encoding: "utf8", flag: "w", mode: 0o666},
        (err) => {
            if (err)
                console.log(`[${modName}] Error Backing Up Profile;` + err);
            else {
                logger.log(`[${modName}] Profile backup successful.`, LogTextColor.MAGENTA);
            }
        });
    }

    public getItemInHandbook(itemID, tables, logger) 
    {
        try 
        {
            return tables.templates.handbook.Items.find((i) => i.Id === itemID)
        } 

        catch (error) 
        {
            logger.warning(`\nError getting Handbook ID for ${itemID}`)
        }
    }

    public getItemName(itemID, locale = "en", tables) 
    {
        if (tables.locales.global[locale][`${itemID} Name`] != undefined) 
        {
            return tables.locales.global[locale][`${itemID} Name`]
        } 
        
        else 
        {
            return tables.templates.items[itemID]?._name
        }
    }
    //#endregion
    //
    //
    //
    //#region Item Gen
    public createItem(itemGen: ItemGeneratorSettings, tables, ragfair, jsonUtil): void
    {
        const newItemGen = itemGen.newItem

        this.cloneItem(newItemGen.newID, newItemGen.ItemToClone, tables, jsonUtil);
        this.overrideProps(newItemGen.newID, newItemGen.OverrideProperties, tables)
        this.updateFilters(newItemGen.newID, newItemGen.ItemToClone, tables)

        if (newItemGen.PushMastery)
        {
            this.addNewMastery(tables, newItemGen.LocalePush.Name, newItemGen.newID)
        }

        if (newItemGen.AddToBots)
        {
            this.addToBots(tables, newItemGen.BotLootItemToClone, newItemGen.newID);
        }

        if (newItemGen.QuestPush.AddToQuests)
        {
            this.addToQuests(tables.templates.quests, newItemGen.QuestPush.QuestConditionType, newItemGen.QuestPush.QuestTargetConditionToClone, newItemGen.newID);
        }

        if (newItemGen.LootPush.AddToStaticLoot)
        {
            this.addToStaticLoot(tables, newItemGen.LootPush.LootContainersToAdd, newItemGen.newID, newItemGen.LootPush.StaticLootProbability);
        }

        if (newItemGen.AddToCases)
        {
            this.addToCases(tables, newItemGen.CasesToPush, newItemGen.newID)
        }

        if (newItemGen.PushToFleaBlacklist)
        {
            this.pushToBlacklist(newItemGen.newID, ragfair)
        }

        if (newItemGen.SlotInfo.AddToSlot)
        {
            this.pushToSlots(newItemGen.newID, newItemGen.SlotInfo.Slot)
        }

        this.pushToLocales(newItemGen.newID, newItemGen.LocalePush, tables);
        this.pushToHandbook(newItemGen.newID, newItemGen.HandbookParent, newItemGen.HandbookPrice, tables)
    }

    private pushToLocales(itemId: string, localeStruct: Locales, tables): void 
    {
		const newLocale: Record<string, string> = {};

		for(const [localeKey, localeVal] of Object.entries(localeStruct)) 
        {
			newLocale[`${itemId} ${localeKey}`] = localeVal;
		}

		for(const locale in tables.locales.global) 
        {
			tables.locales.global[locale] = {...tables.locales.global[locale], ...newLocale};
		}
	}

    private pushToHandbook(itemID: string, parentID: string, price: number, tables): void 
    {
        tables.templates.handbook.Items.push(
            {
                Id: itemID,
                ParentId: parentID,
                Price: price
            }
        );
	}

    private cloneItem(newItemId: string, cloneItemId: string, tables, jsonUtil): void 
    {
		const newItemProps: ITemplateItem = jsonUtil.clone(tables.templates.items[cloneItemId]);
		newItemProps._id = newItemId;
		tables.templates.items[newItemId] = newItemProps;
	}

	private overrideProps(itemId: string, newProps: ItemGeneratorSettings["newItem"]["OverrideProperties"], tables): void 
    {
		tables.templates.items[itemId]._props = {...tables.templates.items[itemId]._props, ...newProps as Props};
	}

    private pushToSlots(itemToPush: string, slot): void
    {
        const DefaultInventory = this.ref.tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots;
        DefaultInventory[slot]._props.filters[0].Filter.push(itemToPush);
    }

    private pushToBlacklist(itemToPush: string, ragfair): void
    {     
        ragfair.dynamic.blacklist.custom.push(...[itemToPush])
    }

    private addNewMastery(tables, localeMasteryName: string, masteryTemplateItemID: string): void
    {
        const new_mastery_ro = {
			"Name": localeMasteryName,
			"Templates": [
				masteryTemplateItemID
			],
			"Level2": 450,
			"Level3": 900
		}
		tables.globals.config.Mastering.push(new_mastery_ro)
    }

    public addToCases(tables, caseToAdd, itemToAdd): void
    {
        const items = tables.templates.items

        for (const item in items) 
        {
            if (items[item]._id === caseToAdd)
            {
                if (items[item]._props?.Grids[0]._props.filters[0].Filter == null)
                {
                    this.stopHurtingMeSVM(tables, caseToAdd)
                }

                if (items[item]._props?.Grids[0]._props.filters[0].Filter !== null)
                {
                    items[item]._props?.Grids[0]._props.filters[0].Filter.push(itemToAdd)
                }
            }
        }
    }

    private addToQuests(quests, condition: string, target: string, newTarget: string): void
    {
        for (const quest of Object.keys(quests)) 
        {
            const questConditions = quests[quest];
            for (const nextCondition of questConditions.conditions.AvailableForFinish) 
            {
                const nextConditionData = nextCondition;
                if ((nextConditionData.conditionType == condition) && nextConditionData.target.includes(target)) 
                {
                    nextConditionData.target.push(newTarget);
                }
            }
        }
    }

    private addToBots(tables, itemToClone, itemToPush): void
    {
        for (const botId in tables.bots.types) 
        {
            const botType = BossAndFollow[botId];
            if (botType) 
            {
                for (const lootSlot in tables.bots.types[botId].inventory.items) 
                {
                    const items = tables.bots.types[botId].inventory.items;
                    if (items[lootSlot].includes(itemToClone)) 
                    {
                        items.Backpack.push(itemToPush);
                        items.TacticalVest.push(itemToPush);
                    }
                }
            }
        }
    }

    private updateFilters(newItemID, itemToClone, tables): void
	{	
		for (const item in tables.templates.items) {
			
			const itemConflictId = tables.templates.items[item]._props.ConflictingItems;
			
			for (const itemInConflicts in itemConflictId) {
				const itemInConflictsFiltersId = itemConflictId[itemInConflicts];
					
				if (itemInConflictsFiltersId === itemToClone) {
					itemConflictId.push(newItemID);
				}
			}
			
			for (const slots in tables.templates.items[item]._props.Slots) {
				const slotsId = tables.templates.items[item]._props.Slots[slots]._props.filters[0].Filter;
				
				for (const itemInFilters in slotsId) {
					const itemInFiltersId = slotsId[itemInFilters]
					
					if (itemInFiltersId === itemToClone) {
						slotsId.push(newItemID);
					}
				}
			}
		}
	}

    public addToStaticLoot(tables, lootContainer, itemToPush, probability): void
    {
        const lootToPush = 
		{
			"tpl": itemToPush,
			"relativeProbability": probability
		}

        tables.loot.staticLoot[lootContainer].itemDistribution.push(lootToPush);
    }

    public stopHurtingMeSVM(tables, caseToAdd)
    {
        const unbreakFilters = [
            {
                "Filter": ["54009119af1c881c07000029"],
                "ExcludedFilter": [""]
            }
        ];
        
        tables.templates.items[caseToAdd]._props.Grids[0]._props.filters = unbreakFilters;
    }
    //#endregion
    //
    //
    //
    //#region Clothing Gen
    public createClothingTop(clothingTopGen: ClothingTopSettings, tables, jsonUtil): void
	{
		const newTop = jsonUtil.clone(tables.templates.customization["5d28adcb86f77429242fc893"]);
		const newHands = jsonUtil.clone(tables.templates.customization[clothingTopGen.HandsToClone]);
		const newSuite = jsonUtil.clone(tables.templates.customization["5d1f623e86f7744bce0ef705"]);

		newTop._id = clothingTopGen.NewOutfitID;
		newTop._name = clothingTopGen.NewOutfitID;
		newTop._props.Prefab.path = clothingTopGen.BundlePath;
		tables.templates.customization[clothingTopGen.NewOutfitID] = newTop;

		newHands._id = `${clothingTopGen.NewOutfitID}Hands`;
		newHands._name = `${clothingTopGen.NewOutfitID}Hands`;
		newHands._props.Prefab.path = clothingTopGen.HandsBundlePath;
		tables.templates.customization[`${clothingTopGen.NewOutfitID}Hands`] = newHands;

		newSuite._id = `${clothingTopGen.NewOutfitID}Suite`;
		newSuite._name = `${clothingTopGen.NewOutfitID}Suite`;
		newSuite._props.Body = clothingTopGen.NewOutfitID;
		newSuite._props.Hands = `${clothingTopGen.NewOutfitID}Hands`;
		newSuite._props.Side = ["Usec", "Bear", "Savage"];
		tables.templates.customization[`${clothingTopGen.NewOutfitID}Suite`] = newSuite;
	}
	
	public createClothingBottom( clothingBottomGen: ClothingBottomSettings, tables, jsonUtil): void
	{		
		const newBottom = jsonUtil.clone(tables.templates.customization["5d5e7f4986f7746956659f8a"]);
		const newSuite = jsonUtil.clone(tables.templates.customization["5cd946231388ce000d572fe3"]);

		newBottom._id = clothingBottomGen.NewBottomsID;
		newBottom._name = clothingBottomGen.NewBottomsID;
		newBottom._props.Prefab.path = clothingBottomGen.BundlePath;
		tables.templates.customization[clothingBottomGen.NewBottomsID] = newBottom;

		newSuite._id = `${clothingBottomGen.NewBottomsID}Suite`;
		newSuite._name = `${clothingBottomGen.NewBottomsID}Suite`;
		newSuite._props.Feet = clothingBottomGen.NewBottomsID;
		newSuite._props.Side = ["Usec", "Bear", "Savage"];
		tables.templates.customization[`${clothingBottomGen.NewBottomsID}Suite`] = newSuite;
	}
    //#endregion
}

export class TraderUtils
{
    //#region Trader Base Utils
    public registerProfileImage(baseJson: any, modName: string, preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter, traderImageName: string): void
    {
        const imageFilepath = `./${preAkiModLoader.getModPath(modName)}res`;
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/${traderImageName}`);
    }

    public setTraderUpdateTime(traderConfig: ITraderConfig, baseJson: any, minSeconds: number, maxSeconds: number): void
    {
        const traderRefreshRecord: UpdateTime = {
            traderId: baseJson._id,
            seconds: {
                min: minSeconds,
                max: maxSeconds
            } 
        };
        traderConfig.updateTime.push(traderRefreshRecord);
    }

    public addTraderToDb(traderDetailsToAdd: any, tables: IDatabaseTables, jsonUtil: JsonUtil, dialogueToAdd: any, servicesToAdd: any): void
    {
        tables.traders[traderDetailsToAdd._id] = {
            assort: this.createAssortTable(),
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)) as ITraderBase,
            dialogue: jsonUtil.deserialize(jsonUtil.serialize(dialogueToAdd)),
            services: jsonUtil.deserialize(jsonUtil.serialize(servicesToAdd)),
            questassort: {
                started: {},
                success: {},
                fail: {}
            }
        };
    }

    private createAssortTable(): ITraderAssort
    {
        const assortTable: ITraderAssort = {
            nextResupply: 0,
            items: [],
            barter_scheme: {},
            loyal_level_items: {}
        }

        return assortTable;
    }

    public addTraderToLocales(baseJson: any, tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string)
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
    //#endregion
}

export class AssortUtils
{
    //#region AssortUtils

    protected itemsToSell: Item[] = [];
    protected barterScheme: Record<string, IBarterScheme[][]> = {};
    protected loyaltyLevel: Record<string, number> = {};
    protected hashUtil: HashUtil;
    protected logger: ILogger;

    constructor(hashutil: HashUtil, logger: ILogger)
    {
        this.hashUtil = hashutil
        this.logger = logger;
    }
    
    /**
     * Start selling item with tpl
     * @param itemTpl Tpl id of the item you want trader to sell
     * @param itemId Optional - set your own Id, otherwise unique id will be generated
     */
    public createSingleAssortItem(itemTpl: string, itemId = undefined): AssortUtils
    {
        // Create item ready for insertion into assort table
        const newItemToAdd: Item = {
            _id: !itemId ? this.hashUtil.generate(): itemId,
            _tpl: itemTpl,
            parentId: "hideout", // Should always be "hideout"
            slotId: "hideout", // Should always be "hideout"
            upd: {
                UnlimitedCount: false,
                StackObjectsCount: 100
            }
        };

        this.itemsToSell.push(newItemToAdd);

        return this;
    }

    public createComplexAssortItem(items: Item[]): AssortUtils
    {
        items[0].parentId = "hideout";
        items[0].slotId = "hideout";

        if (!items[0].upd)
        {
            items[0].upd = {}
        }

        items[0].upd.UnlimitedCount = false;
        items[0].upd.StackObjectsCount = 100;

        this.itemsToSell.push(...items);

        return this;
    }

    public addStackCount(stackCount: number): AssortUtils
    {
        this.itemsToSell[0].upd.StackObjectsCount = stackCount;

        return this;
    }

    public addUnlimitedStackCount(): AssortUtils
    {
        this.itemsToSell[0].upd.StackObjectsCount = 999999;
        this.itemsToSell[0].upd.UnlimitedCount = true;

        return this;
    }

    public makeStackCountUnlimited(): AssortUtils
    {
        this.itemsToSell[0].upd.StackObjectsCount = 999999;

        return this;
    }

    public addBuyRestriction(maxBuyLimit: number): AssortUtils
    {
        this.itemsToSell[0].upd.BuyRestrictionMax = maxBuyLimit;
        this.itemsToSell[0].upd.BuyRestrictionCurrent = 0;

        return this;
    }

    public addLoyaltyLevel(level: number)
    {
        this.loyaltyLevel[this.itemsToSell[0]._id] = level;

        return this;
    }

    public addMoneyCost(currencyType: Currency, amount: number): AssortUtils
    {
        this.barterScheme[this.itemsToSell[0]._id] = [
            [
                {
                    count: amount,
                    _tpl: currencyType
                }
            ]
        ];

        return this;
    }

    public addBarterCost(itemTpl: string, count: number): AssortUtils
    {
        const sellableItemId = this.itemsToSell[0]._id;

        // No data at all, create
        if (Object.keys(this.barterScheme).length === 0)
        {
            this.barterScheme[sellableItemId] = [[
                {
                    count: count,
                    _tpl: itemTpl
                }
            ]];
        }
        else
        {
            // Item already exists, add to
            const existingData = this.barterScheme[sellableItemId][0].find(x => x._tpl === itemTpl);
            if (existingData)
            {
                // itemtpl already a barter for item, add to count
                existingData.count+= count;
            }
            else
            {
                // No barter for item, add it fresh
                this.barterScheme[sellableItemId][0].push({
                    count: count,
                    _tpl: itemTpl
                })
            }
            
        }

        return this;
    }

    /**
     * Reset object ready for reuse
     * @returns 
     */
    public export(data: ITrader, blockDupes: boolean): AssortUtils
    {
        const itemBeingSoldId  = this.itemsToSell[0]._id;
        const itemBeingSoldTpl = this.itemsToSell[0]._tpl;
        if (blockDupes)
        {
            if (data.assort.items.find(x => x._id === itemBeingSoldId))
            {
                return;
            }

            if (data.assort.items.find(x => x._tpl === itemBeingSoldTpl))
            {
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

    public pushFromTraderAssort(items: Item[], itemTpl: string, count: number, stackCount: number, level: number, data: ITrader, blockDupes: boolean, )
    {
        items[0].parentId = "hideout";
        items[0].slotId = "hideout";

        if (!items[0].upd)
        {
            items[0].upd = {}
        }

        items[0].upd.UnlimitedCount = false;
        items[0].upd.StackObjectsCount = 100;

        this.itemsToSell.push(...items);

        const sellableItemId = this.itemsToSell[0]._id;

        // No data at all, create
        if (Object.keys(this.barterScheme).length === 0)
        {
            this.barterScheme[sellableItemId] = [[
                {
                    count: count,
                    _tpl: itemTpl
                }
            ]];
        }

        else
        {
            // Item already exists, add to
            const existingData = this.barterScheme[sellableItemId][0].find(x => x._tpl === itemTpl);
            if (existingData)
            {
                // itemtpl already a barter for item, add to count
                existingData.count+= count;
            }
            else
            {
                // No barter for item, add it fresh
                this.barterScheme[sellableItemId][0].push({
                    count: count,
                    _tpl: itemTpl
                })
            }          
        }
       
        this.itemsToSell[0].upd.StackObjectsCount = stackCount;
        
        this.loyaltyLevel[this.itemsToSell[0]._id] = level;

        const itemBeingSoldId  = this.itemsToSell[0]._id;
        const itemBeingSoldTpl = this.itemsToSell[0]._tpl;
        if (blockDupes)
        {
            if (data.assort.items.find(x => x._id === itemBeingSoldId))
            {
                return;
            }

            if (data.assort.items.find(x => x._tpl === itemBeingSoldTpl))
            {
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
    //#endregion
    //
    //
    //
    //#region Get Presets
    public getPresets(fs, path, hashUtil)
    {
        fs.readFile(path.resolve(__dirname, `../../../../../Aki_Data/Server/database/globals.json`), (err, data) => 
        {
            if (err) throw err

            let presetList=     JSON.parse(data).ItemPresets
            let presetFile =    {}

            for(let preset in presetList)
            {
                let newPreset = 
                    {
                        "_changeWeaponName": presetList[preset]._changeWeaponName,
                        "_encyclopedia": presetList[preset]._encyclopedia,
                        "_id": hashUtil.generate,
                        "_items": [...presetList[preset]._items],
                        "_name": presetList[preset]._name,
                        "_parent": presetList[preset]._parent,
                        "_type": presetList[preset]._type
                    }
                presetFile[presetList[preset]._name] = JSON.parse(JSON.stringify(newPreset));
            }
        fs.writeFile(path.resolve(__dirname, "../Refs/ArrayFiles/Items/presetArray.json"), JSON.stringify(presetFile, null, "\t"), (err) => 
        { 
          if (err) throw err
        })
        }) 
    }
    //#endregion
    //
    //
    //
    //#region Get Assorts
    /*
    public getAssorts(tHelper, vfs)
    {
        const assortArray1 =    [];
        const assortArray2 =    [];
        const assortArray3 =    [];
        const assortArray4 =    [];
        const assortArray5 =    [];
        const assortArray6 =    [];
        const assortArray7 =    [];

        const mechanicArray=    tHelper.getTraderAssortsByTraderId("5a7c2eca46aef81a7ca2145d");
        const praporArray=      tHelper.getTraderAssortsByTraderId("54cb50c76803fa8b248b4571");
        const skierArray=       tHelper.getTraderAssortsByTraderId("58330581ace78e27b8b10cee");
        const therapistArray=   tHelper.getTraderAssortsByTraderId("54cb57776803fa99248b456e");
        const ragmanArray=      tHelper.getTraderAssortsByTraderId("5ac3b934156ae10c4430e83c");
        const jaegerArray=      tHelper.getTraderAssortsByTraderId("5c0647fdd443bc2504c2d371");
        const peacekeeperArray= tHelper.getTraderAssortsByTraderId("5935c25fb3acc3127c3d8cd9");

        assortArray1.push(mechanicArray);
        assortArray2.push(praporArray);
        assortArray3.push(skierArray);
        assortArray4.push(therapistArray);
        assortArray5.push(ragmanArray);
        assortArray6.push(jaegerArray);
        assortArray7.push(peacekeeperArray);

        const assortArray1File = JSON.stringify(assortArray1, null, 2);
        const assortArray2File = JSON.stringify(assortArray2, null, 2);
        const assortArray3File = JSON.stringify(assortArray3, null, 2);
        const assortArray4File = JSON.stringify(assortArray4, null, 2);
        const assortArray5File = JSON.stringify(assortArray5, null, 2);
        const assortArray6File = JSON.stringify(assortArray6, null, 2);
        const assortArray7File = JSON.stringify(assortArray6, null, 2);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Traders/mechanicArray.json", assortArray1File);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Traders/praporArray.json", assortArray2File);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Traders/skierArray.json", assortArray3File);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Traders/therapistArray.json", assortArray4File);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Traders/ragmanArray.json", assortArray5File);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Traders/jaegerArray.json", assortArray6File);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Traders/peacekeeperArray.json", assortArray7File);
    }
    */
    //#endregion
    //
    //
    //
    //#region Generate Fluid Assort
    public generateFluidAssortData(tables, BaseClasses, vfs)
    {
        const items = Object.values(tables.templates.items);
        const itemArray =   [];
        const ammoArray =   [];
        const plateArray =  [];
        const gearArray =   [];
        const modsArray =   [];
        const medsArray =   [];
        const weaponArray = [];
        const keyArray =    [];

        for (const item of items)
        {
            if (item._parent === BaseClasses.INFO 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._id !== "6389c92d52123d5dd17f8876"
                && item._id !== "6389c8c5dbfd5e4b95197e6b"
                && item._id !== "6389c8fb46b54c634724d847"
                && item._id !== "LotusKeycard"
                && item._props.Prefab.path !== ""){itemArray.push(item._id)}

            if (item._parent === BaseClasses.HEADPHONES 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){gearArray.push(item._id)}

            if (item._parent === BaseClasses.AUXILARY_MOD 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.SILENCER 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._id !== "55d617094bdc2d89028b4568"
                && item._id !== "54490a4d4bdc2dbc018b4573"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.SPECIAL_SCOPE 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._id !== "5a1eaa87fcdbcb001865f75e"
                && item._id !== "63fc44e2429a8a166c7f61e6"
                && item._id !== "6478641c19d732620e045e17"
                && item._id !== "5d1b5e94d7ad1a2b865a96b0"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.OPTIC_SCOPE 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.COMPENSATOR 
                && item._props.QuestItem !== true
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.COMPACT_COLLIMATOR 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.COLLIMATOR 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.FLASH_HIDER 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.LIGHT_LASER_DESIGNATOR 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.MAGAZINE 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._id !== "5d52d479a4b936793d58c76b" 
                && item._id !== "5cffa483d7ad1a049e54ef1c"){modsArray.push(item._id)}

            if (item._parent === BaseClasses.FLASHLIGHT  
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.TACTICAL_COMBO 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.ASSAULT_SCOPE  
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.ELECTRONICS 
                && item._props.QuestItem !== true
                && item._type !== "Node" 
                && item._id !== "57347ca924597744596b4e71"
                && item._id !== "5d03775b86f774203e7e0c4b"
                && item._id !== "6389c85357baa773a825b356"
                && item._id !== "6389c7f115805221fb410466"
                && item._id !== "6389c7750ef44505c87f5996"
                && item._props.Prefab.path !== ""){itemArray.push(item._id)}

            if (item._parent === BaseClasses.ARMBAND
                && item._props.QuestItem !== true
                && item._type !== "Node" 
                && item._id !== "619bddc6c9546643a67df6ee"
                && item._id !== "DeadArmband"
                && item._props.Prefab.path !== ""){itemArray.push(item._id)}

            if (item._parent === BaseClasses.KEY_MECHANICAL 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._id !== "5780cf7f2459777de4559322"
                && item._id !== "5d80c60f86f77440373c4ece"
                && item._id !== "5ede7a8229445733cb4c18e2"
                && item._id !== "5d80c62a86f7744036212b3f"
                && item._id !== "62987dfc402c7f69bf010923"
                && item._id !== "63a3a93f8a56922e82001f5d"
                && item._id !== "64ccc25f95763a1ae376e447"){keyArray.push(item._id)}

            if (item._parent === BaseClasses.NIGHTVISION
                && item._props.QuestItem !== true
                && item._type !== "Node" 
                && item._props.Prefab.path !== ""){itemArray.push(item._id)}

            if (item._parent === BaseClasses.MEDS
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._id !== "5e99735686f7744bfc4af32c"
                && item._id !== "5e99711486f7744bfc4af328"
                && item._props.Prefab.path !== ""){medsArray.push(item._id)}

            if (item._parent === BaseClasses.MOUNT  
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.FOREGRIP  
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.STOCK  
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.STIMULATOR
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._id !== "64ba763be87866541c0d7c50"
                && item._id !== "637b60c3b7afa97bfc3d7001"
                && item._props.Prefab.path !== ""){medsArray.push(item._id)}

            if (item._parent === BaseClasses.FUEL 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._props.Prefab.path !== ""){itemArray.push(item._id)}

            if (item._parent === BaseClasses.DRUGS
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){medsArray.push(item._id)}

            if (item._parent === BaseClasses.MEDKIT 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._id !== "5e99735686f7744bfc4af32c"
                && item._id !== "5e99711486f7744bfc4af328"
                && item._props.Prefab.path !== ""){medsArray.push(item._id)}

            if (item._parent === BaseClasses.GAS_BLOCK  
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.BACKPACK 
                && item._props.QuestItem !== true
                && item._type !== "Node"
                && item._id !== "5e99711486f7744bfc4af328" 
                && item._props.Prefab.path !== ""){gearArray.push(item._id)}

            if (item._parent === BaseClasses.FACECOVER 
                && item._props.QuestItem !== true
                && item._type !== "Node"
                && item._id !== "KnightMask"
                && item._id !== "58ac60eb86f77401897560ff"
                && item._props.Prefab.path !== ""){gearArray.push(item._id)}

            if (item._parent === BaseClasses.VEST 
                && item._props.QuestItem !== true
                && item._type !== "Node"
                && item._id !== "DeadArmband"
                && item._props.Slots == null
                && item._props.Prefab.path !== ""){gearArray.push(item._id)}

            if (item._parent === BaseClasses.HEADWEAR 
                && item._props.QuestItem !== true
                && item._type !== "Node"
                && item._props.Slots == null
                && item._props.Prefab.path !== ""){gearArray.push(item._id)}

            if (item._parent === BaseClasses.VISORS 
                && item._props.QuestItem !== true
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){gearArray.push(item._id)}

            if (item._parent === BaseClasses.UBGL 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._id !== "5648b62b4bdc2d9d488b4585" 
                && item._props.Prefab.path !== ""){modsArray.push(item._id)}

            if (item._parent === BaseClasses.BARTER_ITEM 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._id !== "59faff1d86f7746c51718c9c"
                && item._props.Prefab.path !== ""){itemArray.push(item._id)}

            if (item._parent === BaseClasses.TOOL 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._props.Prefab.path !== ""){itemArray.push(item._id)}

            if (item._parent === BaseClasses.HOUSEHOLD_GOODS 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._props.Prefab.path !== ""){itemArray.push(item._id)}

            if (item._parent === BaseClasses.ARMOR_PLATE 
                && item._props.QuestItem !== true
                && item._type !== "Node"
                && item._props.Prefab.path !== "" 
                && !item._name.includes("soft_armor") 
                && item._id !== "64b11c08506a73f6a10f9364"){plateArray.push(item._id)}

            if (item._parent === BaseClasses.AMMO 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._id !== "6241c316234b593b5676b637"){ammoArray.push(item._id)}

            if (item._parent === BaseClasses.THROW_WEAPON 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.PISTOL 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.REVOLVER 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.SMG 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.ASSAULT_RIFLE 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.ASSAULT_CARBINE 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.SHOTGUN 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.MARKSMAN_RIFLE 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.SNIPER_RIFLE 
                && item._props.QuestItem !== true 
                && item._type !== "Node"
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.MACHINE_GUN 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._id !== "5cdeb229d7f00c000e7ce174" 
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.GRENADE_LAUNCHER 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._id !== "5d52cc5ba4b9367408500062" 
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}

            if (item._parent === BaseClasses.SPECIAL_WEAPON 
                && item._props.QuestItem !== true 
                && item._type !== "Node" 
                && item._id !== "5d52cc5ba4b9367408500062" 
                && item._props.Prefab.path !== ""){weaponArray.push(item._id)}
        }

        const itemArrayFile =   JSON.stringify(itemArray, null, 2);
        const ammoArrayFile =   JSON.stringify(ammoArray, null, 2);
        const plateArrayFile =  JSON.stringify(plateArray, null, 2);
        const gearArrayFile =   JSON.stringify(gearArray, null, 2);
        const modsArrayFile =   JSON.stringify(modsArray, null, 2);
        const medsArrayFile =   JSON.stringify(medsArray, null, 2);
        const weaponArrayFile = JSON.stringify(weaponArray, null, 2);
        const keyArrayFile =    JSON.stringify(keyArray, null, 2);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Items/itemArray.json",   itemArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Items/ammoArray.json",   ammoArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Items/plateArray.json",  plateArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Items/gearArray.json",   gearArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Items/modsArray.json",   modsArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Items/medsArray.json",   medsArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Items/weaponArray.json", weaponArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/src/Refs/ArrayFiles/Items/keyArray.json",    keyArrayFile);
    }
    //#endregion
    //
    //
    //
    //#region Generate Ammo Data    
    public generateAmmoTypeData(tables, BaseClasses, vfs)
    {
        const items = Object.values(tables.templates.items);
        const rifleArray =   [];
        const shotgunArray = [];
        const smgArray =     [];
        const sniperArray =  [];
        const ubglArray =    [];

        for (const item of items)
        {
            if (item._parent === BaseClasses.AMMO 
                && item._props.Caliber === "Caliber366TKM"                                                  
                || item._props.Caliber === "Caliber9x39"                                                  
                || item._props.Caliber === "Caliber762x39"                                                  
                || item._props.Caliber === "Caliber556x45NATO"                                                  
                || item._props.Caliber === "Caliber545x39"                                                  
                || item._props.Caliber === "Caliber127x55"                                                  
                || item._props.Caliber === "Caliber68x51"                                                  
                || item._props.Caliber === "Caliber762x35"){rifleArray.push(item._id)}

            if (item._parent === BaseClasses.AMMO 
                && item._props.Caliber === "Caliber12g"                                                  
                || item._props.Caliber === "Caliber20g"){shotgunArray.push(item._id)}

            if (item._parent === BaseClasses.AMMO 
                && item._props.Caliber === "Caliber1143x23ACP"                                                  
                || item._props.Caliber === "Caliber46x30"                                                  
                || item._props.Caliber === "Caliber57x28"                                                  
                || item._props.Caliber === "Caliber762x25TT"                                                  
                || item._props.Caliber === "Caliber9x18PM"                                                  
                || item._props.Caliber === "Caliber9x19PARA"                                                  
                || item._props.Caliber === "Caliber9x21"                                                  
                || item._props.Caliber === "Caliber9x33R"){smgArray.push(item._id)}

            if (item._parent === BaseClasses.AMMO 
                && item._props.Caliber === "Caliber762x51"                                               
                || item._props.Caliber === "Caliber762x54R"                                     
                || item._props.Caliber === "Caliber86x70"){sniperArray.push(item._id)}

            if (item._parent === BaseClasses.UBGL 
                && item._props.Caliber === "Caliber26x75"                                               
                || item._props.Caliber === "Caliber30x29"                                            
                || item._props.Caliber === "Caliber40mmRU"                                                 
                || item._props.Caliber === "Caliber40x46"){ubglArray.push(item._id)}
        }

        const rifleArrayFile =   JSON.stringify(rifleArray, null, 2);
        const shotgunArrayFile = JSON.stringify(shotgunArray, null, 2);
        const smgArrayFile =     JSON.stringify(smgArray, null, 2);
        const sniperArrayFile =  JSON.stringify(sniperArray, null, 2);
        const ubglArrayFile =    JSON.stringify(ubglArray, null, 2);
        vfs.writeFile("./user/mods/RaidOverhaul/db/AmmoList/Rifle.json",   rifleArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/db/AmmoList/Shotgun.json", shotgunArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/db/AmmoList/SMG.json",     smgArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/db/AmmoList/Sniper.json",  sniperArrayFile);
        vfs.writeFile("./user/mods/RaidOverhaul/db/AmmoList/UBGL.json",    ubglArrayFile);
    }
    //#endregion
}
    //#region Item Gen Types
export type ItemGeneratorSettings = {
	newItem: {
		ItemToClone: string,
		newID: string,
		OverrideProperties: DeepPartial<Props>,
        LocalePush: Locales,
        HandbookParent: string,
        HandbookPrice: number,
        PushMastery: boolean,
        AddToBots: boolean,
        BotLootItemToClone: string,
        QuestPush: Quests,
        LootPush: StaticLoot,
        AddToCases: boolean,
        CasesToPush: string[],
        PushToFleaBlacklist: boolean,
        SlotInfo: SlotPushes
	}
};

export type ClothingTopSettings = {
    NewOutfitID: string,
    BundlePath: string,
    HandsToClone: string,
    HandsBundlePath: string
}

export type ClothingBottomSettings = {
    NewBottomsID: string,
    BundlePath: string
}
    //#endregion