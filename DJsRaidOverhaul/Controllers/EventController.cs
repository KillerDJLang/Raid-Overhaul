using EFT;
using EFT.UI;
using JsonType;
using UnityEngine;
using System.Linq;
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
            if (!DJConfig.DisableHeal.Value)
            {
                NotificationManagerClass.DisplayMessageNotification("Heal Event: On your feet you ain't dead yet.");
                player.ActiveHealthController.RestoreFullHealth();
            }

            else
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
        }

        public void DoDamageEvent()
        {
            if (!DJConfig.NoJokesHere.Value)
            {
                NotificationManagerClass.DisplayMessageNotification("Heart Attack Event: Better get to a medic quick, you don't have long left.");
                player.PlayerHealthController.DoContusion(4, 50);
                player.ActiveHealthController.DoStun(5, 0);
                player.ActiveHealthController.DoFracture(EBodyPart.LeftArm);
                player.ActiveHealthController.ApplyDamage(EBodyPart.Chest, 65, Blunt);
            }

            else
            {
                DoFunny();
            }
        }



        public void DoArmorRepair()
        {
            if (!DJConfig.DisableArmorRepair.Value)
            {
                NotificationManagerClass.DisplayMessageNotification("Armor Repair Event: All equipped armor repaired... nice!", ENotificationDurationType.Long, ENotificationIconType.Default);
                player.Profile.Inventory.GetAllEquipmentItems().ExecuteForEach((item) =>
                {
                    if (item.GetItemComponent<ArmorComponent>() != null) item.GetItemComponent<RepairableComponent>().Durability = item.GetItemComponent<RepairableComponent>().MaxDurability;
                });
            }

            else
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
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
            if (DJConfig.DisableAirdrop.Value || player.Location == "factory4_day" || player.Location == "factory4_night" || player.Location == "laboratory" || _airdropEventHasRun)
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
            if (DJConfig.NoJokesHere.Value && !_jokeEventHasRun)
            {
                NotificationManagerClass.DisplayMessageNotification("Heart Attack Event: Nice knowing ya, you've got 10 seconds", ENotificationDurationType.Long, ENotificationIconType.Alert);
                await Task.Delay(10000);
                NotificationManagerClass.DisplayMessageNotification("jk", ENotificationDurationType.Long, ENotificationIconType.Default);
                await Task.Delay(2000); 
                Weighting.DoRandomEvent(Weighting.weightedEvents);

                _jokeEventHasRun = true;
            }

            if (DJConfig.NoJokesHere.Value && _jokeEventHasRun)
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }

            else
            {
                DoDamageEvent();
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
            if (!DJConfig.DisableBlackout.Value)
            {
                LampController[] dontChangeOnEnd = new LampController[0];

                foreach (Switch pSwitch in _pswitchs)
                {
                    typeof(Switch).GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
                    typeof(Switch).GetMethod("Lock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
                }

                foreach (LampController lamp in _lamp)
                {
                    if (lamp.enabled == false)
                    {
                        dontChangeOnEnd.Append(lamp);
                        continue;
                    }
                    lamp.Switch(Turnable.EState.Off);
                    lamp.enabled = false;
                }

                foreach (KeycardDoor door in _keydoor)
                {
                    typeof(KeycardDoor).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                    AudioSource.PlayClipAtPoint(door.DeniedBeep, door.gameObject.transform.position);
                }

                NotificationManagerClass.DisplayMessageNotification("Blackout Event: All power switches and lights disabled for 10 minutes", ENotificationDurationType.Long, ENotificationIconType.Alert);

                await Task.Delay(600000);

                foreach (Switch pSwitch in _pswitchs)
                {
                    typeof(Switch).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
                }

                foreach (LampController lamp in _lamp)
                {
                    if (dontChangeOnEnd.Contains(lamp)) continue;
                    lamp.Switch(Turnable.EState.On);
                    lamp.enabled = true;
                }

                foreach (KeycardDoor door in _keydoor)
                    if (_keydoor != null || _keydoor.Length >= 0)
                    {
                        {
                            typeof(KeycardDoor).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                            typeof(KeycardDoor).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                        }
                    }

                NotificationManagerClass.DisplayMessageNotification("Blackout Event over", ENotificationDurationType.Long, ENotificationIconType.Quest);
            }

            else
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
        }

        public void DoSkillEvent()
        {
            if (_skillEventCount >= 3) { return; }

            if (!DJConfig.DisableSkill.Value)
            {
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
            else
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
        }

        public void DoMetabolismEvent()
        {
            if (!DJConfig.DisableMetabolism.Value && !_metabolismDisabled)
            {
                System.Random random = new System.Random();
                int chance = random.Next(0, 100 + 1);

                ConsoleScreen.Log(chance.ToString());

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
            else
            {
                Weighting.DoRandomEvent(Weighting.weightedEvents);
            }
        }

        public static void RandomizeLampState()
        {
            FindObjectsOfType<LampController>().ExecuteForEach(lamp =>
            {

                if (lamp.enabled == false)
                {
                    return;
                }

                if (Random.Range(0, 100) < 80)
                {
                    if (lamp.enabled == true)
                    {
                        lamp.Switch(Turnable.EState.Off);
                        lamp.enabled = false;
                    }
                }
            });

            if (DJConfig.DebugLogging.Value)
            {
                NotificationManagerClass.DisplayMessageNotification("Starting lamp state has been modified.", ENotificationDurationType.Default);
            }
        }

        public bool Ready() => gameWorld != null && gameWorld.AllAlivePlayersList != null && gameWorld.AllAlivePlayersList.Count > 0 && !(player is HideoutPlayer);
    }
}
