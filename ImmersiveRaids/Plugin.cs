using BepInEx;
using UnityEngine;
using BepInEx.Logging;
using BepInEx.Configuration;
using System.Collections.Generic;
using System.Reflection;
using System.IO;

namespace DJsRaidOverhaul
{
    [BepInPlugin("com.DJ.ImmersiveRaids", "DJs Immersive Raids", "1.0.0")]
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

        private static ConfigEntry<float> factor;

        public static ConfigEntry<float> enduranceMulti { get; set; }


        void Awake()
        {
            logger = Logger;
            Logger.LogInfo("Loading Raid Overhaul");
            Hook = new GameObject("IR Object");
            Script = Hook.AddComponent<IRController>();
            BCScript = Hook.AddComponent<BodyCleanup>();
            DontDestroyOnLoad(Hook);

            string category = "Events";

            EnableEvents = Config.Bind(category, "Enable Dynamic Events", true, "Dictates whether the dynamic event timer should increment and allow events to run or not.\nNote that this DOES NOT stop events that are already running!");

            category = "Body Cleanup Configs";

            EnableClean = Config.Bind(category, "Enable Clean.", true, "Enable Clean?");
            TimeToClean = Config.Bind(category, "Time to Clean", 1800f, "Time to clean bodies. Calculated in seconds.");
            DistToClean = Config.Bind(category, "Distance to Clean.", 60, "How far away should bodies be for cleanup.");

            category = "Backpack Drop Configs";

            DropBackPack = Config.Bind(category, "Drop Backpack", true, "Drop Backpack");
            DropBackPackChance = Config.Bind(category, "Backpack Drop Chance", 0.3f, "Chance of dropping a backpack");

            category = "Adrenaline";

            factor = Config.Bind(category, "Factor", 0.5f, new ConfigDescription("The factor to multiply the effect's strength by.", new AcceptableValueRange<float>(0f, 100f)));


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
}
