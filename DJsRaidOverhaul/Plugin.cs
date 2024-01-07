using BepInEx;
using UnityEngine;
using BepInEx.Logging;
using BepInEx.Configuration;
using DJsRaidOverhaul.Patches;
using DJsRaidOverhaul.Controllers;
using DrakiaXYZ.VersionChecker;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace DJsRaidOverhaul
{
    [BepInPlugin("DJ.RaidOverhaul", "DJs Raid Overhaul", "1.2.0")]

    public class Plugin : BaseUnityPlugin
    {
        internal static GameObject Hook;
        internal static EventController ECScript;
        internal static DoorController DCScript;
        internal static ManualLogSource logger;
        internal static BodyCleanup BCScript;

        internal static ConfigEntry<bool> DropBackPack;
        internal static ConfigEntry<bool> EnableClean;
        internal static ConfigEntry<int> TimeToClean;
        internal static ConfigEntry<int> DistToClean;
        internal static ConfigEntry<float> DropBackPackChance;

        internal static ConfigEntry<bool> Deafness;
        private static ConfigEntry<float> EffectStrength;

        internal static ConfigEntry<bool> EnableEvents;
        internal static ConfigEntry<bool> EnableDoorEvents;
        internal static ConfigEntry<int> EventRangeMin;
        internal static ConfigEntry<int> EventRangeMax;
        internal static ConfigEntry<int> DoorRangeMin;
        internal static ConfigEntry<int> DoorRangeMax;
        internal static ConfigEntry<bool> NoJokesHere;
        internal static ConfigEntry<bool> DisableBlackout;
        internal static ConfigEntry<bool> DisableArmorRepair;
        internal static ConfigEntry<bool> DisableHeal;
        internal static ConfigEntry<bool> DisableAirdrop;

        internal static ConfigEntry<bool> ExtraLogging;

        internal static Dictionary<IAnimator, AnimatorOverrideController> Controllers;
        internal static Dictionary<string, int> SuitsLookup;
        internal static AnimationClip[] AnimationClips;

        public const int TarkovVersion = 26535;

        void Awake()
        {
            if (!VersionChecker.CheckEftVersion(Logger, Info, Config))
            {
                throw new Exception("Invalid EFT Version");
            }

            logger = Logger;
            Logger.LogInfo("Loading Raid Overhaul");
            Hook = new GameObject("Event Object");
            Hook = new GameObject("Door Object");
            ECScript = Hook.AddComponent<EventController>();
            DCScript = Hook.AddComponent<DoorController>();
            BCScript = Hook.AddComponent<BodyCleanup>();
            DontDestroyOnLoad(Hook);

            EnableEvents = Config.Bind(
                "1. Events",
                "Enable Dynamic Events",
                true,
                new ConfigDescription("Dictates whether the dynamic event timer should increment and allow events to run or not.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 11 }));

            EnableDoorEvents = Config.Bind(
                "1. Events",
                "Enable Dynamic Door Events",
                true,
                new ConfigDescription("Dictates whether the dynamic event timer should increment and allow door events to run or not.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 10 }));

            DoorRangeMax = Config.Bind(
               "1. Events",
               "Events timer range maximum",
               3,
               new ConfigDescription("The time is in minutes, cannot be lower than the minimum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 9 }));

            DoorRangeMin = Config.Bind(
               "1. Events",
               "Events timer range minimum",
               1,
               new ConfigDescription("The time is in minutes, cannot be higher than the maximum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 8 }));

            EventRangeMax = Config.Bind(
               "1. Events",
               "Random Events timer range maximum",
               30,
               new ConfigDescription("The time is in minutes, cannot be lower than the minimum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 7 }));

            EventRangeMin = Config.Bind(
               "1. Events",
               "Random Events timer range minimum",
               5,
               new ConfigDescription("The time is in minutes, cannot be higher than the maximum",
               new AcceptableValueRange<int>(1, 60),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 6 }));

            NoJokesHere = Config.Bind(
               "1. Events",
               "Disable Heart Attack",
                false,
                new ConfigDescription("Disables the heart attack event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));

            DisableBlackout = Config.Bind(
               "1. Events",
               "Disable Blackout",
                false,
                new ConfigDescription("Disables the blackout event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            DisableArmorRepair = Config.Bind(
               "1. Events",
               "Disable Armor Repair",
                false,
                new ConfigDescription("Disables the armor repair event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 3 }));

            DisableHeal = Config.Bind(
               "1. Events",
               "Disable Heal",
                false,
                new ConfigDescription("Disables the healing event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 4 }));

            DisableAirdrop = Config.Bind(
               "1. Events",
               "Disable Airdrop",
                false,
                new ConfigDescription("Disables the Airdrop event.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 5 }));


            EnableClean = Config.Bind(
                "2. Body Cleanup Configs",
                "Enable Clean",
                true,
                new ConfigDescription("Enable body cleanup?",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 3 }));

            TimeToClean = Config.Bind(
                "2. Body Cleanup Configs",
                "Time to Clean", 
                15,
                new ConfigDescription("Time to clean bodies. Calculated in minutes.",
                new AcceptableValueRange<int>(1, 60),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            DistToClean = Config.Bind(
                "2. Body Cleanup Configs", 
                "Distance to Clean.", 
                15,
                new ConfigDescription("How far away should bodies be for cleanup.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));


            DropBackPack = Config.Bind(
                "3. Backpack Drop Configs", 
                "Drop Backpack", 
                true,
                new ConfigDescription("Enable the dropping of backpacks on death or cleanup.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = true, Order = 2 }));

            DropBackPackChance = Config.Bind(
                "3. Backpack Drop Configs", 
                "Backpack Drop Chance", 
                0.3f,
                new ConfigDescription("Chance of dropping a backpack on kill or cleanup.",
                new AcceptableValueRange<float>(0f, 1f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 1 }));


            EffectStrength = Config.Bind(
                "4. Adrenaline", 
                "Effect Strength", 
                0f, 
                new ConfigDescription("Causes an adrenaline effect on hit. This is how strong the effect will be multiplied by, as a percent.", 
                new AcceptableValueRange<float>(0f, 100f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 1 }));


            Deafness = Config.Bind(
                "5. Deafness",
                "Enable",
                false,
                new ConfigDescription("Enable deafness changes. Make sure you have your ear protection on.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));

            ExtraLogging = Config.Bind(
                "6. Extra Logging",
                "Enable",
                false,
                new ConfigDescription("Enable extra notifications for debug purposes. Only really matters if you're testing shit lol.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 1 }));


            new OnDeadPatch().Enable();
            new GameWorldPatch().Enable();
            new UIPanelPatch().Enable();
            new TimerUIPatch().Enable();
            new EventExfilPatch().Enable();
            new WeatherControllerPatch().Enable();
            new GlobalsPatch().Enable();
            new WatchPatch().Enable();
            new EnableEntryPointPatch().Enable();
            new HitStaminaPatch().Enable();
            new DeafnessPatch().Enable();
            new GrenadeDeafnessPatch().Enable();
            new GamePlayerOwnerPatch().Enable();
            new GameWorldDisposePatch().Enable();
            // new FactoryTimePatch().Enable();
            // new AirdropBoxPatch().Enable();
            Controllers = new Dictionary<IAnimator, AnimatorOverrideController>();
            SuitsLookup = new Dictionary<string, int>
            {
                //bear
                {"5cc0858d14c02e000c6bea66", 0},
                {"5fce3e47fe40296c1d5fd784", 0},
                {"6377266693a3b4967208e42b", 0},
                {"5d1f565786f7743f8362bcd5", 0},
                {"5fce3e0cfe40296c1d5fd782", 0},
                {"5d1f566d86f7744bcd13459a", 0},
                {"5d1f568486f7744bca3f0b98", 0},
                {"5f5e401747344c2e4f6c42c5", 0},
                {"5d1f567786f7744bcc04874f", 0},
                {"5d1f564b86f7744bcb0acd16", 0},
                {"6295e698e9de5e7b3751c47a", 0},
                {"5e4bb31586f7740695730568", 0},
                {"5e9d9fa986f774054d6b89f2", 0},
                {"5df89f1f86f77412631087ea", 0},
                {"617bca4b4013b06b0b78df2a", 0},
                {"6033a31e9ec839204e6a2f3e", 0},
                
                //usec
                {"5cde95d97d6c8b647a3769b0", 1},
                {"5d1f56f186f7744bcb0acd1a", 0},
                {"637b945722e2a933ed0e33c8", 1},
                {"6033a35f80ae5e2f970ba6bb", 0},
                {"5fd3e9f71b735718c25cd9f8", 1},
                {"5d1f56c686f7744bcd13459c", 0},
                {"618109c96d7ca35d076b3363", 1},
                {"6295e8c3e08ed747e64aea00", 1},
                {"5d4da0cb86f77450fe0a6629", 0},
                {"5d1f56e486f7744bce0ee9ed", 0},
                {"5e9da17386f774054b6f79a3", 0},
                {"5d1f56ff86f7743f8362bcd7", 0},
                {"5d1f56a686f7744bce0ee9eb", 0},
                {"5fcf63da5c287f01f22bf245", 1},
                {"5e4bb35286f77406a511c9bc", 1},
                {"5f5e4075df4f3100376a8138", 1},
                
                //???
                {"5cdea33e7d6c8b0474535dac", 0}
                //default = 0
            };
            var directory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            AnimationClips = AssetBundle.LoadFromFile($"{directory}/bundles/watch animations.bundle").LoadAllAssets<AnimationClip>();
        }

        public static float GetStrength()
        {
            return EffectStrength.Value;
        }
    }
}