import { Item } from "@spt/models/eft/common/tables/IItem";

//#region Enums
export enum Currency {
    Roubles = "5449016a4bdc2d6f028b456f",
    Dollars = "5696686a4bdc2da3298b456a",
    Euros = "569668774bdc2da2298b4568",
    ReqSlips = "668b3c71042c73c6f9b00704",
    ReqForms = "66292e79a4d9da25e683ab55",
}

export enum AllBots {
    ArenaFighter = "arenafighter",
    ArenaFighterEvent = "arenafighterevent",
    Assault = "assault",
    Bear = "bear",
    Reshala = "bossbully",
    Gluhar = "bossgluhar",
    Killa = "bosskilla",
    Knight = "bossknight",
    Shturman = "bosskojaniy",
    //Legion = "bosslegion",
    Sanitar = "bosssanitar",
    Tagilla = "bosstagilla",
    Zryachiy = "bosszryachiy",
    CrazyAssaultEvent = "crazyassaultevent",
    CursedAssault = "cursedassault",
    Rogue = "exusec",
    Bigpipe = "followerbigpipe",
    Birdeye = "followerbirdeye",
    FollowerBully = "followerbully",
    FollowerGluharAssault = "followergluharassault",
    FollowerGluharScout = "followergluharscout",
    FollowerGluharSecurity = "followergluharsecurity",
    FollowerGluharSnipe = "followergluharsnipe",
    FollowerKojaniy = "followerkojaniy",
    FollowerSanitar = "followersanitar",
    FollowerTagilla = "followertagilla",
    FollowerZryachiy = "followerzryachiy",
    Santa = "gifter",
    Sniper = "marksman",
    Raider = "pmcbot",
    Priest = "sectantpriest",
    Cultist = "sectantwarrior",
    Usec = "usec",
}
//#endregion
//
//
//
//#region Interfaces
export interface WeaponPreset {
    _id: string;
    _name: string;
    _parent: string;
    _items: Item[];
}

export interface ArmorPreset {
    _id: string;
    _name: string;
    _parent: string;
    _items: Item[];
}

export interface AssortTemplate {
    items: [
        {
            _id: string;
            _tpl: string;
            parentId: string;
            slotId: string;
            upd: {
                StackObjectsCount: number;
                UnlimitedCount: boolean;
            };
        },
    ];
    barter_scheme: {
        [itemid: string]: [
            [
                {
                    _tpl: string;
                    count: number;
                },
            ],
        ];
    };
    loyal_level_items: {
        [itemid: string]: number;
    };
}
//#endregion

export interface configFile {
    EnableCustomBoss: boolean;
    RemoveFromSwag: boolean;
    EnableCustomItems: boolean;
    EnableTimeChanges: boolean;
    EnableWatchAnimations: boolean;
    BackupProfile: boolean;
    Raid: {
        ReduceFoodAndHydroDegrade: {
            Enabled: boolean;
            EnergyDecay: number;
            HydroDecay: number;
        };
        SaveQuestItems: boolean;
        NoRunThrough: boolean;
        LootableMelee: boolean;
        LootableArmbands: boolean;
        EnableExtendedRaids: boolean;
        TimeLimit: number;
        HolsterAnything: boolean;
        LowerExamineTime: boolean;
        SpecialSlotChanges: boolean;
        ChangeAirdropValues: {
            Enabled: boolean;
            Customs: number;
            Woods: number;
            Lighthouse: number;
            Interchange: number;
            Shoreline: number;
            Reserve: number;
        };
    };
    PocketChanges: {
        Enabled: boolean;
        Pocket1: {
            Vertical: number;
            Horizontal: number;
        };
        Pocket2: {
            Vertical: number;
            Horizontal: number;
        };
        Pocket3: {
            Vertical: number;
            Horizontal: number;
        };
        Pocket4: {
            Vertical: number;
            Horizontal: number;
        };
    };
    WeightChanges: {
        Enabled: boolean;
        WeightMultiplier: number;
    };
    Trader: {
        DisableFleaBlacklist: boolean;
        LL1Items: boolean;
        RemoveFirRequirementsForQuests: boolean;
    };
    Insurance: {
        Enabled: boolean;
        PraporMinReturn: number;
        PraporMaxReturn: number;
        TherapistMinReturn: number;
        TherapistMaxReturn: number;
    };
    BasicStackTuning: {
        Enabled: boolean;
        StackMultiplier: number;
    };
    AdvancedStackTuning: {
        Enabled: boolean;
        ShotgunStack: number;
        FlaresAndUBGL: number;
        SniperStack: number;
        SMGStack: number;
        RifleStack: number;
    };
    MoneyStackMultiplier: {
        Enabled: boolean;
        MoneyMultiplier: number;
    };
    LootChanges: {
        EnableLootOptions: boolean;
        StaticLootMultiplier: number;
        LooseLootMultiplier: number;
        MarkedRoomLootMultiplier: number;
    };
    Events: {
        EnableWeatherOptions: boolean;
        AllSeasons: boolean;
        NoWinter: boolean;
        SeasonalProgression: boolean;
        WinterWonderland: boolean;
        RandomizedSeasonalEvents: boolean;
    };
    Debug: {
        ExtraLogging: boolean;
    };
}

export interface seasonalProgression {
    seasonsProgression: number;
}

export interface legionProgression {
    legionChance: number;
}
