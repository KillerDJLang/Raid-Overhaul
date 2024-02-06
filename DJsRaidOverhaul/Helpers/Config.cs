using BepInEx.Configuration;

namespace DJsRaidOverhaul.Helpers
{
    public static class DJConfig
    {
        public static ConfigEntry<bool> DropBackPack;
        public static ConfigEntry<bool> EnableClean;
        public static ConfigEntry<int> TimeToClean;
        public static ConfigEntry<int> DistToClean;
        public static ConfigEntry<float> DropBackPackChance;

        public static ConfigEntry<bool> Deafness;
        public static ConfigEntry<float> EffectStrength;
        public static ConfigEntry<bool> EnableAdrenaline;

        public static ConfigEntry<bool> TimeChanges;
        public static ConfigEntry<bool> EnableEvents;
        public static ConfigEntry<bool> EnableDoorEvents;
        public static ConfigEntry<bool> EnableRaidStartEvents;
        public static ConfigEntry<int> EventRangeMin;
        public static ConfigEntry<int> EventRangeMax;
        public static ConfigEntry<int> DoorRangeMin;
        public static ConfigEntry<int> DoorRangeMax;

        public static ConfigEntry<bool> NoJokesHere;
        public static ConfigEntry<bool> Blackout;
        public static ConfigEntry<bool> ArmorRepair;
        public static ConfigEntry<bool> Heal;
        public static ConfigEntry<bool> Airdrop;
        public static ConfigEntry<bool> Skill;
        public static ConfigEntry<bool> Metabolism;
        public static ConfigEntry<bool> Malfunction;
        public static ConfigEntry<bool> Trader;
        public static ConfigEntry<bool> Berserk;
        public static ConfigEntry<bool> Overweight;
        public static ConfigEntry<bool> JokesAndFun;
        public static ConfigEntry<bool> ShoppingSpree;
        public static ConfigEntry<bool> ExfilLockdown;

        public static ConfigEntry<bool> PowerOn;
        public static ConfigEntry<bool> DoorUnlock;
        public static ConfigEntry<bool> KDoorUnlock;

        public static ConfigEntry<bool> DebugLogging;

