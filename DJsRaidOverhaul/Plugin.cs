using EFT;
using EFT.UI;
using EFT.InventoryLogic;
using System;
using System.IO;
using System.Reflection;
using System.Collections.Generic;
using BepInEx;
using BepInEx.Logging;
using BepInEx.Bootstrap;
using HarmonyLib;
using UnityEngine;
using Aki.Reflection.Utils;
using DJsRaidOverhaul.Helpers;
using DJsRaidOverhaul.Patches;
using DJsRaidOverhaul.Controllers;

namespace DJsRaidOverhaul
{
    [BepInPlugin("DJ.RaidOverhaul", "DJs Raid Overhaul", "2.1.0")]

    public class Plugin : BaseUnityPlugin
    {
        public const int TarkovVersion = 29197;
        public static string modPath = Path.Combine(Environment.CurrentDirectory, "user", "mods", "RaidOverhaul");

        internal static GameObject Hook;
        internal static EventController ECScript;
        internal static DoorController DCScript;
        internal static ManualLogSource Log;
        internal static BodyCleanup BCScript;

        internal static Dictionary<IAnimator, AnimatorOverrideController> Controllers;
        internal static Dictionary<string, int> SuitsLookup;
        internal static AnimationClip[] AnimationClips;

        public static ISession Session;

        public FieldInfo _FAS { get; set; }
        public FieldInfo _AAS { get; set; }

        private bool realismDetected = false;
        private bool watchAnimsDetected = false;
        public const string Realism = "RealismMod";
        public const string WatchAnims = "com.samswat.watchanims";

        void Awake()
        {
            if (!VersionChecker.CheckEftVersion(Logger, Info, Config))
            {
                throw new Exception("Invalid EFT Version");
            }

            Traverse.Create(typeof(BotSettingsRepoClass)).Field<Dictionary<WildSpawnType, BotSettingsValuesClass>>("dictionary_0").Value.Add((WildSpawnType)199,
                                                                                      new BotSettingsValuesClass(true, false, true, "ScavRole/Boss", ETagStatus.Solo));

            // Bind the configs
            DJConfig.BindConfig(Config);

            Log = Logger;
            Logger.LogInfo("Loading Raid Overhaul");
            Hook = new GameObject("Event Object");
            ECScript = Hook.AddComponent<EventController>();
            DCScript = Hook.AddComponent<DoorController>();
            BCScript = Hook.AddComponent<BodyCleanup>();
            DontDestroyOnLoad(Hook);

            // Get and Initialize the weightings
            Weighting.EventWeights = Utils.Get<Weightings>("/RaidOverhaul/GetEventWeightings");

            Weighting.InitWeightings();


            if (DJConfig.TimeChanges.Value)
            {
                new OnDeadPatch().Enable();
                new GameWorldPatch().Enable();
                new UIPanelPatch().Enable();
                new TimerUIPatch().Enable();
                new WeatherControllerPatch().Enable();
                new GlobalsPatch().Enable();
                new WatchPatch().Enable();
            }

            if (DJConfig.EnableAdrenaline.Value && realismDetected == false)
            {
                new HitStaminaPatch().Enable();
            }

            if (DJConfig.Deafness.Value && realismDetected == false)
            {
                new DeafnessPatch().Enable();
                new GrenadeDeafnessPatch().Enable();
            }

            new EnableEntryPointPatch().Enable();
            new RandomizeDefaultStatePatch().Enable();
            new EventExfilPatch().Enable();
            new RigPatch().Enable();
            new AirdropBoxPatch().Enable();

            if (DJConfig.WatchAnimations.Value && watchAnimsDetected == false)
            {
                new GamePlayerOwnerPatch().Enable();
                new GameWorldDisposePatch().Enable();
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
                    {"5cdea33e7d6c8b0474535dac", 0}
                };
                var directory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                AnimationClips = AssetBundle.LoadFromFile($"{directory}/bundles/watch animations.bundle").LoadAllAssets<AnimationClip>();
            }

            _FAS = _FAS ?? typeof(Inventory).GetField("FastAccessSlots");
            _FAS?.SetValue(_FAS, Utils._armbandFAS);

            _AAS = _AAS ?? typeof(Inventory).GetField("ArmorSlots");
            _AAS?.SetValue(_AAS, Utils._armbandAAS);

#if DEBUG
            ConsoleCommands.RegisterCC();
#endif
        }

        void Update()
        {
            if (Chainloader.PluginInfos.ContainsKey(Realism) && PreloaderUI.Instantiated && realismDetected == false)
            {
                realismDetected = true;
                Utils.LogToServerConsole("Realism Detected, disabling ROs adrenaline and deafness mechanics.");
            }

            if (Chainloader.PluginInfos.ContainsKey(WatchAnims) && PreloaderUI.Instantiated && watchAnimsDetected == false)
            {
                watchAnimsDetected = true;
                Utils.LogToServerConsole("Watch Animations Standalone Detected, disabling ROs watch animations.");
            }

            if (Session == null && ClientAppUtils.GetMainApp().GetClientBackEndSession() != null)
            {
                Session = ClientAppUtils.GetMainApp().GetClientBackEndSession();

                Log.LogDebug("Session set");
            }
        }
    }
}
