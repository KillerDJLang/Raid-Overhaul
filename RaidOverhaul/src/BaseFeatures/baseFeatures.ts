import type { IConfig } from "@spt/models/eft/common/IGlobals";
import type { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { Season } from "@spt/models/enums/Season";
import type { IAirdropConfig } from "@spt/models/spt/config/IAirdropConfig";
import type { ILocationConfig } from "@spt/models/spt/config/ILocationConfig";
import type { ILostOnDeathConfig } from "@spt/models/spt/config/ILostOnDeathConfig";
import type { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import type { IWeatherConfig } from "@spt/models/spt/config/IWeatherConfig";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

import { AllBots } from "../Utils/Enums";
import type { configFile } from "../Utils/Enums";
import type { Logger } from "../Utils/Logger";
import type { References } from "../Utils/References";
import type { Utils } from "../Utils/Utils";

const ammoList = require("../Utils/ArrayFiles/ammoStackList.json");
const globalPresets = require("../../db/Presets/Globals.json");
const modName = "Raid Overhaul";

import * as fs from "node:fs";
import * as path from "node:path";

export class Base {
    constructor(
        private utils: Utils,
        private ref: References,
        private logger: Logger,
    ) {}

    globals(): IConfig {
        return this.ref.tables.globals.config;
    }
    quests(): Record<string, IQuest> {
        return this.ref.tables.templates.quests;
    }

    //#region Raid Changes
    public raidChanges(modConfig: configFile): void {
        const questItems = this.ref.configServer.getConfig<ILostOnDeathConfig>(ConfigTypes.LOST_ON_DEATH);
        const airdropConfig = this.ref.configServer.getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);

        if (modConfig.Raid.EnableExtendedRaids) {
            for (const location in this.ref.tables.locations) {
                if (location === "base") continue;

                this.ref.tables.locations[location].base.EscapeTimeLimit = modConfig.Raid.TimeLimit * 60;
                this.ref.tables.locations[location].base.EscapeTimeLimitCoop = modConfig.Raid.TimeLimit * 60;
            }
        }

        if (modConfig.Raid.ReduceFoodAndHydroDegrade.Enabled) {
            this.globals().Health.Effects.Existence.EnergyDamage = modConfig.Raid.ReduceFoodAndHydroDegrade.EnergyDecay;
            this.globals().Health.Effects.Existence.HydrationDamage =
                modConfig.Raid.ReduceFoodAndHydroDegrade.HydroDecay;
        }

        if (modConfig.Raid.ChangeAirdropValues.Enabled) {
            airdropConfig.airdropChancePercent.bigmap = modConfig.Raid.ChangeAirdropValues.Customs;
            airdropConfig.airdropChancePercent.woods = modConfig.Raid.ChangeAirdropValues.Woods;
            airdropConfig.airdropChancePercent.lighthouse = modConfig.Raid.ChangeAirdropValues.Lighthouse;
            airdropConfig.airdropChancePercent.shoreline = modConfig.Raid.ChangeAirdropValues.Interchange;
            airdropConfig.airdropChancePercent.interchange = modConfig.Raid.ChangeAirdropValues.Shoreline;
            airdropConfig.airdropChancePercent.reserve = modConfig.Raid.ChangeAirdropValues.Reserve;
        }

        if (modConfig.Raid.SaveQuestItems) {
            questItems.questItems = false;
        }

        if (modConfig.Raid.NoRunThrough) {
            this.globals().exp.match_end.survived_exp_requirement = 0;
            this.globals().exp.match_end.survived_seconds_requirement = 0;
        }
    }
    //#endregion
    //
    //
    //
    //#region Weight Changes
    public weightChanges(modConfig: configFile): void {
        if (modConfig.WeightChanges.Enabled) {
            this.globals().Stamina.BaseOverweightLimits.x *= modConfig.WeightChanges.WeightMultiplier;
            this.globals().Stamina.BaseOverweightLimits.y *= modConfig.WeightChanges.WeightMultiplier;
            this.globals().Stamina.WalkOverweightLimits.x *= modConfig.WeightChanges.WeightMultiplier;
            this.globals().Stamina.WalkOverweightLimits.y *= modConfig.WeightChanges.WeightMultiplier;
            this.globals().Stamina.WalkSpeedOverweightLimits.x *= modConfig.WeightChanges.WeightMultiplier;
            this.globals().Stamina.WalkSpeedOverweightLimits.y *= modConfig.WeightChanges.WeightMultiplier;
            this.globals().Stamina.SprintOverweightLimits.x *= modConfig.WeightChanges.WeightMultiplier;
            this.globals().Stamina.SprintOverweightLimits.y *= modConfig.WeightChanges.WeightMultiplier;
        }
    }
    //#endregion
    //
    //
    //
    //#region Item Changes
    public itemChanges(modConfig: configFile): void {
        const handbookBase = this.ref.tables.templates.handbook;
        const fleaPrices = this.ref.tables.templates.prices;
        const presets = this.ref.tables.globals;
        const items = this.ref.tables.templates.items;
        const pockets = this.ref.tables.templates.items["627a4e6b255f7527fb05a0f6"];
        const uhPockets = this.ref.tables.templates.items["65e080be269cbd5c5005e529"];
        const whiteFlare = "62178be9d0050232da3485d9";

        for (const id in items) {
            const base = items[id];

            if (base._parent === "5447e1d04bdc2dff2f8b4567" && modConfig.Raid.LootableMelee) {
                items[id]._props.Unlootable = false;
                items[id]._props.UnlootableFromSide = [];
            }
        }

        for (const id in items) {
            const base = items[id];

            if (base._parent === "5b3f15d486f77432d0509248" && modConfig.Raid.LootableArmbands) {
                items[id]._props.Unlootable = false;
                items[id]._props.UnlootableFromSide = [];
            }
        }

        for (const id in items) {
            const base = items[id];

            if (base._props.BlocksEarpiece) {
                base._props.BlocksEarpiece = false;
            }
        }

        if (modConfig.PocketChanges.Enabled) {
            (pockets._props.Grids = [
                {
                    _id: this.ref.hashUtil.generate(),
                    _name: "pocket1",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: {
                        cellsH: modConfig.PocketChanges.Pocket1.Horizontal,
                        cellsV: modConfig.PocketChanges.Pocket1.Vertical,
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
                    _id: this.ref.hashUtil.generate(),
                    _name: "pocket2",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: {
                        cellsH: modConfig.PocketChanges.Pocket2.Horizontal,
                        cellsV: modConfig.PocketChanges.Pocket2.Vertical,
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
                    _id: this.ref.hashUtil.generate(),
                    _name: "pocket3",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: {
                        cellsH: modConfig.PocketChanges.Pocket3.Horizontal,
                        cellsV: modConfig.PocketChanges.Pocket3.Vertical,
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
                    _id: this.ref.hashUtil.generate(),
                    _name: "pocket4",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: {
                        cellsH: modConfig.PocketChanges.Pocket4.Horizontal,
                        cellsV: modConfig.PocketChanges.Pocket4.Vertical,
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
                // biome-ignore lint/style/noCommaOperator: <explanation>
            ]),
                (uhPockets._props.Grids = [
                    {
                        _id: this.ref.hashUtil.generate(),
                        _name: "pocket1",
                        _parent: "627a4e6b255f7527fb05a0f6",
                        _props: {
                            cellsH: modConfig.PocketChanges.Pocket1.Horizontal,
                            cellsV: modConfig.PocketChanges.Pocket1.Vertical,
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
                        _id: this.ref.hashUtil.generate(),
                        _name: "pocket2",
                        _parent: "627a4e6b255f7527fb05a0f6",
                        _props: {
                            cellsH: modConfig.PocketChanges.Pocket2.Horizontal,
                            cellsV: modConfig.PocketChanges.Pocket2.Vertical,
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
                        _id: this.ref.hashUtil.generate(),
                        _name: "pocket3",
                        _parent: "627a4e6b255f7527fb05a0f6",
                        _props: {
                            cellsH: modConfig.PocketChanges.Pocket3.Horizontal,
                            cellsV: modConfig.PocketChanges.Pocket3.Vertical,
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
                        _id: this.ref.hashUtil.generate(),
                        _name: "pocket4",
                        _parent: "627a4e6b255f7527fb05a0f6",
                        _props: {
                            cellsH: modConfig.PocketChanges.Pocket4.Horizontal,
                            cellsV: modConfig.PocketChanges.Pocket4.Vertical,
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

        if (modConfig.Raid.SpecialSlotChanges) {
            pockets._props.Slots = [
                {
                    _id: this.ref.hashUtil.generate(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot1",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
                {
                    _id: this.ref.hashUtil.generate(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot2",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
                {
                    _id: this.ref.hashUtil.generate(),
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
                    _id: this.ref.hashUtil.generate(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot1",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
                {
                    _id: this.ref.hashUtil.generate(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot2",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
                {
                    _id: this.ref.hashUtil.generate(),
                    _mergeSlotWithChildren: false,
                    _name: "SpecialSlot3",
                    _parent: "627a4e6b255f7527fb05a0f6",
                    _props: { filters: [{ Filter: ["54009119af1c881c07000029"] }] },
                    _proto: "55d721144bdc2d89028b456f",
                    _required: false,
                },
            ];
            this.utils.stopHurtingMeSVM("627a4e6b255f7527fb05a0f6");
            this.utils.stopHurtingMeSVM("65e080be269cbd5c5005e529");
        }

        if (modConfig.EnableCustomItems) {
            for (const itemPreset in globalPresets.ItemPresets) {
                presets.ItemPresets[itemPreset] = globalPresets.ItemPresets[itemPreset];
            }
        }

        if (modConfig.Raid.HolsterAnything) {
            const inventory = items["55d7217a4bdc2d86028b456d"];
            const holster = inventory._props.Slots[2];

            holster._props.filters[0].Filter.push("5422acb9af1c889c16000029");
        }

        if (modConfig.Raid.LowerExamineTime) {
            for (const id in items) {
                items[id]._props.ExamineTime = 0.1;
            }
        }

        for (const flare in handbookBase.Items) {
            if (handbookBase.Items[flare].Id === whiteFlare) {
                handbookBase.Items[flare].Price = 89999;
            }
        }
        fleaPrices[whiteFlare] = 97388 + this.ref.randomUtil.getInt(500, 53000);

        for (const botId in this.ref.tables.bots.types) {
            const botType = AllBots[botId];

            if (botType) {
                for (const lootSlot in this.ref.tables.bots.types[botId].inventory.items) {
                    const items = this.ref.tables.bots.types[botId].inventory.items;

                    if (items[lootSlot]["5c94bbff86f7747ee735c08f"] !== undefined) {
                        const weight = items[lootSlot]["5c94bbff86f7747ee735c08f"];
                        items[lootSlot]["668b3c71042c73c6f9b00704"] = weight;
                    }
                }
            }
        }

        for (const botId in this.ref.tables.bots.types) {
            const botType = AllBots[botId];

            if (botType) {
                for (const lootSlot in this.ref.tables.bots.types[botId].inventory.items) {
                    const items = this.ref.tables.bots.types[botId].inventory.items;

                    if (items[lootSlot]["573475fb24597737fb1379e1"] !== undefined) {
                        const weight = items[lootSlot]["573475fb24597737fb1379e1"];
                        items[lootSlot]["66292e79a4d9da25e683ab55"] = weight;
                    }
                }
            }
        }

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
    //#endregion
    //
    //
    //
    //#region Trader/Insurance
    public traderTweaks(modConfig: configFile): void {
        const traders = this.ref.tables.traders;
        const ragfair = this.ref.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        if (modConfig.Insurance.Enabled) {
            traders["54cb50c76803fa8b248b4571"].base.insurance.min_return_hour = modConfig.Insurance.PraporMinReturn;
            traders["54cb50c76803fa8b248b4571"].base.insurance.max_return_hour = modConfig.Insurance.PraporMaxReturn;
            traders["54cb57776803fa99248b456e"].base.insurance.min_return_hour = modConfig.Insurance.TherapistMinReturn;
            traders["54cb57776803fa99248b456e"].base.insurance.max_return_hour = modConfig.Insurance.TherapistMaxReturn;
        }
        modConfig.Trader.LL1Items;
        if (modConfig.Trader.LL1Items) {
            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
            for (const item in this.ref.tables.traders["Requisitions"].assort.loyal_level_items) {
                // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                this.ref.tables.traders["Requisitions"].assort.loyal_level_items[item] = 1;
            }
        }

        if (modConfig.Trader.DisableFleaBlacklist) {
            ragfair.dynamic.blacklist.enableBsgList = false;
        }

        if (modConfig.Trader.RemoveFirRequirementsForQuests) {
            for (const q in this.quests()) {
                const quest = this.quests()[q];
                if (quest?.conditions?.AvailableForFinish) {
                    const availableForFinish = quest.conditions.AvailableForFinish;
                    for (const requirement in availableForFinish) {
                        if (availableForFinish[requirement].onlyFoundInRaid) {
                            availableForFinish[requirement].onlyFoundInRaid = false;
                        }
                    }
                }
            }
        }
    }
    //#endregion
    //
    //
    //
    //#region Stack Tuning
    public stackChanges(modConfig: configFile): void {
        const items = this.ref.tables.templates.items;

        if (modConfig.AdvancedStackTuning.Enabled && !modConfig.BasicStackTuning.Enabled) {
            for (const id of ammoList.Shotgun) {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.ShotgunStack;
            }

            for (const id of ammoList.UBGL) {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.FlaresAndUBGL;
            }

            for (const id of ammoList.Sniper) {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.SniperStack;
            }

            for (const id of ammoList.SMG) {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.SMGStack;
            }

            for (const id of ammoList.Rifle) {
                items[id]._props.StackMaxSize = modConfig.AdvancedStackTuning.RifleStack;
            }
        }

        if (modConfig.BasicStackTuning.Enabled && !modConfig.AdvancedStackTuning.Enabled) {
            for (const id in items) {
                if (items[id]._parent === "5485a8684bdc2da71d8b4567" && items[id]._props.StackMaxSize !== undefined) {
                    items[id]._props.StackMaxSize *= modConfig.BasicStackTuning.StackMultiplier;
                }
            }
        }

        if (modConfig.BasicStackTuning.Enabled && modConfig.AdvancedStackTuning.Enabled) {
            this.logger.log(
                "Error multiplying your ammo stacks. Make sure you only have ONE of the Stack Tuning options enabled",
                LogTextColor.RED,
            );
        }

        if (modConfig.MoneyStackMultiplier.Enabled) {
            for (const id in items) {
                if (items[id]._parent === "543be5dd4bdc2deb348b4569" && items[id]._props.StackMaxSize !== undefined) {
                    items[id]._props.StackMaxSize *= modConfig.MoneyStackMultiplier.MoneyMultiplier;
                }
            }
        }
    }
    //#endregion
    //
    //
    //
    //#region Loot
    public lootChanges(modConfig: configFile): void {
        const maps = this.ref.configServer.getConfig<ILocationConfig>(ConfigTypes.LOCATION);
        const markedRoomCustoms = this.ref.tables.locations.bigmap.looseLoot.spawnpoints;
        const markedRoomReserve = this.ref.tables.locations.rezervbase.looseLoot.spawnpoints;
        const markedRoomStreets = this.ref.tables.locations.tarkovstreets.looseLoot.spawnpoints;
        const markedRoomLighthouse = this.ref.tables.locations.lighthouse.looseLoot.spawnpoints;

        if (modConfig.LootChanges.EnableLootOptions) {
            maps.looseLootMultiplier.bigmap = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.factory4_day = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.factory4_night = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.interchange = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.laboratory = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.rezervbase = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.shoreline = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.woods = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.lighthouse = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.tarkovstreets = modConfig.LootChanges.LooseLootMultiplier;
            maps.looseLootMultiplier.sandbox = modConfig.LootChanges.LooseLootMultiplier;

            maps.staticLootMultiplier.bigmap = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.factory4_day = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.factory4_night = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.interchange = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.laboratory = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.rezervbase = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.shoreline = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.woods = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.lighthouse = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.tarkovstreets = modConfig.LootChanges.StaticLootMultiplier;
            maps.staticLootMultiplier.sandbox = modConfig.LootChanges.StaticLootMultiplier;
        }

        for (const cSP of markedRoomCustoms) {
            if (
                cSP.template.Position.x > 180 &&
                cSP.template.Position.x < 185 &&
                cSP.template.Position.z > 180 &&
                cSP.template.Position.z < 185 &&
                cSP.template.Position.y > 6 &&
                cSP.template.Position.y < 7
            ) {
                cSP.probability *= modConfig.LootChanges.MarkedRoomLootMultiplier;
            }
        }

        for (const rSP of markedRoomReserve) {
            if (
                rSP.template.Position.x > -125 &&
                rSP.template.Position.x < -120 &&
                rSP.template.Position.z > 25 &&
                rSP.template.Position.z < 30 &&
                rSP.template.Position.y > -15 &&
                rSP.template.Position.y < -14
            ) {
                rSP.probability *= modConfig.LootChanges.MarkedRoomLootMultiplier;
            } else if (
                rSP.template.Position.x > -155 &&
                rSP.template.Position.x < -150 &&
                rSP.template.Position.z > 70 &&
                rSP.template.Position.z < 75 &&
                rSP.template.Position.y > -9 &&
                rSP.template.Position.y < -8
            ) {
                rSP.probability *= modConfig.LootChanges.MarkedRoomLootMultiplier;
            } else if (
                rSP.template.Position.x > 190 &&
                rSP.template.Position.x < 195 &&
                rSP.template.Position.z > -230 &&
                rSP.template.Position.z < -225 &&
                rSP.template.Position.y > -6 &&
                rSP.template.Position.y < -5
            ) {
                rSP.probability *= modConfig.LootChanges.MarkedRoomLootMultiplier;
            }
        }

        for (const sSP of markedRoomStreets) {
            if (
                sSP.template.Position.x > -133 &&
                sSP.template.Position.x < -129 &&
                sSP.template.Position.z > 265 &&
                sSP.template.Position.z < 275 &&
                sSP.template.Position.y > 8.5 &&
                sSP.template.Position.y < 11
            ) {
                sSP.probability *= modConfig.LootChanges.MarkedRoomLootMultiplier;
            } else if (
                sSP.template.Position.x > 186 &&
                sSP.template.Position.x < 191 &&
                sSP.template.Position.z > 224 &&
                sSP.template.Position.z < 229 &&
                sSP.template.Position.y > -0.5 &&
                sSP.template.Position.y < 1.5
            ) {
                sSP.probability *= modConfig.LootChanges.MarkedRoomLootMultiplier;
            }
        }

        for (const lSP of markedRoomStreets) {
            if (
                lSP.template.Position.x > 319 &&
                lSP.template.Position.x < 330 &&
                lSP.template.Position.z > 482 &&
                lSP.template.Position.z < 489 &&
                lSP.template.Position.y > 5 &&
                lSP.template.Position.y < 6.5
            ) {
                lSP.probability *= modConfig.LootChanges.MarkedRoomLootMultiplier;
            }
        }
    }
    //#endregion
    //
    //
    //
    //#region Events
    public eventChanges(modConfig: configFile): void {
        const randomEventList = ["Halloween", "Christmas", "HalloweenIllumination"];

        const randomEvent = this.ref.randomUtil.drawRandomFromList(randomEventList, 1).toString();

        if (modConfig.Events.EnableWeatherOptions) {
            this.globals().EventType = [];
            this.globals().EventType = ["None"];

            if (modConfig.Events.RandomizedSeasonalEvents) {
                if (this.ref.probHelper.rollChance(15, 100)) {
                    this.globals().EventType.push(randomEvent);
                    this.logger.log(`${randomEvent} event has been loaded`, LogTextColor.MAGENTA);
                }
            }
        }
    }

    public weatherChangesAllSeasons(modConfig: configFile) {
        const weatherConfig: IWeatherConfig = this.ref.configServer.getConfig<IWeatherConfig>(ConfigTypes.WEATHER);

        if (
            modConfig.Events.AllSeasons &&
            !modConfig.Events.WinterWonderland &&
            !modConfig.Events.NoWinter &&
            !modConfig.Events.SeasonalProgression
        ) {
            const weatherChance = this.ref.randomUtil.getInt(1, 100);

            if (weatherChance >= 1 && weatherChance <= 20) {
                weatherConfig.overrideSeason = Season.SUMMER;
                this.logger.log("Summer is active.", LogTextColor.MAGENTA);

                return;
            }
            if (weatherChance >= 21 && weatherChance <= 40) {
                weatherConfig.overrideSeason = Season.AUTUMN;
                this.logger.log("Autumn is active.", LogTextColor.MAGENTA);

                return;
            }
            if (weatherChance >= 41 && weatherChance <= 60) {
                weatherConfig.overrideSeason = Season.WINTER;
                this.logger.log("Winter is coming.", LogTextColor.MAGENTA);

                return;
            }
            if (weatherChance >= 61 && weatherChance <= 80) {
                weatherConfig.overrideSeason = Season.SPRING;
                this.logger.log("Spring is active.", LogTextColor.MAGENTA);

                return;
            }
            if (weatherChance >= 81 && weatherChance <= 100) {
                weatherConfig.overrideSeason = Season.STORM;
                this.logger.log("Storm is active.", LogTextColor.MAGENTA);

                return;
            }
        }

        if (
            (modConfig.Events.AllSeasons && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.NoWinter && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.SeasonalProgression && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.NoWinter && modConfig.Events.SeasonalProgression) ||
            (modConfig.Events.NoWinter && modConfig.Events.AllSeasons) ||
            (modConfig.Events.SeasonalProgression && modConfig.Events.AllSeasons)
        ) {
            this.logger.log(
                "Error modifying your weather. Make sure you only have ONE of the weather options enabled",
                LogTextColor.RED,
            );

            return;
        }
    }

    public weatherChangesNoWinter(modConfig: configFile) {
        const weatherConfig: IWeatherConfig = this.ref.configServer.getConfig<IWeatherConfig>(ConfigTypes.WEATHER);

        if (
            modConfig.Events.NoWinter &&
            !modConfig.Events.WinterWonderland &&
            !modConfig.Events.AllSeasons &&
            !modConfig.Events.SeasonalProgression
        ) {
            const weatherChance = this.ref.randomUtil.getInt(1, 100);

            if (weatherChance >= 1 && weatherChance <= 25) {
                weatherConfig.overrideSeason = Season.SUMMER;
                this.logger.log("Summer is active.", LogTextColor.MAGENTA);

                return;
            }
            if (weatherChance >= 26 && weatherChance <= 50) {
                weatherConfig.overrideSeason = Season.AUTUMN;
                this.logger.log("Autumn is active.", LogTextColor.MAGENTA);

                return;
            }
            if (weatherChance >= 51 && weatherChance <= 75) {
                weatherConfig.overrideSeason = Season.SPRING;
                this.logger.log("Spring is active.", LogTextColor.MAGENTA);

                return;
            }
            if (weatherChance >= 76 && weatherChance <= 100) {
                weatherConfig.overrideSeason = Season.STORM;
                this.logger.log("Storm is active.", LogTextColor.MAGENTA);

                return;
            }
        }

        if (
            (modConfig.Events.AllSeasons && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.NoWinter && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.SeasonalProgression && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.NoWinter && modConfig.Events.SeasonalProgression) ||
            (modConfig.Events.NoWinter && modConfig.Events.AllSeasons) ||
            (modConfig.Events.SeasonalProgression && modConfig.Events.AllSeasons)
        ) {
            this.logger.log(
                "Error modifying your weather. Make sure you only have ONE of the weather options enabled",
                LogTextColor.RED,
            );

            return;
        }
    }

    public weatherChangesWinterWonderland(modConfig: configFile) {
        const weatherConfig: IWeatherConfig = this.ref.configServer.getConfig<IWeatherConfig>(ConfigTypes.WEATHER);

        if (
            modConfig.Events.WinterWonderland &&
            !modConfig.Events.AllSeasons &&
            !modConfig.Events.NoWinter &&
            !modConfig.Events.SeasonalProgression
        ) {
            weatherConfig.overrideSeason = Season.WINTER;
            this.logger.log(`Snow is active. It's a whole fuckin' winter wonderland out there.`, LogTextColor.MAGENTA);

            return;
        }

        if (
            (modConfig.Events.AllSeasons && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.NoWinter && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.SeasonalProgression && modConfig.Events.WinterWonderland) ||
            (modConfig.Events.NoWinter && modConfig.Events.SeasonalProgression) ||
            (modConfig.Events.NoWinter && modConfig.Events.AllSeasons) ||
            (modConfig.Events.SeasonalProgression && modConfig.Events.AllSeasons)
        ) {
            this.logger.log(
                "Error modifying your weather. Make sure you only have ONE of the weather options enabled",
                LogTextColor.RED,
            );

            return;
        }
    }

    public seasonProgression(modConfig: configFile) {
        const weatherConfig: IWeatherConfig = this.ref.configServer.getConfig<IWeatherConfig>(ConfigTypes.WEATHER);
        const seasonsProgression = require("../../config/SeasonsProgressionFile.json");
        const seasonsProgressionFile = path.join(__dirname, "../../config/SeasonsProgressionFile.json");
        let RaidsRun = seasonsProgression.seasonsProgression;

        if (RaidsRun > 0 && RaidsRun < 4) {
            RaidsRun++;

            weatherConfig.overrideSeason = Season.SPRING;
            seasonsProgression.seasonsProgression = RaidsRun;
            fs.writeFileSync(seasonsProgressionFile, JSON.stringify(seasonsProgression, null, 4));
            if (modConfig.Debug.ExtraLogging) {
                this.logger.log("Spring is active.", LogTextColor.MAGENTA);
            }

            return;
        }
        if (RaidsRun > 3 && RaidsRun < 7) {
            RaidsRun++;

            seasonsProgression.seasonsProgression = RaidsRun;
            fs.writeFileSync(seasonsProgressionFile, JSON.stringify(seasonsProgression, null, 4));
            if (modConfig.Debug.ExtraLogging) {
                this.logger.log("Storm is active.", LogTextColor.MAGENTA);
            }

            return;
        }
        if (RaidsRun > 6 && RaidsRun < 10) {
            RaidsRun++;

            weatherConfig.overrideSeason = Season.SUMMER;
            seasonsProgression.seasonsProgression = RaidsRun;
            fs.writeFileSync(seasonsProgressionFile, JSON.stringify(seasonsProgression, null, 4));
            if (modConfig.Debug.ExtraLogging) {
                this.logger.log("Summer is active.", LogTextColor.MAGENTA);
            }

            return;
        }
        if (RaidsRun > 9 && RaidsRun < 13) {
            RaidsRun++;

            weatherConfig.overrideSeason = Season.AUTUMN;
            seasonsProgression.seasonsProgression = RaidsRun;
            fs.writeFileSync(seasonsProgressionFile, JSON.stringify(seasonsProgression, null, 4));
            if (modConfig.Debug.ExtraLogging) {
                this.logger.log("Autumn is active.", LogTextColor.MAGENTA);
            }

            return;
        }
        if (RaidsRun > 12 && RaidsRun < 16) {
            RaidsRun++;

            weatherConfig.overrideSeason = Season.WINTER;
            seasonsProgression.seasonsProgression = RaidsRun;
            fs.writeFileSync(seasonsProgressionFile, JSON.stringify(seasonsProgression, null, 4));
            if (modConfig.Debug.ExtraLogging) {
                this.logger.log("Winter is coming.", LogTextColor.MAGENTA);
            }

            return;
        }
        if (RaidsRun > 15 || RaidsRun < 1) {
            RaidsRun = 1;

            seasonsProgression.seasonsProgression = RaidsRun;
            fs.writeFileSync(seasonsProgressionFile, JSON.stringify(seasonsProgression, null, 4));
            if (modConfig.Debug.ExtraLogging) {
                this.logger.log("Winter has passed.", LogTextColor.MAGENTA);
            }

            return;
        }
    }
    //#endregion
}