        public static void BindConfig(ConfigFile cfg)
        {
            #region Core Events

            TimeChanges = cfg.Bind(
                "1. Core Events  (Changing Any Of The Event Sections Requires Restart)",
                "Time Changes",
                true,
                new ConfigDescription("Sets the in game time to your system time.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 8 }));

            EnableRaidStartEvents = cfg.Bind(
                "1. Core Events  (Changing Any Of The Event Sections Requires Restart)",
                "Raid Start Events",
                true,
                new ConfigDescription("Dictates whether you allow the Door and Light randomization events to run on raid start or not.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 7 }));

            EnableEvents = cfg.Bind(
                "1. Core Events  (Changing Any Of The Event Sections Requires Restart)",
                "Dynamic Events",
                true,
                new ConfigDescription("Dictates whether the dynamic event timer should increment and allow events to run or not.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 6 }));

            EnableDoorEvents = cfg.Bind(
                "1. Core Events  (Changing Any Of The Event Sections Requires Restart)",
                "Dynamic Door Events",
                true,
                new ConfigDescription("Dictates whether the dynamic event timer should increment and allow door events to run or not.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 5 }));

            DoorRangeMax = cfg.Bind(
               "1. Core Events  (Changing Any Of The Event Sections Requires Restart)",
               "Door Events timer maximum range",
               3,
               new ConfigDescription("The time is in minutes, cannot be lower than the minimum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 4 }));

            DoorRangeMin = cfg.Bind(
               "1. Core Events  (Changing Any Of The Event Sections Requires Restart)",
               "Door Events timer minimum range",
               1,
               new ConfigDescription("The time is in minutes, cannot be higher than the maximum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 3 }));

            EventRangeMax = cfg.Bind(
               "1. Core Events  (Changing Any Of The Event Sections Requires Restart)",
               "Random Events timer maximum range",
               25,
               new ConfigDescription("The time is in minutes, cannot be lower than the minimum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 2 }));

            EventRangeMin = cfg.Bind(
               "1. Core Events  (Changing Any Of The Event Sections Requires Restart)",
               "Random Events timer minimum range",
               5,
               new ConfigDescription("The time is in minutes, cannot be higher than the maximum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 1 }));

            #endregion

            #region Random Events

            ExfilLockdown = cfg.Bind(
               "2. Random Events",
               "Lockdown Event",
                true,
                new ConfigDescription("Disable/Enable the Extract Lockdown event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 14 }));

            ShoppingSpree = cfg.Bind(
               "2. Random Events",
               "Shopping Spree Event",
                true,
                new ConfigDescription("Disable/Enable the Shopping Spree event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 13 }));

            JokesAndFun = cfg.Bind(
               "2. Random Events",
               "Joke Event",
                true,
                new ConfigDescription("Disable/Enable the Joke event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 12 }));

            Overweight = cfg.Bind(
               "2. Random Events",
               "Overweight Event",
                true,
                new ConfigDescription("Disable/Enable the Overweight event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 11 }));

            Berserk = cfg.Bind(
               "2. Random Events",
               "Berserk Event",
                true,
                new ConfigDescription("Disable/Enable the Berserk event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 10 }));

            Trader = cfg.Bind(
               "2. Random Events",
               "Trader Events",
                true,
                new ConfigDescription("Disable/Enable the Trader events.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 9 }));

            Malfunction = cfg.Bind(
               "2. Random Events",
               "Malfunction Event",
                false,
                new ConfigDescription("Disable/Enable the Malfunction event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 8 }));

            NoJokesHere = cfg.Bind(
               "2. Random Events",
               "Heart Attack Event",
                false,
                new ConfigDescription("Disable/Enable the heart attack event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 7 }));

            Blackout = cfg.Bind(
               "2. Random Events",
               "Blackout Event",
                true,
                new ConfigDescription("Disable/Enable the blackout event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 6 }));

            ArmorRepair = cfg.Bind(
               "2. Random Events",
               "Armor Repair Event",
                true,
                new ConfigDescription("Disable/Enable the armor repair event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 5 }));

            Heal = cfg.Bind(
               "2. Random Events",
               "Heal Event",
                true,
                new ConfigDescription("Disable/Enable the healing event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 4 }));

            Airdrop = cfg.Bind(
               "2. Random Events",
               "Airdrop Event",
                true,
                new ConfigDescription("Disable/Enable the Airdrop event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 3 }));

            Skill = cfg.Bind(
               "2. Random Events",
               "Skill Event",
                true,
                new ConfigDescription("Disable/Enable the Skill event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            Metabolism = cfg.Bind(
               "2. Random Events",
               "Metabolism Event",
                true,
                new ConfigDescription("Disable/Enable the Metabolism event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));

            #endregion

            #region Door Events

            PowerOn = cfg.Bind(
                "3. Door Events",
                "Power On event",
                true,
                new ConfigDescription("Disable/Enable the event to turn on Power Switches at random throughout the raid.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 3 }));

            DoorUnlock = cfg.Bind(
                "3. Door Events",
                "Door Unlock event",
                true,
                new ConfigDescription("Disable/Enable the event to unlock Doors at random throughout the raid.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            KDoorUnlock = cfg.Bind(
                "3. Door Events",
                "Keycard Door Unlock event",
                true,
                new ConfigDescription("Disable/Enable the event to unlock Keycard Doors at random throughout the raid.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));

            #endregion

            #region Body Clean Up

            EnableClean = cfg.Bind(
                "4. Body Cleanup Configs",
                "Enable Clean",
                true,
                new ConfigDescription("Enable body cleanup event.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 3 }));

            TimeToClean = cfg.Bind(
                "4. Body Cleanup Configs",
                "Time to Clean",
                15,
                new ConfigDescription("The time to clean bodies calculated in minutes.",
                new AcceptableValueRange<int>(1, 60),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            DistToClean = cfg.Bind(
                "4. Body Cleanup Configs",
                "Distance to Clean",
                15,
                new ConfigDescription("How far away bodies should be for cleanup.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));

            #endregion

            #region Other

            DropBackPack = cfg.Bind(
                "5. Backpack Drop Configs",
                "Drop Backpack",
                true,
                new ConfigDescription("Enable the dropping of backpacks on death or cleanup.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = true, Order = 2 }));

            DropBackPackChance = cfg.Bind(
                "5. Backpack Drop Configs",
                "Backpack Drop Chance",
                0.3f,
                new ConfigDescription("Chance of dropping a backpack on kill or cleanup.",
                new AcceptableValueRange<float>(0f, 1f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 1 }));


            EnableAdrenaline = cfg.Bind(
                "6. Adrenaline",
                "Enable Adrenaline Effect",
                false,
                new ConfigDescription("Enables the adrenaline effect on hit. If enabled, modify the strength with the 'EffectStrength' option ",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            EffectStrength = cfg.Bind(
                "6. Adrenaline",
                "Effect Strength",
                30f,
                new ConfigDescription("Causes an adrenaline effect on hit. This is how strong the effect will be multiplied by, as a percent.",
                new AcceptableValueRange<float>(0f, 100f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 1 }));


            Deafness = cfg.Bind(
                "7. Deafness",
                "Enable",
                false,
                new ConfigDescription("Enable deafness changes. Make sure you have your ear protection on.\nThis requires a restart to take effect after enabling or disabling!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));


            DebugLogging = cfg.Bind(
                "8. Debug Logging",
                "Enable",
                false,
                new ConfigDescription("Enable extra notifications for debug purposes. Only really matters if you're testing shit lol.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 1 }));

            #endregion
        }
    }
}
