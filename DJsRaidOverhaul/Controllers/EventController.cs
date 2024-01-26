using EFT;
using EFT.UI;
using JsonType;
using UnityEngine;
using Comfort.Common;
using EFT.Interactive;
using System.Reflection;
using EFT.UI.Matchmaker;
using System.Collections;
using EFT.InventoryLogic;
using EFT.Communications;
using Aki.Custom.Airdrops;
using System.Threading.Tasks;
using DJsRaidOverhaul.Helpers;
using DJsRaidOverhaul.Patches;
using System.Numerics;
using HarmonyLib;
using EFT.HealthSystem;
using Aki.Reflection.Utils;
using static DJsRaidOverhaul.Plugin;


namespace DJsRaidOverhaul.Controllers
{
    public class EventController : MonoBehaviour
    {
        // bool exfilUIChanged = false;

        private bool _eventisRunning = false;
        private bool _airdropDisabled = false;
        private bool _metabolismDisabled = false;
        private bool _jokeEventHasRun = false;
        private bool _airdropEventHasRun = false;
        private bool _berserkEventHasRun = false;
        private bool _malfEventHasRun = false;
        private bool _weightEventHasRun = false;

        private int _skillEventCount = 0;

        private Switch[] _pswitchs = null;
        private KeycardDoor[] _keydoor = null;
        private LampController[] _lamp = null;

        GameWorld gameWorld
        { get => Singleton<GameWorld>.Instance; }

        Player player
        { get => gameWorld.MainPlayer; }

        SkillManager skillManager
        { get => gameWorld.MainPlayer.Skills; }

        RaidSettings raidSettings
        { get => Singleton<RaidSettings>.Instance; }

        public DamageInfo Blunt { get; private set; }

        void Update()
        {
            if (DJConfig.TimeChanges.Value)
            {
                RaidTime.inverted = MonoBehaviourSingleton<MenuUI>.Instance == null || MonoBehaviourSingleton<MenuUI>.Instance.MatchMakerSelectionLocationScreen == null
                ? RaidTime.inverted
                : !((EDateTime)typeof(MatchMakerSelectionLocationScreen).GetField("edateTime_0", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(MonoBehaviourSingleton<MenuUI>.Instance.MatchMakerSelectionLocationScreen) == EDateTime.CURR);
            }

            if (!Ready() || !DJConfig.EnableEvents.Value)
            {
                // Reset Events
                if (_airdropDisabled != false)      { _airdropDisabled = false; }
                if (_metabolismDisabled != false)   { _metabolismDisabled = false; }
                if (_jokeEventHasRun != false)      { _jokeEventHasRun = false; }
                if (_airdropEventHasRun != false)   { _airdropEventHasRun = false; }
                if (_berserkEventHasRun != false)   { _berserkEventHasRun = false; }
                if (_malfEventHasRun != false)      { _malfEventHasRun = false; }
                if (_weightEventHasRun != false)    { _weightEventHasRun = false; }

                if (_skillEventCount != 0)          { _skillEventCount = 0; }

                return;
            }

            if (_pswitchs == null)
            {
                _pswitchs = FindObjectsOfType<Switch>();
            }

            if (_keydoor == null)
            {
                _keydoor = FindObjectsOfType<KeycardDoor>();
            }

            if (_lamp == null)
            {
                _lamp = FindObjectsOfType<LampController>();
            }

            if (!_eventisRunning)
            {
                StaticManager.Instance.StartCoroutine(StartEvents());

                _eventisRunning = true;
            }

            /*
            if (EventExfilPatch.IsLockdown || EventExfilPatch.awaitDrop)
                if (!exfilUIChanged)
                    ChangeExfilUI();
            /**/
        }

        private IEnumerator StartEvents()
        {
            yield return new WaitForSeconds(UnityEngine.Random.Range(DJConfig.EventRangeMin.Value, DJConfig.EventRangeMax.Value) * 60f);

            if (gameWorld != null && gameWorld.AllAlivePlayersList != null && gameWorld.AllAlivePlayersList.Count > 0 && !(player is HideoutPlayer))
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }

            else
            {
                _pswitchs = null;
                _keydoor = null;
                _lamp = null;
            }

            _eventisRunning = false;
            yield break;
        }

