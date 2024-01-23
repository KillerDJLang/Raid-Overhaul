using BepInEx.Configuration;

namespace DJsRaidOverhaul.Helpers
{
    // Not named Config because of an ambiguous reference
    public static class DJConfig
    {
        public static ConfigEntry<bool> DropBackPack;
        public static ConfigEntry<bool> EnableClean;
        public static ConfigEntry<int> TimeToClean;
        public static ConfigEntry<int> DistToClean;
        public static ConfigEntry<float> DropBackPackChance;

        public static ConfigEntry<bool> Deafness;
        public static ConfigEntry<float> EffectStrength;

        public static ConfigEntry<bool> TimeChanges;
        public static ConfigEntry<bool> EnableEvents;
        public static ConfigEntry<bool> EnableDoorEvents;
        public static ConfigEntry<bool> EnableRaidStartEvents;
        public static ConfigEntry<int> EventRangeMin;
        public static ConfigEntry<int> EventRangeMax;
        public static ConfigEntry<int> DoorRangeMin;
        public static ConfigEntry<int> DoorRangeMax;
        public static ConfigEntry<bool> NoJokesHere;
        public static ConfigEntry<bool> DisableBlackout;
        public static ConfigEntry<bool> DisableArmorRepair;
        public static ConfigEntry<bool> DisableHeal;
        public static ConfigEntry<bool> DisableAirdrop;
        public static ConfigEntry<bool> DisableSkill;
        public static ConfigEntry<bool> DisableMetabolism;
        public static ConfigEntry<bool> DisableTrader;

        public static ConfigEntry<bool> DebugLogging;

        public static void BindConfig(ConfigFile cfg)
        {
            #region Events

            TimeChanges = cfg.Bind(
                "1. Events",
                "Enable Time Changes",
                true,
                new ConfigDescription("Sets the in game time to your system time.\nThis requires a restart to take effect after enabling or disabling!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 17 }));

            EnableRaidStartEvents = cfg.Bind(
                "1. Events",
                "Enable Raid Start Events",
                true,
                new ConfigDescription("Dictates whether you allow the Door and Light randomization events to run on raid start or not.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 15 }));

            EnableEvents = cfg.Bind(
                "1. Events",
                "Enable Dynamic Events",
                true,
                new ConfigDescription("Dictates whether the dynamic event timer should increment and allow events to run or not.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 14 }));

            EnableDoorEvents = cfg.Bind(
                "1. Events",
                "Enable Dynamic Door Events",
                true,
                new ConfigDescription("Dictates whether the dynamic event timer should increment and allow door events to run or not.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 13 }));

            DoorRangeMax = cfg.Bind(
               "1. Events",
               "Door Events timer maximum range",
               3,
               new ConfigDescription("The time is in minutes, cannot be lower than the minimum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 12 }));

            DoorRangeMin = cfg.Bind(
               "1. Events",
               "Door Events timer minimum range",
               1,
               new ConfigDescription("The time is in minutes, cannot be higher than the maximum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 11 }));

            EventRangeMax = cfg.Bind(
               "1. Events",
               "Random Events timer maximum range",
               25,
               new ConfigDescription("The time is in minutes, cannot be lower than the minimum",
               new AcceptableValueRange<int>(0, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 10 }));

            EventRangeMin = cfg.Bind(
               "1. Events",
               "Random Events timer minimum range",
               5,
               new ConfigDescription("The time is in minutes, cannot be higher than the maximum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 9 }));

            DisableTrader = cfg.Bind(
               "1. Events",
               "Disable Trader Events",
                false,
                new ConfigDescription("Disables the Trader events.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 8 }));

            NoJokesHere = cfg.Bind(
               "1. Events",
               "Disable Heart Attack Event",
                false,
                new ConfigDescription("Disables the heart attack event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 7 }));

            DisableBlackout = cfg.Bind(
               "1. Events",
               "Disable Blackout Event",
                false,
                new ConfigDescription("Disables the blackout event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 6 }));

            DisableArmorRepair = cfg.Bind(
               "1. Events",
               "Disable Armor Repair Event",
                false,
                new ConfigDescription("Disables the armor repair event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 5 }));

            DisableHeal = cfg.Bind(
               "1. Events",
               "Disable Heal Event",
                false,
                new ConfigDescription("Disables the healing event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 4 }));

            DisableAirdrop = cfg.Bind(
               "1. Events",
               "Disable Airdrop Event",
                false,
                new ConfigDescription("Disables the Airdrop event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 3 }));
            
            DisableSkill = cfg.Bind(
               "1. Events",
               "Disable Skill Event",
                false,
                new ConfigDescription("Disables the Skill event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            DisableMetabolism = cfg.Bind(
               "1. Events",
               "Disable Metabolism Event",
                false,
                new ConfigDescription("Disables the Metabolism event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));

            #endregion

            #region Body Clean Up

            EnableClean = cfg.Bind(
                "2. Body Cleanup Configs",
                "Enable Clean",
                true,
                new ConfigDescription("Enable body cleanup?",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 3 }));

            TimeToClean = cfg.Bind(
                "2. Body Cleanup Configs",
                "Time to Clean",
                15,
                new ConfigDescription("Time to clean bodies. Calculated in minutes.",
                new AcceptableValueRange<int>(1, 60),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            DistToClean = cfg.Bind(
                "2. Body Cleanup Configs",
                "Distance to Clean",
                15,
                new ConfigDescription("How far away should bodies be for cleanup.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));

            #endregion

            #region Other

            DropBackPack = cfg.Bind(
                "3. Backpack Drop Configs",
                "Drop Backpack",
                true,
                new ConfigDescription("Enable the dropping of backpacks on death or cleanup.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = true, Order = 2 }));

            DropBackPackChance = cfg.Bind(
                "3. Backpack Drop Configs",
                "Backpack Drop Chance",
                0.3f,
                new ConfigDescription("Chance of dropping a backpack on kill or cleanup.",
                new AcceptableValueRange<float>(0f, 1f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 1 }));


            EffectStrength = cfg.Bind(
                "4. Adrenaline",
                "Effect Strength",
                0f,
                new ConfigDescription("Causes an adrenaline effect on hit. This is how strong the effect will be multiplied by, as a percent.",
                new AcceptableValueRange<float>(0f, 100f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 1 }));


            Deafness = cfg.Bind(
                "5. Deafness",
                "Enable",
                false,
                new ConfigDescription("Enable deafness changes. Make sure you have your ear protection on.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));


            DebugLogging = cfg.Bind(
                "6. Debug Logging",
                "Enable",
                false,
                new ConfigDescription("Enable extra notifications for debug purposes. Only really matters if you're testing shit lol.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 1 }));

            #endregion
        }
    }
}
