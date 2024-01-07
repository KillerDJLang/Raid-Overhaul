﻿using EFT;
using EFT.UI;
using JsonType;
using UnityEngine;
using System.Linq;
using Comfort.Common;
using UnityEngine.UI;
using EFT.Interactive;
using EFT.HealthSystem;
using System.Reflection;
using EFT.UI.Matchmaker;
using EFT.InventoryLogic;
using EFT.Communications;
using EFT.UI.BattleTimer;
using Aki.Custom.Airdrops;
using System.Threading.Tasks;
using DJsRaidOverhaul.Patches;
using System.Collections;
using TMPro;

namespace DJsRaidOverhaul.Controllers
{
    public class EventController : MonoBehaviour
    {
        bool exfilUIChanged = false;

        private bool _eventisRunning = false;
        private Switch[] _switchs = null;
        private Door[] _door = null;
        private KeycardDoor[] _kdoor = null;
        private LampController[] _lamp = null;

        Player player
        { get => gameWorld.MainPlayer; }

        GameWorld gameWorld
        { get => Singleton<GameWorld>.Instance; }

        RaidSettings raidSettings
        { get => Singleton<RaidSettings>.Instance; }

        public DamageInfo Blunt { get; private set; }

        void Update()
        {
            RaidTime.inverted = MonoBehaviourSingleton<MenuUI>.Instance == null || MonoBehaviourSingleton<MenuUI>.Instance.MatchMakerSelectionLocationScreen == null
            ? RaidTime.inverted
            : !((EDateTime)typeof(MatchMakerSelectionLocationScreen).GetField("edateTime_0", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(MonoBehaviourSingleton<MenuUI>.Instance.MatchMakerSelectionLocationScreen) == EDateTime.CURR);

            if (!Ready() || !Plugin.EnableEvents.Value)
            {
                return;
            }

            if (_switchs == null)
            {
                _switchs = FindObjectsOfType<Switch>();
            }

            if (_door == null)
            {
                _door = FindObjectsOfType<Door>();
            }

            if (_kdoor == null)
            {
                _kdoor = FindObjectsOfType<KeycardDoor>();
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

            if (EventExfilPatch.IsLockdown || EventExfilPatch.awaitDrop)
                if (!exfilUIChanged)
                    ChangeExfilUI();
        }

        private IEnumerator StartEvents()
        {
            yield return new WaitForSeconds(UnityEngine.Random.Range(Plugin.EventRangeMin.Value, Plugin.EventRangeMax.Value) * 60f);

            if (Ready())
            {
                DoRandomEvent();
            }

            else
            {
                _switchs = null;
                _door = null;
                _kdoor = null;
                _lamp = null;
            }

            _eventisRunning = false;
            yield break;
        }

        // moved from patch impacted performance too much
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

        void DoRandomEvent()
        {
            float rand = UnityEngine.Random.Range(0, 30);

            switch (rand)
            {
                case 0:
                case 1:
                    if (Plugin.NoJokesHere.Value == true) DoFunny();
                    else
                    {
                        DoDamageEvent();
                    }
                    break;

                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    if (Plugin.DisableAirdrop.Value == true) DoRandomEvent();
                    {
                        if (player.Location == "factory4_day" || player.Location == "factory4_night" || player.Location == "laboratory") DoRandomEvent();
                        else
                        {
                            DoAirdropEvent();
                        }
                    }
                    break;

                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    if (Plugin.DisableBlackout.Value == true) DoRandomEvent();
                    else
                    {
                        DoBlackoutEvent();
                    }
                    break;

                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                    if (Plugin.NoJokesHere.Value == true) DoFunny();
                    else
                    {
                        DoDamageEvent();
                    }
                    break;

                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                    if (Plugin.DisableArmorRepair.Value == true) DoRandomEvent();
                    else
                    {
                        DoArmorRepair();
                    }
                    break;

                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                    if (Plugin.DisableHeal.Value == true) DoRandomEvent();
                    else
                    {
                        ValueStruct health = player.ActiveHealthController.GetBodyPartHealth(EBodyPart.Common);
                        if (health.Current != health.Maximum)
                        {
                            DoHealPlayer();
                            break;
                        }
                        DoRandomEvent();
                    }
                    break;

                    //case xx:
                    //DoLockDownEvent();
                    //break;
                    //case xx:
                    //DoHuntedEvent();
                    //break;
            }
        }

        void DoHealPlayer()
        {
            NotificationManagerClass.DisplayMessageNotification("Heal Event: On your feet you ain't dead yet.");
            player.ActiveHealthController.RestoreFullHealth();
        }

        void DoDamageEvent()
        {
            NotificationManagerClass.DisplayMessageNotification("Heart Attack Event: Better get to a medic quick, you don't have long left.");
            player.PlayerHealthController.DoContusion(4, 50);
            player.ActiveHealthController.DoStun(5, 0);
            player.ActiveHealthController.DoFracture(EBodyPart.LeftArm);
            player.ActiveHealthController.ApplyDamage(EBodyPart.Chest, 65, Blunt);
        }

        void DoArmorRepair()
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


        void DoAirdropEvent()
        {
            gameWorld.gameObject.AddComponent<AirdropsManager>().isFlareDrop = true;
            NotificationManagerClass.DisplayMessageNotification("Aidrop Event: Incoming Airdrop!", ENotificationDurationType.Long, ENotificationIconType.Default);
        }

        async void DoFunny()
        {
            NotificationManagerClass.DisplayMessageNotification("Heart Attack Event: Nice knowing ya, you've got 10 seconds", ENotificationDurationType.Long, ENotificationIconType.Alert);
            await Task.Delay(10000);
            NotificationManagerClass.DisplayMessageNotification("jk", ENotificationDurationType.Long, ENotificationIconType.Default);
            await Task.Delay(2000); DoRandomEvent();
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

        async void DoBlackoutEvent()
        {
            LampController[] dontChangeOnEnd = new LampController[0];

            foreach (Switch pSwitch in _switchs)
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

            foreach (KeycardDoor door in _kdoor)
            {
                typeof(KeycardDoor).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                AudioSource.PlayClipAtPoint(door.DeniedBeep, door.gameObject.transform.position);
            }

            NotificationManagerClass.DisplayMessageNotification("Blackout Event: All power switches and lights disabled for 10 minutes", ENotificationDurationType.Long, ENotificationIconType.Alert);

            await Task.Delay(600000);

            foreach (Switch pSwitch in _switchs)
            {
                typeof(Switch).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
            }

            foreach (LampController lamp in _lamp)
            {
                if (dontChangeOnEnd.Contains(lamp)) continue;
                lamp.Switch(Turnable.EState.On);
                lamp.enabled = true;
            }

            foreach (KeycardDoor door in _kdoor)
                await Task.Run(async () =>
                {
                    int timesToBeep = 3;
                    await Task.Delay(5000);

                    goto beep;

                beep:
                    await Task.Delay(500);

                    if (timesToBeep == 0)
                        goto unlock;

                    AudioSource.PlayClipAtPoint(door.DeniedBeep, door.gameObject.transform.position);
                    goto beep;

                unlock:
                    typeof(KeycardDoor).GetMethod("Lock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                    AudioSource.PlayClipAtPoint(door.UnlockSound, door.gameObject.transform.position);
                    return;

                });

            NotificationManagerClass.DisplayMessageNotification("Blackout Event over", ENotificationDurationType.Long, ENotificationIconType.Quest);
        }

        public bool Ready() => gameWorld != null && gameWorld.AllAlivePlayersList != null && gameWorld.AllAlivePlayersList.Count > 0 && !(player is HideoutPlayer);
    }
}