using BepInEx;
using UnityEngine;
using BepInEx.Logging;
using BepInEx.Configuration;
using EFT.Interactive;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using DJsRaidOverhaul.Patches;

namespace DJsRaidOverhaul
{
    [BepInPlugin("DJ.RaidOverhaul", "DJs Raid Overhaul", "1.0.0")]
    public class Plugin : BaseUnityPlugin
    {
        internal static GameObject Hook;
        internal static IRController Script;
        internal static ManualLogSource logger;
        internal static ConfigEntry<bool> EnableEvents;
        internal static BodyCleanup BCScript;

        internal static ConfigEntry<bool> DropBackPack;
        internal static ConfigEntry<bool> EnableClean;
        internal static ConfigEntry<float> TimeToClean;
        internal static ConfigEntry<int> DistToClean;
        internal static ConfigEntry<float> DropBackPackChance;
        public static ConfigEntry<int> PowerOnChanceC;
        public static ConfigEntry<int> PowerOnChanceI;
        public static ConfigEntry<int> PowerOnChanceR;

        private static ConfigEntry<float> factor;

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


            EnableClean = Config.Bind(
                "2. Body Cleanup Configs",
                "Enable Clean.",
                true,
                new ConfigDescription("Enable body cleanup?",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = false, Order = 1 }));

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
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = false, Order = 3 }));


            DropBackPack = Config.Bind(
                "3. Backpack Drop Configs", 
                "Drop Backpack", 
                true,
                new ConfigDescription("Enable the dropping of backpacks on death or cleanup.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = true, Order = 1 }));

            DropBackPackChance = Config.Bind(
                "3. Backpack Drop Configs", 
                "Backpack Drop Chance", 
                0.3f,
                new ConfigDescription("Chance of dropping a backpack on kill or cleanup.",
                new AcceptableValueRange<float>(0f, 1f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 2 }));


            factor = Config.Bind(
                "4. Adrenaline", 
                "Factor", 
                50f, 
                new ConfigDescription("The factor to multiply the effect's strength by.", 
                new AcceptableValueRange<float>(0f, 100f),
                new ConfigurationManagerAttributes { IsAdvanced = false, ShowRangeAsPercent = true, Order = 1 }));


            PowerOnChanceC = Config.Bind(
                "5. Power",
                "Power On Chance C",
                100,
                new ConfigDescription("The percent chance that power will be on at Raid Start. Default of 35.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = true, Order = 1 }));

            PowerOnChanceI = Config.Bind(
                "5. Power",
                "Power On Chance I",
                100,
                new ConfigDescription("The percent chance that power will be on at Raid Start. Default of 35.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = true, Order = 2 }));

            PowerOnChanceR = Config.Bind(
                "5. Power",
                "Power On Chance R",
                100,
                new ConfigDescription("The percent chance that power will be on at Raid Start. Default of 35.",
                null,
                new ConfigurationManagerAttributes { IsAdvanced = true, ShowRangeAsPercent = true, Order = 3 }));


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
        }

        public static float GetFactor()
        {
            return factor.Value;
        }

    }
    public static class ActivateSwitches
    {
        public static void Start()
        {
            List<EFT.Interactive.Switch> PowerSwitches = UnityEngine.Object.FindObjectsOfType<EFT.Interactive.Switch>().ToList();

            foreach (var switcher in PowerSwitches)
            {
                // Customs Power Switch
                if (switcher.Id == "custom_DesignStuff_00034" && switcher.name == "reserve_electric_switcher_lever")
                {
                    int percent = RandomGen();

                    if (percent <= Plugin.PowerOnChanceC.Value)
                    {
                        PowerSwitch(switcher);
                    }
                }

                // Interchange Power Station 
                if (switcher.Id == "Shopping_Mall_DesignStuff_00055" && switcher.name == "reserve_electric_switcher_lever")
                {
                    int percent = RandomGen();

                    if (percent <= Plugin.PowerOnChanceI.Value)
                    {
                        PowerSwitch(switcher);
                    }
                }

                // Reserve D2 Switch
                if (switcher.Id == "autoId_00000_D2_LEVER" && switcher.name == "reserve_electric_switcher_lever")
                {
                    int percent = RandomGen();

                    if (percent <= Plugin.PowerOnChanceR.Value)
                    {
                        PowerSwitch(switcher);
                    }
                }
            }
        }

        private static int RandomGen()
        {
            System.Random chance = new System.Random();
            int percent = chance.Next(1, 99);
            return percent;
        }
        private static void PowerSwitch(EFT.Interactive.Switch switcher)
        {
            switcher.GetType().GetMethod("Open", BindingFlags.NonPublic | BindingFlags.Instance)
                .Invoke(switcher, new object[0]);
        }
    }
}
