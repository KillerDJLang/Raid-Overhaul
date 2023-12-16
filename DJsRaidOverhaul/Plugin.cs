using BepInEx;
using UnityEngine;
using BepInEx.Logging;
using BepInEx.Configuration;
using DJsRaidOverhaul.Patches;

namespace DJsRaidOverhaul
{
    [BepInPlugin("DJ.RaidOverhaul", "DJs Raid Overhaul", "0.3.0")]
    public class Plugin : BaseUnityPlugin
    {
        internal static GameObject Hook;
        internal static IRController Script;
        internal static ManualLogSource logger;
        internal static ConfigEntry<bool> EnableEvents;
        internal static ConfigEntry<bool> EnablePowerChanges;
        internal static BodyCleanup BCScript;
        internal static ConfigEntry<bool> DropBackPack;
        internal static ConfigEntry<bool> EnableClean;
        internal static ConfigEntry<float> TimeToClean;
        internal static ConfigEntry<int> DistToClean;
        internal static ConfigEntry<float> DropBackPackChance;
        internal static ConfigEntry<bool> Deafness;
        internal static ConfigEntry<int> RandomRangeMin;
        internal static ConfigEntry<int> RandomRangeMax;
        internal static ConfigEntry<int> RandomDoorRangeMin;
        internal static ConfigEntry<int> RandomDoorRangeMax;
        private static ConfigEntry<float> EffectFactor;

        void Awake()
        {
            logger = Logger;
            Logger.LogInfo("Loading Raid Overhaul");
            Hook = new GameObject("IR Object");
            Script = Hook.AddComponent<IRController>();
            BCScript = Hook.AddComponent<BodyCleanup>();
            DontDestroyOnLoad(Hook);

            EnableEvents = Config.Bind(
                "1. Events",
                "Enable Dynamic Events",
                true,
                new ConfigDescription("Dictates whether the dynamic event timer should increment and allow events to run or not.\nNote that this DOES NOT stop events that are already running!",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));

            EnablePowerChanges = Config.Bind(
                "1. Events",
                "Enable Dynamic Power Changes",
                true,
                new ConfigDescription("If enabled, allows power to be turned on at a random point in your raids.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            RandomRangeMax = Config.Bind(
               "1. Events",
               "Random timer range maximum",
               30,
               new ConfigDescription("The time is in minutes, cannot be lower than the minimum",
               new AcceptableValueRange<int>(1, 30),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 3 }));

            RandomRangeMin = Config.Bind(
               "1. Events",
               "Random timer range minimum",
               5,
               new ConfigDescription("The time is in minutes, cannot be higher than the maximum",
               new AcceptableValueRange<int>(1, 30),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 4 }));

            RandomDoorRangeMax = Config.Bind(
               "1. Events",
               "Random Door timer range maximum",
               5,
               new ConfigDescription("The time is in minutes, cannot be lower than the minimum",
               new AcceptableValueRange<int>(1, 30),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 5 }));

            RandomDoorRangeMin = Config.Bind(
               "1. Events",
               "Random Door timer range minimum",
               1,
               new ConfigDescription("The time is in minutes, cannot be higher than the maximum",
               new AcceptableValueRange<int>(1, 30),
               new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 6 }));


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
                1800f,
                new ConfigDescription("Time to clean bodies. Calculated in seconds.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 2 }));

            DistToClean = Config.Bind(
                "2. Body Cleanup Configs", 
                "Distance to Clean.", 
                60,
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


            EffectFactor = Config.Bind(
                "4. Adrenaline", 
                "Effect Factor", 
                50f, 
                new ConfigDescription("Causes an adrenaline effect on hit. This is the factor to multiply the effect's strength by.", 
                new AcceptableValueRange<float>(0f, 100f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 1 }));


            Deafness = Config.Bind(
                "5. Deafness",
                "Enable",
                false,
                new ConfigDescription("Enable deafness changes. Make sure you have your ear protection on.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 1 }));


            new OnDeadPatch().Enable();
            new GameWorldPatch().Enable();
            new UIPanelPatch().Enable();
            new TimerUIPatch().Enable();
            new EventExfilPatch().Enable();
            new WeatherControllerPatch().Enable();
            new AirdropBoxPatch().Enable();
            new FactoryTimePatch().Enable();
            new GlobalsPatch().Enable();
            new WatchPatch().Enable();
            new EnableEntryPointPatch().Enable();
            new HitStaminaPatch().Enable();
            new DeafnessPatch().Enable();
            new GrenadeDeafnessPatch().Enable();
        }

        public static float GetFactor()
        {
            return EffectFactor.Value;
        }
    }
}