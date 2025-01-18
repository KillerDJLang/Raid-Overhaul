using EFT;
using EFT.UI;
using EFT.InventoryLogic;
using Comfort.Common;
using System;
using System.IO;
using System.Reflection;
using System.Collections.Generic;
using BepInEx;
using BepInEx.Logging;
using BepInEx.Bootstrap;
using HarmonyLib;
using UnityEngine;
using SPT.Reflection.Utils;

using RaidOverhaul.Models;
using RaidOverhaul.Helpers;
using RaidOverhaul.Patches;
using RaidOverhaul.Controllers;
using RaidOverhaul.Checkers;
using LegionPrePatch.Helpers;

namespace RaidOverhaul
{
    [BepInPlugin(ClientInfo.ROGUID, ClientInfo.ROPluginName, ClientInfo.PluginVersion)]
    //[BepInDependency("Jehree.InteractableExfilsAPI")]
    public class Plugin : BaseUnityPlugin
    {
        public static string modPath = Path.Combine(Environment.CurrentDirectory, "user", "mods", "RaidOverhaul");
        public static string pluginPath = Path.Combine(Environment.CurrentDirectory, "BepInEx", "plugins", "RaidOverhaul");
        public static string resourcePath = Path.Combine(pluginPath, "Resources");
        public static string legionJsonPath = Path.Combine(resourcePath, "normalLegionSettings.json");
        public static TextAsset legionText;

        internal static GameObject Hook;
        internal static EventController ECScript;
        internal static DoorController DCScript;
        internal static SeasonalWeatherController WScript;
        internal static BodyCleanup BCScript;
        internal static ManualLogSource Log;

        public static ISession Session;

        public static GameWorld ROGameWorld
        { get => Singleton<GameWorld>.Instance; }

        public static Player ROPlayer
        { get => ROGameWorld.MainPlayer; }

        public static SkillManager ROSkillManager
        { get => ROGameWorld.MainPlayer.Skills; }

        public FieldInfo _FAS { get; set; }
        public FieldInfo _AAS { get; set; }

        private bool realismDetected = false;
        private bool standaloneDetected = false;
        public static List<GameObject> ExfilList = new List<GameObject>();

