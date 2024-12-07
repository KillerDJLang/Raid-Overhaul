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

        internal static Dictionary<IAnimator, AnimatorOverrideController> Controllers;
        internal static Dictionary<string, int> SuitsLookup;
        internal static AnimationClip[] AnimationClips;

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
        private bool watchAnimsDetected = false;
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
            if (FlagHandler.CheckFlagPath("TraderRep"))
            {
                FlagHandler.ReadFlagFile("TraderRep");

                if (ConfigController.flags.traderRepFlag)
                {
                    Weighting.repCorrectWeight = 100;
                }
            }

            //Load Legion
            //Thanks and all credit to Groovey for the boss loading fix for 390 <3
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

            if (ConfigController.ServerConfig.TimeChanges) {
                /*
                new WatchPatch().Enable();
                new WeatherControllerPatch().Enable();
                new TimeUIPanelPatch().Enable();
                new OnGameStartedPatch().Enable();
                new TimeUIUpdatePatch().Enable();
                new LocationConditionsPanelPatch().Enable();
                */
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

            if (ConfigController.ServerConfig.WatchAnimations && watchAnimsDetected == false) {
                new GamePlayerOwnerPatch().Enable();
                new GameWorldDisposePatch().Enable();
                Controllers = new Dictionary<IAnimator, AnimatorOverrideController>();
                SuitsLookup = new Dictionary<string, int> {
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
                    {"5cdea33e7d6c8b0474535dac", 0}
                };
                AnimationClips = AssetBundle.LoadFromFile($"{pluginPath}/bundles/watch animations.bundle").LoadAllAssets<AnimationClip>();
            }

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

            if (Chainloader.PluginInfos.ContainsKey(Utils.WatchAnimsKey) && PreloaderUI.Instantiated && watchAnimsDetected == false) {
                watchAnimsDetected = true;
                if (ConfigController.DebugConfig.DebugMode) {
                    Utils.LogToServerConsole("Watch Animations Standalone Detected, disabling ROs watch animations.");
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
    }
}
