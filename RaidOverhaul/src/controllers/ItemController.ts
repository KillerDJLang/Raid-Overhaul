import { inject, injectable } from "tsyringe";
//Spt Classes
import type { CustomItemService } from "@spt/services/mod/CustomItemService";
import type { DatabaseService } from "@spt/services/DatabaseService";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { BaseClasses } from "@spt/models/enums/BaseClasses";
//Custom Classes
import type { ConfigManager } from "../managers/ConfigManager";
import { AllBots, CustomMap } from "../models/Enums";
import type { ROLogger } from "../utils/Logger";
import type { Utils } from "../utils/Utils";
//Json Imports
const containerCrafts = require("../utils/data/containerCrafts.json");
const globalPresets = require("../../db/Presets/Globals.json");
const ammoList = require("../Utils/data/ammoStackList.json");

@injectable()
export class ItemController {
    constructor(
        @inject("Utils") protected utils: Utils,
        @inject("ROLogger") protected logger: ROLogger,
        @inject("ConfigManager") protected configManager: ConfigManager,
        @inject("CustomItemService") protected customItem: CustomItemService,
        @inject("DatabaseService") protected databaseService: DatabaseService,
    ) {}

    public itemChanges(): void {
        const tables = this.databaseService.getTables();
        const handbookBase = tables.templates.handbook;
        const fleaPrices = tables.templates.prices;
        const presets = tables.globals;
        const items = tables.templates.items;
        const pockets = tables.templates.items["627a4e6b255f7527fb05a0f6"];
        const uhPockets = tables.templates.items["65e080be269cbd5c5005e529"];
        const whiteFlare = "62178be9d0050232da3485d9";
        const conInvKey = "harmer-configurableinventories";
        const svmKey = "[SVM] Server Value Modifier";
        let recipes = tables.hideout.production.recipes;

        for (const id in items) {
            const base = items[id];

            if (this.configManager.modConfig().Raid.LootableMelee) {
                if (base._parent === BaseClasses.KNIFE) {
                    base._props.Unlootable = false;
                    base._props.UnlootableFromSide = [];
                }
            }
        }

        for (const id in items) {
            const base = items[id];

            if (this.configManager.modConfig().Raid.LootableArmbands) {
                if (base._parent === BaseClasses.ARMBAND) {
                    base._props.Unlootable = false;
                    base._props.UnlootableFromSide = [];
                }
            }
        }

        for (const id in items) {
            const base = items[id];

            if (base._props.BlocksEarpiece) {
                base._props.BlocksEarpiece = false;
            }

            if (base._props.BlocksFaceCover) {
                base._props.BlocksFaceCover = false;
            }
        }

        for (const id in items) {
            const base = items[id];

            if (base._id === "5ea058e01dbce517f324b3e2") {
                base._props.armorClass = "4";
            }
        }

        if (this.configManager.modConfig().PocketChanges.Enabled) {
            (pockets._props.Grids = [
                {
                    _id: this.utils.genId(),
                    _name: "pocket1",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: {
                        cellsH: this.configManager.modConfig().PocketChanges.Pocket1.Horizontal,
                        cellsV: this.configManager.modConfig().PocketChanges.Pocket1.Vertical,
                        filters: [
                            {
                                ExcludedFilter: ["5448bf274bdc2dfc2f8b456a"],
                                Filter: ["54009119af1c881c07000029"],
                            },
                        ],
                        isSortingTable: false,
                        maxCount: 0,
                        maxWeight: 0,
                        minCount: 0,
                    },
                    _proto: "55d329c24bdc2d892f8b4567",
                },
                {
                    _id: this.utils.genId(),
                    _name: "pocket2",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: {
                        cellsH: this.configManager.modConfig().PocketChanges.Pocket2.Horizontal,
                        cellsV: this.configManager.modConfig().PocketChanges.Pocket2.Vertical,
                        filters: [
                            {
                                ExcludedFilter: ["5448bf274bdc2dfc2f8b456a"],
                                Filter: ["54009119af1c881c07000029"],
                            },
                        ],
                        isSortingTable: false,
                        maxCount: 0,
                        maxWeight: 0,
                        minCount: 0,
                    },
                    _proto: "55d329c24bdc2d892f8b4567",
                },
                {
                    _id: this.utils.genId(),
                    _name: "pocket3",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: {
                        cellsH: this.configManager.modConfig().PocketChanges.Pocket3.Horizontal,
                        cellsV: this.configManager.modConfig().PocketChanges.Pocket3.Vertical,
                        filters: [
                            {
                                ExcludedFilter: ["5448bf274bdc2dfc2f8b456a"],
                                Filter: ["54009119af1c881c07000029"],
                            },
                        ],
                        isSortingTable: false,
                        maxCount: 0,
                        maxWeight: 0,
                        minCount: 0,
                    },
                    _proto: "55d329c24bdc2d892f8b4567",
                },
                {
                    _id: this.utils.genId(),
                    _name: "pocket4",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: {
                        cellsH: this.configManager.modConfig().PocketChanges.Pocket4.Horizontal,
                        cellsV: this.configManager.modConfig().PocketChanges.Pocket4.Vertical,
                        filters: [
                            {
                                ExcludedFilter: ["5448bf274bdc2dfc2f8b456a"],
                                Filter: ["54009119af1c881c07000029"],
                            },
                        ],
                        isSortingTable: false,
                        maxCount: 0,
                        maxWeight: 0,
                        minCount: 0,
                    },
                    _proto: "55d329c24bdc2d892f8b4567",
                },
            ]),
                (uhPockets._props.Grids = [
                    {
                        _id: this.utils.genId(),
                        _name: "pocket1",
                        _parent: "627a4e6b255f7527fb05a0f6",
                        _props: {
                            cellsH: this.configManager.modConfig().PocketChanges.Pocket1.Horizontal,
                            cellsV: this.configManager.modConfig().PocketChanges.Pocket1.Vertical,
                            filters: [
                                {
                                    ExcludedFilter: ["5448bf274bdc2dfc2f8b456a"],
                                    Filter: ["54009119af1c881c07000029"],
                                },
                            ],
                            isSortingTable: false,
                            maxCount: 0,
                            maxWeight: 0,
                            minCount: 0,
                        },
                        _proto: "55d329c24bdc2d892f8b4567",
                    },
                    {
                        _id: this.utils.genId(),
                        _name: "pocket2",
                        _parent: "627a4e6b255f7527fb05a0f6",
                        _props: {
                            cellsH: this.configManager.modConfig().PocketChanges.Pocket2.Horizontal,
                            cellsV: this.configManager.modConfig().PocketChanges.Pocket2.Vertical,
                            filters: [
                                {
                                    ExcludedFilter: ["5448bf274bdc2dfc2f8b456a"],
                                    Filter: ["54009119af1c881c07000029"],
                                },
                            ],
                            isSortingTable: false,
                            maxCount: 0,
                            maxWeight: 0,
                            minCount: 0,
                        },
                        _proto: "55d329c24bdc2d892f8b4567",
                    },
                    {
                        _id: this.utils.genId(),
                        _name: "pocket3",
                        _parent: "627a4e6b255f7527fb05a0f6",
                        _props: {
                            cellsH: this.configManager.modConfig().PocketChanges.Pocket3.Horizontal,
                            cellsV: this.configManager.modConfig().PocketChanges.Pocket3.Vertical,
                            filters: [
                                {
                                    ExcludedFilter: ["5448bf274bdc2dfc2f8b456a"],
                                    Filter: ["54009119af1c881c07000029"],
                                },
                            ],
                            isSortingTable: false,
                            maxCount: 0,
                            maxWeight: 0,
                            minCount: 0,
                        },
                        _proto: "55d329c24bdc2d892f8b4567",
                    },
                    {
                        _id: this.utils.genId(),
                        _name: "pocket4",
                        _parent: "627a4e6b255f7527fb05a0f6",
                        _props: {
                            cellsH: this.configManager.modConfig().PocketChanges.Pocket4.Horizontal,
                            cellsV: this.configManager.modConfig().PocketChanges.Pocket4.Vertical,
                            filters: [
                                {
                                    ExcludedFilter: ["5448bf274bdc2dfc2f8b456a"],
                                    Filter: ["54009119af1c881c07000029"],
                                },
                            ],
                            isSortingTable: false,
                            maxCount: 0,
                            maxWeight: 0,
                            minCount: 0,
                        },
                        _proto: "55d329c24bdc2d892f8b4567",
                    },
                ]);
            this.utils.stopHurtingMeSVM("627a4e6b255f7527fb05a0f6");
            this.utils.stopHurtingMeSVM("65e080be269cbd5c5005e529");
        }

        if (this.configManager.modConfig().Raid.SpecialSlotChanges) {
            pockets._props.Slots = [
                {
                    _id: this.utils.genId(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot1",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
                {
                    _id: this.utils.genId(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot2",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
                {
                    _id: this.utils.genId(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot3",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
            ];

            uhPockets._props.Slots = [
                {
                    _id: this.utils.genId(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot1",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
                {
                    _id: this.utils.genId(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot2",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
                {
                    _id: this.utils.genId(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot3",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
            ];
        }

        if (this.configManager.modConfig().EnableCustomItems) {
            for (const itemPreset in globalPresets.ItemPresets) {
                presets.ItemPresets[itemPreset] = globalPresets.ItemPresets[itemPreset];
            }
        }

        if (this.configManager.modConfig().Raid.HolsterAnything) {
            const inventory = items["55d7217a4bdc2d86028b456d"];
            const holster = inventory._props.Slots[2];

            holster._props.filters[0].Filter.push("5422acb9af1c889c16000029");
        }

        if (this.configManager.modConfig().Raid.LowerExamineTime) {
            for (const id in items) {
                items[id]._props.ExamineTime = 0.1;
            }
        }
        /*
        for (const flare in handbookBase.Items) {
          if (handbookBase.Items[flare].Id === whiteFlare) {
            handbookBase.Items[flare].Price = 89999;
          }
        }
        fleaPrices[whiteFlare] = 97388 + this.randomUtil.getInt(500, 53000);
    */
        for (const botId in tables.bots.types) {
            const botType = AllBots[botId];

            if (botType) {
                for (const lootSlot in tables.bots.types[botId].inventory.items) {
                    const items = tables.bots.types[botId].inventory.items;

                    if (items[lootSlot]["5c94bbff86f7747ee735c08f"] !== undefined) {
                        const weight = items[lootSlot]["5c94bbff86f7747ee735c08f"];
                        items[lootSlot]["668b3c71042c73c6f9b00704"] = weight;
                    }
                }
            }
        }

        for (const botId in tables.bots.types) {
            const botType = AllBots[botId];

            if (botType) {
                for (const lootSlot in tables.bots.types[botId].inventory.items) {
                    const items = tables.bots.types[botId].inventory.items;

                    if (items[lootSlot]["573475fb24597737fb1379e1"] !== undefined) {
                        const weight = items[lootSlot]["573475fb24597737fb1379e1"];
                        items[lootSlot]["66292e79a4d9da25e683ab55"] = weight;
                    }
                }
            }
        }

        if (!this.utils.checkForMod(conInvKey) && !this.utils.checkForMod(svmKey)) {
            this.utils.addToCases(
                [
                    "5732ee6a24597719ae0c0281",
                    "544a11ac4bdc2d470e8b456a",
                    "5857a8b324597729ab0a0e7d",
                    "5857a8bc2459772bad15db29",
                    "59db794186f77448bc595262",
                    "5c093ca986f7740a1867ab12",
                    "6621b12c9f46c3eb4a0c8f40",
                    "6621b143edb81061ceb5d7cc",
                    "6621b177ce1b117550362db5",
                    "6621b1895c9cd0794d536d14",
                    "6621b1986f4ebd47e39eacb5",
                    "6621b1b3166c301c04facfc8",
                    "666361eff60f4ea5a464eb70",
                    "666362befb4578a9f2450bd8",
                ],
                "64d4b23dc1b37504b41ac2b6",
            );

            this.utils.addToCases(
                [
                    "5783c43d2459774bbe137486",
                    "60b0f6c058e0b0481a09ad11",
                    "590c60fc86f77412b13fddcf",
                    "5d235bb686f77443f4331278",
                ],
                "59f32c3b86f77472a31742f0",
            );
            this.utils.addToCases(
                [
                    "5783c43d2459774bbe137486",
                    "60b0f6c058e0b0481a09ad11",
                    "590c60fc86f77412b13fddcf",
                    "5d235bb686f77443f4331278",
                ],
                "59f32bb586f774757e1e8442",
            );
        }

        for (const container of containerCrafts) {
            const craftExists = recipes.find((i) => i._id === container._id);
            if (!craftExists) {
                recipes.push(container);
            } else {
                recipes = recipes.filter((i) => i._id !== container._id);
                recipes.push(container);
            }
        }

        if (this.configManager.modConfig().Raid.ChangeBackpackSizes) {
            this.utils.modifyContainerSize("5df8a4d786f77412672a1e3b", 6, 12);
            this.utils.modifyContainerSize("628bc7fb408e2b2e9c0801b1", 6, 11);
            this.utils.modifyContainerSize("5c0e774286f77468413cc5b2", 6, 10);
            this.utils.modifyContainerSize("5e4abc6786f77406812bd572", 6, 9);
            this.utils.modifyContainerSize("5e997f0b86f7741ac73993e2", 6, 6);
            this.utils.modifyContainerSize("5ab8ebf186f7742d8b372e80", 6, 9);
            this.utils.modifyContainerSize("61b9e1aaef9a1b5d6a79899a", 6, 9);
            this.utils.modifyContainerSize("59e763f286f7742ee57895da", 6, 9);
            this.utils.modifyContainerSize("639346cc1c8f182ad90c8972", 6, 8);
            this.utils.modifyContainerSize("628e1ffc83ec92260c0f437f", 6, 6);
            this.utils.modifyContainerSize("62a1b7fbc30cfa1d366af586", 6, 6);
            this.utils.modifyContainerSize("5b44c6ae86f7742d1627baea", 6, 6);
            this.utils.modifyContainerSize("545cdae64bdc2d39198b4568", 6, 6);
            this.utils.modifyContainerSize("5f5e467b0bc58666c37e7821", 6, 6);
            this.utils.modifyContainerSize("618bb76513f5097c8d5aa2d5", 6, 5);
            this.utils.modifyContainerSize("619cf0335771dd3c390269ae", 6, 5);
            this.utils.modifyContainerSize("60a272cc93ef783291411d8e", 6, 5);
            this.utils.modifyContainerSize("618cfae774bb2d036a049e7c", 6, 5);
            this.utils.modifyContainerSize("6034d103ca006d2dca39b3f0", 4, 8);
            this.utils.modifyContainerSize("6038d614d10cbf667352dd44", 4, 8);
            this.utils.modifyContainerSize("60a2828e8689911a226117f9", 6, 5);
            this.utils.modifyContainerSize("5e9dcf5986f7746c417435b3", 5, 5);
            this.utils.modifyContainerSize("56e335e4d2720b6c058b456d", 5, 5);
            this.utils.modifyContainerSize("5ca20d5986f774331e7c9602", 5, 5);
            this.utils.modifyContainerSize("544a5cde4bdc2d39388b456b", 4, 5);
            this.utils.modifyContainerSize("56e33634d2720bd8058b456b", 5, 3);
            this.utils.modifyContainerSize("5f5e45cc5021ce62144be7aa", 3, 5);
            this.utils.modifyContainerSize("56e33680d2720be2748b4576", 4, 3);
            this.utils.modifyContainerSize("5ab8ee7786f7742d8f33f0b9", 3, 4);
            this.utils.modifyContainerSize("5ab8f04f86f774585f4237d8", 3, 3);
            this.utils.modifyContainerSize("66a9f98f3bd5a41b162030f4", 6, 9);
            this.utils.modifyContainerSize("66b5f247af44ca0014063c02", 5, 5);
            this.utils.modifyContainerSize("66b5f22b78bbc0200425f904", 6, 6);
        }
    }

    public stackChanges(): void {
        const tables = this.databaseService.getTables();
        const items = tables.templates.items;

        if (
            this.configManager.modConfig().AdvancedStackTuning.Enabled &&
            !this.configManager.modConfig().BasicStackTuning.Enabled
        ) {
            for (const id of ammoList.Shotgun) {
                items[id]._props.StackMaxSize = this.configManager.modConfig().AdvancedStackTuning.ShotgunStack;
            }

            for (const id of ammoList.UBGL) {
                items[id]._props.StackMaxSize = this.configManager.modConfig().AdvancedStackTuning.FlaresAndUBGL;
            }

            for (const id of ammoList.Sniper) {
                items[id]._props.StackMaxSize = this.configManager.modConfig().AdvancedStackTuning.SniperStack;
            }

            for (const id of ammoList.SMG) {
                items[id]._props.StackMaxSize = this.configManager.modConfig().AdvancedStackTuning.SMGStack;
            }

            for (const id of ammoList.Rifle) {
                items[id]._props.StackMaxSize = this.configManager.modConfig().AdvancedStackTuning.RifleStack;
            }
        }

        if (
            this.configManager.modConfig().BasicStackTuning.Enabled &&
            !this.configManager.modConfig().AdvancedStackTuning.Enabled
        ) {
            for (const id in items) {
                if (items[id]._parent === "5485a8684bdc2da71d8b4567" && items[id]._props.StackMaxSize !== undefined) {
                    items[id]._props.StackMaxSize *= this.configManager.modConfig().BasicStackTuning.StackMultiplier;
                }
            }
        }

        if (
            this.configManager.modConfig().BasicStackTuning.Enabled &&
            this.configManager.modConfig().AdvancedStackTuning.Enabled
        ) {
            this.logger.log(
                "Error multiplying your ammo stacks. Make sure you only have ONE of the Stack Tuning options enabled",
                LogTextColor.RED,
            );
        }

        if (this.configManager.modConfig().MoneyStackMultiplier.Enabled) {
            for (const id in items) {
                if (items[id]._parent === "543be5dd4bdc2deb348b4569" && items[id]._props.StackMaxSize !== undefined) {
                    items[id]._props.StackMaxSize *=
                        this.configManager.modConfig().MoneyStackMultiplier.MoneyMultiplier;
                }
            }
        }
    }

    public pushCustomWeaponsToBots(): void {
        const tables = this.databaseService.getTables();
        const bots = tables.bots.types;
        const botTypes = ["bear", "usec", "exusec", "pmcbot"];

        for (const bot in botTypes) {
            bots[bot].inventory.equipment.SecondPrimaryWeapon[CustomMap.Mcm4] = 5;
            bots[bot].inventory.equipment.SecondPrimaryWeapon[CustomMap.Aug762] = 5;
            bots[bot].inventory.equipment.SecondPrimaryWeapon[CustomMap.Stm46] = 5;
            bots[bot].inventory.mods[CustomMap.Mcm4] = {
                mod_charge: [
                    "5c0faf68d174af02a96260b8",
                    "56ea7165d2720b6e518b4583",
                    "55d44fd14bdc2d962f8b456e",
                    "5ea16d4d5aad6446a939753d",
                    "5bb20dbcd4351e44f824c04e",
                    "6033749e88382f4fab3fd2c5",
                    "5b2240bf5acfc40dc528af69",
                    "5d44334ba4b9362b346d1948",
                    "5f633ff5c444ce7e3c30a006",
                ],
                mod_magazine: [CustomMap.Mag300, CustomMap.Mag545, CustomMap.Mag57, CustomMap.Mag762, CustomMap.Mag939],
                mod_pistol_grip: [
                    "571659bb2459771fb2755a12",
                    "5bb20e0ed4351e3bac1212dc",
                    "5c0e2ff6d174af02a1659d4a",
                    "59db3a1d86f77429e05b4e92",
                    "6113c3586c780c1e710c90bc",
                    "6113cc78d3a39d50044c065a",
                ],
                mod_reciever: [CustomMap.Rec300, CustomMap.Rec545, CustomMap.Rec57, CustomMap.Rec762, CustomMap.Rec939],
                mod_stock: [
                    "5649be884bdc2d79388b4577",
                    "5d120a10d7ad1a4e1026ba85",
                    "5c793fc42e221600114ca25d",
                    "5b0800175acfc400153aebd4",
                    "5a33ca0fc4a282000d72292f",
                    "5c0faeddd174af02a962601f",
                    "5947e98b86f774778f1448bc",
                    "5947eab886f77475961d96c5",
                    "602e3f1254072b51b239f713",
                    "5c793fb92e221644f31bfb64",
                    "591aef7986f774139d495f03",
                    "591af10186f774139d495f0e",
                    "627254cc9c563e6e442c398f",
                ],
                patron_in_weapon: [
                    "5c0d5e4486f77478390952fe",
                    "61962b617c6c7b169525f168",
                    "56dfef82d2720bbd668b4567",
                    "56dff026d2720bb8668b4567",
                    "56dff061d2720bb5668b4567",
                    "56dff0bed2720bb0668b4567",
                    "56dff216d2720bbd668b4568",
                    "56dff2ced2720bb4668b4567",
                    "56dff338d2720bbd668b4569",
                    "56dff3afd2720bba668b4567",
                    "56dff421d2720b5f5a8b4567",
                    "56dff4a2d2720bbd668b456a",
                    "56dff4ecd2720b5f5a8b4568",
                    "59e6920f86f77411d82aa167",
                    "59e6927d86f77411da468256",
                    "54527a984bdc2d4e668b4567",
                    "54527ac44bdc2d36668b4567",
                    "59e68f6f86f7746c9f75e846",
                    "59e6906286f7746c9f75e847",
                    "59e690b686f7746c9f75e848",
                    "59e6918f86f7746c9f75e849",
                    "60194943740c5d77f6705eea",
                    "601949593ae8f707c4608daa",
                    "5c0d5ae286f7741e46554302",
                    "5fbe3ffdf8b6a877a729ea82",
                    "5fd20ff893a8961fc660a954",
                    "619636be6db0f2477964e710",
                    "6196364158ef8c428c287d9f",
                    "6196365d58ef8c428c287da1",
                    "64b8725c4b75259c590fa899",
                    "59e0d99486f7744a32234762",
                    "59e4d3d286f774176a36250a",
                    "5656d7c34bdc2d9d198b4587",
                    "59e4cf5286f7741778269d8a",
                    "59e4d24686f7741776641ac7",
                    "601aa3d2b2bcb34913271e6d",
                    "64b7af5a8532cf95ee0a0dbd",
                    "64b7af434b75259c590fa893",
                    "64b7af734b75259c590fa895",
                    "5c0d688c86f77413ae3407b2",
                    "61962d879bb3d20b0946d385",
                    "57a0dfb82459774d3078b56c",
                    "57a0e5022459774d1673f889",
                    "5c0d668f86f7747ccb7f13b2",
                    "6576f96220d53a5b8f3e395e",
                    "5cc80f53e4a949000e1ea4f8",
                    "5cc86832d7f00c000d3a6e6c",
                    "5cc86840d7f00c002412c56c",
                    "5cc80f67e4a949035e43bbba",
                    "5cc80f38e4a949001152b560",
                    "5cc80f8fe4a949033b0224a2",
                    "5cc80f79e4a949033c7343b2",
                ],
            };
            bots[bot].inventory.mods["5c793fc42e221600114ca25d"] = {
                mod_stock_000: ["5fce16961f152d4312622bc9", "5fc2369685fd526b824a5713", "5fce16961f152d4312622bc9"],
            };
            bots[bot].inventory.mods["5a33ca0fc4a282000d72292f"] = {
                mod_stock: ["5a33cae9c4a28232980eb086", "5d44069ca4b9361ebd26fc37", "5d4406a8a4b9361e4f6eb8b7"],
            };
            bots[bot].inventory.mods["5c0faeddd174af02a962601f"] = {
                mod_stock_000: ["5fc2369685fd526b824a5713"],
            };
            bots[bot].inventory.mods[CustomMap.Rec300] = {
                mod_barrel: [
                    "55d35ee94bdc2d61338b4568",
                    "55d3632e4bdc2d972f8b4569",
                    "5d440b93a4b9364276578d4b",
                    "5d440b9fa4b93601354d480c",
                    "5c0e2f94d174af029f650d56",
                ],
                mod_handguard: ["619b5db699fb192e7430664f"],
                mod_scope: ["570fd79bd2720bc7458b4583"],
                mod_sight_rear: ["5bb20e49d4351e3bac1212de"],
            };
            bots[bot].inventory.mods[CustomMap.Rec545] = {
                mod_barrel: [
                    "55d35ee94bdc2d61338b4568",
                    "55d3632e4bdc2d972f8b4569",
                    "5d440b93a4b9364276578d4b",
                    "5d440b9fa4b93601354d480c",
                    "5c0e2f94d174af029f650d56",
                ],
                mod_handguard: ["619b5db699fb192e7430664f"],
                mod_scope: ["570fd79bd2720bc7458b4583"],
                mod_sight_rear: ["5bb20e49d4351e3bac1212de"],
            };
            bots[bot].inventory.mods[CustomMap.Rec57] = {
                mod_barrel: [
                    "55d35ee94bdc2d61338b4568",
                    "55d3632e4bdc2d972f8b4569",
                    "5d440b93a4b9364276578d4b",
                    "5d440b9fa4b93601354d480c",
                    "5c0e2f94d174af029f650d56",
                ],
                mod_handguard: ["619b5db699fb192e7430664f"],
                mod_scope: ["570fd79bd2720bc7458b4583"],
                mod_sight_rear: ["5bb20e49d4351e3bac1212de"],
            };
            bots[bot].inventory.mods[CustomMap.Rec762] = {
                mod_barrel: [
                    "55d35ee94bdc2d61338b4568",
                    "55d3632e4bdc2d972f8b4569",
                    "5d440b93a4b9364276578d4b",
                    "5d440b9fa4b93601354d480c",
                    "5c0e2f94d174af029f650d56",
                ],
                mod_handguard: ["619b5db699fb192e7430664f"],
                mod_scope: ["570fd79bd2720bc7458b4583"],
                mod_sight_rear: ["5bb20e49d4351e3bac1212de"],
            };
            bots[bot].inventory.mods[CustomMap.Rec939] = {
                mod_barrel: [
                    "55d35ee94bdc2d61338b4568",
                    "55d3632e4bdc2d972f8b4569",
                    "5d440b93a4b9364276578d4b",
                    "5d440b9fa4b93601354d480c",
                    "5c0e2f94d174af029f650d56",
                ],
                mod_handguard: ["619b5db699fb192e7430664f"],
                mod_scope: ["570fd79bd2720bc7458b4583"],
                mod_sight_rear: ["5bb20e49d4351e3bac1212de"],
            };
            bots[bot].inventory.mods["5d440b93a4b9364276578d4b"] = {
                mod_gas_block: [
                    "5ae30e795acfc408fb139a0b",
                    "56eabcd4d2720b66698b4574",
                    "5d00ec68d7ad1a04a067e5be",
                    "56ea8d2fd2720b7c698b4570",
                ],
                mod_muzzle: ["5b3a16655acfc40016387a2a"],
            };
            bots[bot].inventory.mods["5d440b9fa4b93601354d480c"] = {
                mod_gas_block: ["56eabcd4d2720b66698b4574", "5d00ec68d7ad1a04a067e5be", "56ea8d2fd2720b7c698b4570"],
                mod_muzzle: ["5c7e5f112e221600106f4ede", "5c0fafb6d174af02a96260ba", "5cc9b815d7f00c000e2579d6"],
            };
            bots[bot].inventory.mods["5c0e2f94d174af029f650d56"] = {
                mod_gas_block: [
                    "56eabcd4d2720b66698b4574",
                    "5d00ec68d7ad1a04a067e5be",
                    "56ea8d2fd2720b7c698b4570",
                    "5ae30e795acfc408fb139a0b",
                    "63d3ce281fe77d0f2801859e",
                ],
                mod_muzzle: [
                    "5c0fafb6d174af02a96260ba",
                    "5c6d710d2e22165df16b81e7",
                    "5c48a2a42e221602b66d1e07",
                    "5cf6937cd7f00c056c53fb39",
                    "5a7c147ce899ef00150bd8b8",
                ],
            };
            bots[bot].inventory.mods[CustomMap.Aug762] = {
                mod_magazine: [CustomMap.Aug30Rd, CustomMap.Aug42Rd],
                mod_charge: ["62e7c880f68e7a0676050c7c", "62ebbc53e3c1e1ec7c02c44f"],
                mod_reciever: ["62e7c72df68e7a0676050c77", "62ea7c793043d74a0306e19f", "67110d8d388bded67304ceb4"],
            };
            bots[bot].inventory.mods["62e7c72df68e7a0676050c77"] = {
                mod_barrel: ["62e7c7f3c34ea971710c32fc", "630e39c3bd357927e4007c15", "6333f05d1bc0e6217a0e9d34"],
                mod_mount: ["62e7c8f91cd3fde4d503d690", "62ebba1fb658e07ef9082b5a", "62ebd290c427473eff0baafb"],
                mod_tactical: [
                    "5a800961159bd4315e3a1657",
                    "57fd23e32459772d0805bcf1",
                    "626becf9582c3e319310b837",
                    "5cc9c20cd7f00c001336c65d",
                    "6272370ee4013c5d7e31f418",
                    "6272379924e29f06af4d5ecb",
                    "5d2369418abbc306c62e0c80",
                    "5b07dd285acfc4001754240d",
                ],
            };
            bots[bot].inventory.mods["62ea7c793043d74a0306e19f"] = {
                mod_barrel: ["62e7c7f3c34ea971710c32fc", "630e39c3bd357927e4007c15", "6333f05d1bc0e6217a0e9d34"],
            };
            bots[bot].inventory.mods["62e7c7f3c34ea971710c32fc"] = {
                mod_foregrip: ["634e61b0767cb15c4601a877"],
                mod_muzzle_000: [
                    "630f2872911356c17d06abc5",
                    "630f28f0cadb1fe05e06f004",
                    "630f291b9f66a28b37094bb8",
                    "630f27f04f3f6281050b94d7",
                    "634eba08f69c710e0108d386",
                ],
                mod_muzzle_001: ["630f2982cdb9e392db0cbcc7"],
            };
            bots[bot].inventory.mods["630e39c3bd357927e4007c15"] = {
                mod_foregrip: ["634e61b0767cb15c4601a877"],
                mod_muzzle: [
                    "630f2872911356c17d06abc5",
                    "630f28f0cadb1fe05e06f004",
                    "630f291b9f66a28b37094bb8",
                    "630f27f04f3f6281050b94d7",
                    "634eba08f69c710e0108d386",
                ],
            };
            bots[bot].inventory.mods["6333f05d1bc0e6217a0e9d34"] = {
                mod_foregrip: ["634e61b0767cb15c4601a877"],
                mod_muzzle: [
                    "630f2872911356c17d06abc5",
                    "630f28f0cadb1fe05e06f004",
                    "630f291b9f66a28b37094bb8",
                    "630f27f04f3f6281050b94d7",
                    "634eba08f69c710e0108d386",
                ],
            };
            bots[bot].inventory.mods[CustomMap.Stm46] = {
                mod_charge: ["6033749e88382f4fab3fd2c5"],
                mod_magazine: [CustomMap.Stm33Rd, CustomMap.Stm50Rd],
                mod_pistol_grip: ["602e71bd53a60014f9705bfa", "5cc9bcaed7f00c011c04e179"],
                mod_reciever: [CustomMap.StmRec],
                mod_stock_001: ["602e3f1254072b51b239f713", "591aef7986f774139d495f03"],
                mod_tactical_000: ["602f85fd9b513876d4338d9c", "60338ff388382f4fab3fd2c8"],
                patron_in_weapon: [
                    "5ba26812d4351e003201fef1",
                    "5ba26835d4351e0035628ff5",
                    "5ba2678ad4351e44f824b344",
                    "5ba26844d4351e00334c9475",
                    "64b6979341772715af0f9c39",
                ],
            };
            bots[bot].inventory.mods[CustomMap.StmRec] = {
                mod_barrel: [
                    "603372b4da11d6478d5a07ff",
                    "603372f153a60014f970616d",
                    "603372d154072b51b239f9e1",
                    "603373004e02ce1eaa358814",
                ],
                mod_handguard: ["6034e3cb0ddce744014cb870"],
                mod_scope: ["584924ec24597768f12ae244", "5d2da1e948f035477b1ce2ba"],
                mod_sight_rear: ["5fb6564947ce63734e3fa1da", "5bc09a18d4351e003562b68e"],
            };
            bots[bot].inventory.mods["603372b4da11d6478d5a07ff"] = {
                mod_muzzle: ["60337f5dce399e10262255d1", "5a32a064c4a28200741e22de"],
            };
            bots[bot].inventory.mods["603372f153a60014f970616d"] = {
                mod_muzzle: ["5c6165902e22160010261b28"],
            };
            bots[bot].inventory.mods["603372d154072b51b239f9e1"] = {
                mod_muzzle: ["5fbbc3324e8a554c40648348"],
            };
            bots[bot].inventory.mods["603373004e02ce1eaa358814"] = {
                mod_muzzle: ["5a9fb739a2750c003215717f"],
            };
            bots[bot].inventory.mods["6034e3cb0ddce744014cb870"] = {
                mod_foregrip: ["5b7be4895acfc400170e2dd5", "57cffce524597763b31685d8"],
                mod_mount_000: ["5b7be47f5acfc400170e2dd2"],
                mod_mount_001: ["5b7be47f5acfc400170e2dd2"],
                mod_sight_front: ["5fb6567747ce63734e3fa1dc", "5bc09a30d4351e00367fb7c8", "5fc0fa362770a0045c59c677"],
                mod_tactical: ["5649a2464bdc2d91118b45a8"],
            };
            bots[bot].inventory.mods["602e3f1254072b51b239f713"] = {
                mod_stock_000: ["602e620f9b513876d4338d9a", "58d2946386f774496974c37e", "58d2946c86f7744e271174b5"],
            };

            this.customItem.addCustomWeaponToPMCs(CustomMap.Mcm4, 2, "FirstPrimaryWeapon");
            this.customItem.addCustomWeaponToPMCs(CustomMap.Aug762, 2, "FirstPrimaryWeapon");
            this.customItem.addCustomWeaponToPMCs(CustomMap.Stm46, 2, "FirstPrimaryWeapon");
        }
        tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[0]._props.filters[0].Filter.push(
            CustomMap.Mcm4,
        );
        tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[0]._props.filters[0].Filter.push(
            CustomMap.Aug762,
        );
        tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[0]._props.filters[0].Filter.push(
            CustomMap.Stm46,
        );
        tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[1]._props.filters[0].Filter.push(
            CustomMap.Mcm4,
        );
        tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[1]._props.filters[0].Filter.push(
            CustomMap.Aug762,
        );
        tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[1]._props.filters[0].Filter.push(
            CustomMap.Stm46,
        );
    }
}
