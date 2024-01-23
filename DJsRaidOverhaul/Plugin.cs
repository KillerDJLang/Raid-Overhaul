using System;
using BepInEx;
using System.IO;
using UnityEngine;
using BepInEx.Logging;
using System.Reflection;
using DJsRaidOverhaul.Helpers;
using DJsRaidOverhaul.Patches;
using DrakiaXYZ.VersionChecker;
using System.Collections.Generic;
using DJsRaidOverhaul.Controllers;
using Comfort.Common;

namespace DJsRaidOverhaul
{
    [BepInPlugin("DJ.RaidOverhaul", "DJs Raid Overhaul", "1.3.1")]

    public class Plugin : BaseUnityPlugin
    {
        public const int TarkovVersion = 26535;

        internal static GameObject Hook;
        internal static EventController ECScript;
        internal static DoorController DCScript;
        internal static ManualLogSource logger;
        internal static BodyCleanup BCScript;
        internal static Plugin Instance;
        internal static BackendConfigSettingsClass BackendConfig;

        internal static Dictionary<IAnimator, AnimatorOverrideController> Controllers;
        internal static Dictionary<string, int> SuitsLookup;
        internal static AnimationClip[] AnimationClips;

        void Awake()
        {
            if (!VersionChecker.CheckEftVersion(Logger, Info, Config))
            {
                throw new Exception("Invalid EFT Version");
            }

            // Bind the configs
            DJConfig.BindConfig(Config);

            logger = Logger;
            Logger.LogInfo("Loading Raid Overhaul");
            Hook = new GameObject("Event Object");
            ECScript = Hook.AddComponent<EventController>();
            DCScript = Hook.AddComponent<DoorController>();
            BCScript = Hook.AddComponent<BodyCleanup>();
            DontDestroyOnLoad(Hook);

            BackendConfig = Singleton<BackendConfigSettingsClass>.Instance;
            Instance = this;
            DontDestroyOnLoad(Instance);

            // Initialize the weightings
            Weighting.InitWeightings();

            if (DJConfig.TimeChanges.Value)
            {
                new OnDeadPatch().Enable();
                new GameWorldPatch().Enable();
                new UIPanelPatch().Enable();
                new TimerUIPatch().Enable();
                // new EventExfilPatch().Enable();
                new WeatherControllerPatch().Enable();
                new GlobalsPatch().Enable();
                new WatchPatch().Enable();
            }

            new EnableEntryPointPatch().Enable();
            new HitStaminaPatch().Enable();
            new DeafnessPatch().Enable();
            new GrenadeDeafnessPatch().Enable();
            new GamePlayerOwnerPatch().Enable();
            new GameWorldDisposePatch().Enable();
            new RandomizeDefaultStatePatch().Enable();
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

        void Update()
        {
            if (BackendConfig == null && Singleton<BackendConfigSettingsClass>.Instantiated)
            {
                BackendConfig = Singleton<BackendConfigSettingsClass>.Instance;
            }
        }
    }
}