        void Awake()
        {
            if (!VersionChecker.CheckEftVersion(Logger, Info, Config)) {
                throw new Exception("Invalid EFT Version");
            }

            if (!DependencyChecker.ValidateDependencies(Logger, Info, this.GetType(), Config))
            {
                throw new Exception("Missing Dependencies");
            }
            // Bind the configs
            DJConfig.BindConfig(Config);

            Log = Logger;
            Logger.LogInfo("Loading Raid Overhaul");
            Hook = new GameObject("Event Object");
            ECScript = Hook.AddComponent<EventController>();
            DCScript = Hook.AddComponent<DoorController>();
            WScript = Hook.AddComponent<SeasonalWeatherController>();
            BCScript = Hook.AddComponent<BodyCleanup>();
            DontDestroyOnLoad(Hook);

            // Get and Initialize the Server Configs
            ConfigController.EventConfig = Utils.Get<EventsConfig>("/RaidOverhaul/GetEventConfig");
            ConfigController.ServerConfig = Utils.Get<ServerConfigs>("/RaidOverhaul/GetServerConfig");
            ConfigController.DebugConfig = Utils.Get<DebugConfigs>("/RaidOverhaul/GetDebugConfig");
            Weighting.InitWeightings();

            Utils.GetWeatherFields();

            //Check flags and adjust accordingly
            if (JsonHandler.CheckFilePath("TraderRep", "Flags"))
            {
                JsonHandler.ReadFlagFile("TraderRep", "Flags");

                if (ConfigController.flags.traderRepFlag)
                {
                    Weighting.repCorrectWeight = 100;
                    Weighting.InitWeightings();
                }
            }

            //Load Legion
            FieldInfo excludedDifficultiesField = typeof(GClass583).GetField("ExcludedDifficulties", BindingFlags.Static | BindingFlags.Public) ?? throw new InvalidOperationException("ExcludedDifficulties field not found.");
            var excludedDifficulties = (Dictionary<WildSpawnType, List<BotDifficulty>>)excludedDifficultiesField.GetValue(null);

            var excludedDifficultiesForLegion = new List<BotDifficulty> {
                BotDifficulty.easy,
                BotDifficulty.hard,
                BotDifficulty.impossible
            };

            if (!excludedDifficulties.ContainsKey((WildSpawnType)199)) {
                excludedDifficulties.Add((WildSpawnType)199, excludedDifficultiesForLegion);
                Console.WriteLine("Successfully added Legion to the excluded difficulties list");
            }
            Traverse.Create(typeof(GClass759)).Field<Dictionary<WildSpawnType, GClass758>>("dictionary_0").Value.Add((WildSpawnType)LegionEnums.BossLegionValue, new GClass758(true, false, false, "ScavRole/Boss", ETagStatus.Solo));

            Utils.LoadLegionSettings();

            if (ConfigController.DebugConfig.TimeChanges) {
                new WatchPatch().Enable();
                new WeatherControllerPatch().Enable();
                /*
                new UIPanelPatch().Enable();
                new TimerUIPatch().Enable();
                new ExitTimerUIPatch().Enable();
                */
                new TimePanelPatch().Enable();
                new RaidSettingsPatch().Enable();
                new LocationInfoPanelPatch().Enable();
            }

            if (DJConfig.Deafness.Value && realismDetected == false) {
                new DeafnessPatch().Enable();
                new GrenadeDeafnessPatch().Enable();
            }

            if (DJConfig.Concussion.Value && realismDetected == false) {
                new ConcussionPatch().Enable();
            }

            new KeyPatch().Enable();
            new OnDeadPatch().Enable();
            new EnableEntryPointPatch().Enable();
            new RandomizeDefaultStatePatch().Enable();
            new EventExfilPatch().Enable();
            new RigPatch().Enable();
            //new AirdropBoxPatch().Enable();
            new LegionSmethodPatch().Enable();

            _FAS = _FAS ?? typeof(Inventory).GetField("FastAccessSlots");
            _FAS?.SetValue(_FAS, Utils._armbandFAS);

            _AAS = _AAS ?? typeof(Inventory).GetField("ArmorSlots");
            _AAS?.SetValue(_AAS, Utils._armbandAAS);

            if (ConfigController.DebugConfig.DebugMode) {
                ConsoleCommands.RegisterCC();
            }
        }

        void Update()
        {
            if (Chainloader.PluginInfos.ContainsKey(Utils.RealismKey) && PreloaderUI.Instantiated && realismDetected == false) {
                realismDetected = true;
                if (ConfigController.DebugConfig.DebugMode) {
                    Utils.LogToServerConsole("Realism Detected, disabling ROs deafness mechanics.");
                }
            }

            if (Chainloader.PluginInfos.ContainsKey(Utils.ROStandaloneKey) && PreloaderUI.Instantiated && standaloneDetected == false) {
                if (GameObject.Find("ErrorScreen"))
                    PreloaderUI.Instance.CloseErrorScreen();

                PreloaderUI.Instance.ShowErrorScreen("Raid Overhaul Error", "Raid Overhaul is not compatible with Raid Overhaul Standalone. Install only one of the mods or errors will occur.");
                standaloneDetected = true;
            }

            if (Session == null && ClientAppUtils.GetMainApp().GetClientBackEndSession() != null) {
                Session = ClientAppUtils.GetMainApp().GetClientBackEndSession();

                Log.LogDebug("Session set");
            }
        }
/*
        private void Start()
        {
            //Examples examplesClass = new Examples();
            //Singleton<InteractableExfilsService>.Instance.OnActionsAppliedEvent += examplesClass.SimpleExample;
            //Singleton<InteractableExfilsService>.Instance.OnActionsAppliedEvent += examplesClass.GoneWhenDisabledExample;
            //Singleton<InteractableExfilsService>.Instance.OnActionsAppliedEvent += examplesClass.DynamicDisabledExample;
            //Singleton<InteractableExfilsService>.Instance.OnActionsAppliedEvent += examplesClass.SoftDynamicDisabledExample;
            //Singleton<InteractableExfilsService>.Instance.OnActionsAppliedEvent += examplesClass.ScavGate3OnlyExample;
        }
*/
    }
}