        // moved from patch impacted performance too much
        /*
        async void ChangeExfilUI()
        {
            if (EventExfilPatch.IsLockdown || EventExfilPatch.awaitDrop)
            {
                Color red = new Color(0.8113f, 0.0376f, 0.0714f, 0.8627f);
                Color green = new Color(0.4863f, 0.7176f, 0.0157f, 0.8627f);
                RectTransform mainDescription = (RectTransform)typeof(ExtractionTimersPanel).GetField("_mainDescription", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(FindObjectOfType<ExtractionTimersPanel>());

                var text = mainDescription.gameObject.GetComponentInChildren<TextMeshProUGUI>();
                var box = mainDescription.gameObject.GetComponentInChildren<Image>();

                text.text = EventExfilPatch.IsLockdown ? "Extraction unavailable" : EventExfilPatch.awaitDrop ? "Extracting gear - Exfils locked" : "Find an extraction point";
                box.color = red;

                foreach (ExitTimerPanel panel in FindObjectsOfType<ExitTimerPanel>())
                    panel.enabled = false;

                exfilUIChanged = true;

                while (EventExfilPatch.IsLockdown || EventExfilPatch.awaitDrop)
                    await Task.Yield();

                text.text = "Find an extraction point";
                box.color = green;

                foreach (ExitTimerPanel panel in FindObjectsOfType<ExitTimerPanel>())
                    panel.enabled = true;

                exfilUIChanged = false;
            }
        }
        /**/

        public void DoHealPlayer()
        {
                NotificationManagerClass.DisplayMessageNotification("Heal Event: On your feet you ain't dead yet.");
                player.ActiveHealthController.RestoreFullHealth();
        }

        public void DoDamageEvent()
        {
                NotificationManagerClass.DisplayMessageNotification("Heart Attack Event: Better get to a medic quick, you don't have long left.");
                player.ActiveHealthController.DoContusion(4f, 50f);
                player.ActiveHealthController.DoStun(5f, 0f);
                player.ActiveHealthController.DoFracture(EBodyPart.LeftArm);
                player.ActiveHealthController.ApplyDamage(EBodyPart.Chest, 65f, Blunt);
        }



        public void DoArmorRepair()
        {
                NotificationManagerClass.DisplayMessageNotification("Armor Repair Event: All equipped armor repaired... nice!", ENotificationDurationType.Long, ENotificationIconType.Default);
                player.Profile.Inventory.GetAllEquipmentItems().ExecuteForEach((item) =>
                {
                    if (item.GetItemComponent<ArmorComponent>() != null) item.GetItemComponent<RepairableComponent>().Durability = item.GetItemComponent<RepairableComponent>().MaxDurability;
                });

        }

        /*
        void DoHuntedEvent()
        {
            NotificationManagerClass.DisplayMessageNotification("Hunted Event: The enemy knows your position, hold out as long as you can.", ENotificationDurationType.Long, ENotificationIconType.Alert);

            NotificationManagerClass.DisplayMessageNotification("You survived, congratulations.", ENotificationDurationType.Long, ENotificationIconType.Default);
        }
        /**/


        public void DoAirdropEvent()
        {
            if (player.Location == "factory4_day" || player.Location == "factory4_night" || player.Location == "laboratory" || _airdropEventHasRun)
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }

            else
            {
                gameWorld.gameObject.AddComponent<AirdropsManager>().isFlareDrop = true;
                NotificationManagerClass.DisplayMessageNotification("Aidrop Event: Incoming Airdrop!", ENotificationDurationType.Long, ENotificationIconType.Default);

                _airdropEventHasRun = true;
            }
        }

        public async void DoFunny()
        {
            if (!_jokeEventHasRun)
            {
                NotificationManagerClass.DisplayMessageNotification("Heart Attack Event: Nice knowing ya, you've got 10 seconds", ENotificationDurationType.Long, ENotificationIconType.Alert);

                await Task.Delay(10000);

                NotificationManagerClass.DisplayMessageNotification("jk", ENotificationDurationType.Long, ENotificationIconType.Default);

                await Task.Delay(2000);

                Weighting.DoRandomEvent(Weighting.weightedEvents);

                _jokeEventHasRun = true;
            }

            if (_jokeEventHasRun)
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
        }

        /*
        async void DoLockDownEvent()
        {
            NotificationManagerClass.DisplayMessageNotification("Lockdown Event: All extracts are unavaliable for 15 minutes", ENotificationDurationType.Long, ENotificationIconType.Alert);
            EventExfilPatch.IsLockdown = true;

            await Task.Delay(900000);

            EventExfilPatch.IsLockdown = false;
            NotificationManagerClass.DisplayMessageNotification("Lockdown Event over", ENotificationDurationType.Long, ENotificationIconType.Quest);
        }
        /**/

        public async void DoBlackoutEvent()
        {
                foreach (Switch pSwitch in _pswitchs)
                {
                    typeof(Switch).GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
                    typeof(Switch).GetMethod("Lock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
                }

                foreach (LampController lamp in _lamp)
                {
                    lamp.Switch(Turnable.EState.Off);
                    lamp.enabled = false;
                }

                foreach (KeycardDoor door in _keydoor)
                {
                    if (_keydoor != null || _keydoor.Length >= 0)
                    {
                        {
                            typeof(KeycardDoor).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                            typeof(KeycardDoor).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                        }
                    }
                }

            NotificationManagerClass.DisplayMessageNotification("Blackout Event: All power switches and lights disabled for 10 minutes", ENotificationDurationType.Long, ENotificationIconType.Alert);

                await Task.Delay(600000);

                foreach (Switch pSwitch in _pswitchs)
                {
                    typeof(Switch).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
                }

                foreach (LampController lamp in _lamp)
                {
                    lamp.Switch(Turnable.EState.On);
                    lamp.enabled = true;
                }

            NotificationManagerClass.DisplayMessageNotification("Blackout Event over", ENotificationDurationType.Long, ENotificationIconType.Quest);
        }

        public void DoSkillEvent()
        {
            if (_skillEventCount >= 3) { return; }

                System.Random random = new System.Random();

                int chance = random.Next(0, 100 + 1);
                var selectedSkill = skillManager.DisplayList.RandomElement();
                int level = selectedSkill.Level;

                // If the skill is a locked skill, start over.
                if (selectedSkill.Locked == true) { DoSkillEvent(); };

                // 55% chance to roll a skill gain
                // 45% chance to roll a skill loss
                if (chance >= 0 && chance <= 55)
                {
                    if (level > 50 || level < 0) { return; }

                    selectedSkill.SetLevel(level + 1);
                    _skillEventCount++;
                    NotificationManagerClass.DisplayMessageNotification("Skill Event: You've advanced a skill to the next level!", ENotificationDurationType.Long);
                }
                else
                {
                    if (level <= 0) { return; }

                    selectedSkill.SetLevel(level - 1);
                    _skillEventCount++;
                    NotificationManagerClass.DisplayMessageNotification("Skill Event: You've lost a skill level, unlucky!", ENotificationDurationType.Long);
                }
        }

        public void DoMetabolismEvent()
        {
            if (!_metabolismDisabled)
            {
                System.Random random = new System.Random();
                int chance = random.Next(0, 100 + 1);

                // 33% chance to disable metabolism for the raid
                // 33% chance to increase metabolism rate by 20% for the raid
                // 33% chance to reduce metabolism rate by 20% for the raid
                if (chance >= 0 && chance <= 33)
                {
                    player.ActiveHealthController.DisableMetabolism();
                    _metabolismDisabled = true;
                    NotificationManagerClass.DisplayMessageNotification("Metabolism Event: You've got an iron stomach, No hunger or hydration drain!", ENotificationDurationType.Long);
                }
                else if (chance >= 34f && chance <= 66)
                {
                    AccessTools.Property(typeof(ActiveHealthController), "EnergyRate").SetValue(
                        player.ActiveHealthController,
                        player.ActiveHealthController.EnergyRate * 0.80f);

                    AccessTools.Property(typeof(ActiveHealthController), "HydrationRate").SetValue(
                        player.ActiveHealthController,
                        player.ActiveHealthController.HydrationRate * 0.80f);

                    NotificationManagerClass.DisplayMessageNotification("Metabolism Event: Your metabolism has slowed. Decreased hunger and hydration drain!", ENotificationDurationType.Long);
                }
                else if (chance >= 67 && chance <= 100f)
                {
                    AccessTools.Property(typeof(ActiveHealthController), "EnergyRate").SetValue(
                        player.ActiveHealthController,
                        player.ActiveHealthController.EnergyRate * 1.20f);

                    AccessTools.Property(typeof(ActiveHealthController), "HydrationRate").SetValue(
                        player.ActiveHealthController,
                        player.ActiveHealthController.HydrationRate * 1.20f);

                    NotificationManagerClass.DisplayMessageNotification("Metabolism Event: Your metabolism has fastened. Increased hunger and hydration drain!", ENotificationDurationType.Long);
                }
            }
        }

        public async void DoMalfEvent()
        {
            var pItems = Session.Profile.Inventory.AllPlayerItems;

            if (!_malfEventHasRun)
            {
                _malfEventHasRun = true;

                foreach (var item in pItems)
                {
                    if (item is Weapon weapon)
                    {
                        weapon.Template.BaseMalfunctionChance = weapon.Template.BaseMalfunctionChance * 2f;
                        weapon.Template.DurabilityBurnRatio = weapon.Template.DurabilityBurnRatio * 2f;
                        weapon.Template.HeatFactorByShot = weapon.Template.HeatFactorByShot * 2f;
                    }
                }
                NotificationManagerClass.DisplayMessageNotification("Malfunction Event: Be careful not to jam up!", ENotificationDurationType.Long);

                await Task.Delay(60000);

                foreach (var item in pItems)
                {
                    if (item is Weapon weapon)
                    {
                        weapon.Template.BaseMalfunctionChance = weapon.Template.BaseMalfunctionChance * 0.5f;
                        weapon.Template.DurabilityBurnRatio = weapon.Template.DurabilityBurnRatio * 0.5f;
                        weapon.Template.HeatFactorByShot = weapon.Template.HeatFactorByShot * 0.5f;
                    }
                }
                NotificationManagerClass.DisplayMessageNotification("Malfunction Event: Your weapon has had time to cool off, shouldn't have any more troubles!", ENotificationDurationType.Long);
            }

            else
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
        }

        public void DoLLEvent()
        {
            if (Session == null && ClientAppUtils.GetMainApp().GetClientBackEndSession() != null)
            {
                System.Random random = new System.Random();

                var Trader = Utils.Traders.RandomElement();
                int chance = random.Next(0, 100 + 1);

                Session = ClientAppUtils.GetMainApp().GetClientBackEndSession();

                if (chance is >= 0 && chance is <= 49)
                {
                    Session.Profile.TradersInfo[Trader].SetStanding(Session.Profile.TradersInfo[Trader].Standing + 0.1);
                    NotificationManagerClass.DisplayMessageNotification("Trader Event: A random Trader has gained a little more respect for you.", ENotificationDurationType.Default);
                }

                else if (chance is >= 50 && chance is <= 100)
                {
                    Session.Profile.TradersInfo[Trader].SetStanding(Session.Profile.TradersInfo[Trader].Standing - 0.05);
                    NotificationManagerClass.DisplayMessageNotification("Trader Event: A random Trader has lost a little faith in you.", ENotificationDurationType.Default);
                }
            }
        }

        public async void DoBerserkEvent()
        {
            var wItems = Session.Profile.Inventory.AllPlayerItems;

            if (!_berserkEventHasRun)
            {
                _berserkEventHasRun = true;
                player.ActiveHealthController.DoContusion(4f, 30f);
                player.ActiveHealthController.DoStun(5f, 0f);

                foreach (var item in wItems)
                {
                    if (item is Weapon weapon)
                    {
                        weapon.Template.BaseMalfunctionChance = weapon.Template.BaseMalfunctionChance * 0.5f;
                        weapon.Template.Ergonomics = weapon.Template.Ergonomics * 2f;
                        weapon.Template.RecoilForceUp = weapon.Template.RecoilForceUp * 0.5f;
                        weapon.Template.RecoilForceBack = weapon.Template.RecoilForceBack * 0.5f;
                    }
                }
                NotificationManagerClass.DisplayMessageNotification("Berserk Event: You're seeing red, I feel bad for any scavs and PMCs in your way!", ENotificationDurationType.Long);

                await Task.Delay(180000);

                foreach (var item in wItems)
                {
                    if (item is Weapon weapon)
                    {
                        weapon.Template.BaseMalfunctionChance = weapon.Template.BaseMalfunctionChance * 2f;
                        weapon.Template.Ergonomics = weapon.Template.Ergonomics * 0.5f;
                        weapon.Template.RecoilForceUp = weapon.Template.RecoilForceUp * 2f;
                        weapon.Template.RecoilForceBack = weapon.Template.RecoilForceBack * 2f;
                    }
                }
                NotificationManagerClass.DisplayMessageNotification("Berserk Event: Your vision has cleared up, I guess you got all your rage out!", ENotificationDurationType.Long);
            }

            else
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
        }

        public async void DoWeightEvent()
        {
            var aItems = Session.Profile.Inventory.AllPlayerItems;

            if (!_weightEventHasRun)
            {
                _weightEventHasRun = true;

                foreach (var aitem in aItems)

                {
                    if (aitem is Item item)
                    {
                        item.Template.Weight = item.Template.Weight * 2f;
                    }
                }
                NotificationManagerClass.DisplayMessageNotification("Weight Event: Better hunker down until you get your stamina back!", ENotificationDurationType.Long);

                await Task.Delay(180000);

                foreach (var aitem in aItems)
                {
                    if (aitem is Item item)
                    {
                        item.Template.Weight = item.Template.Weight * 0.5f;
                    }
                }
                NotificationManagerClass.DisplayMessageNotification("Weight Event: You're rested and ready to get back out there!", ENotificationDurationType.Long);
            }

            else
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
        }

        public static void RandomizeLampState()
        {
            if (DJConfig.EnableRaidStartEvents.Value)
            {
                FindObjectsOfType<LampController>().ExecuteForEach(lamp =>
                {
                    System.Random random = new System.Random();

                    int chance = random.Next(0, 100 + 1);

                    if (chance is >= 70)
                    {
                        lamp.Switch(Turnable.EState.Off);
                        lamp.enabled = false;
                    }
                });
            

                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("Starting lamp state has been modified.", ENotificationDurationType.Default);
                }
            }
        }

        public bool Ready() => gameWorld != null && gameWorld.AllAlivePlayersList != null && gameWorld.AllAlivePlayersList.Count > 0 && !(player is HideoutPlayer);
    }
}
