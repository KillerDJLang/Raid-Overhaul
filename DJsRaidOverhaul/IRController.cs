using EFT;
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
using TMPro;

namespace DJsRaidOverhaul
{
    public class IRController : MonoBehaviour
    {
        float timer;
        float eventTimer;
        float PowerTimer;
        float PowerOnTimeRange = Random.Range(60f, 180f);
        float timeToNextEvent = Random.Range(60f, 1800f);
        bool exfilUIChanged = false;

        Player player
        { get => gameWorld.MainPlayer; }

        GameWorld gameWorld
        { get => Singleton<GameWorld>.Instance; }

        RaidSettings raidSettings
        { get => Singleton<RaidSettings>.Instance; }


        void Update()
        {
            RaidTime.inverted = MonoBehaviourSingleton<MenuUI>.Instance == null || MonoBehaviourSingleton<MenuUI>.Instance.MatchMakerSelectionLocationScreen == null
            ? RaidTime.inverted
            : !((EDateTime)typeof(MatchMakerSelectionLocationScreen).GetField("edateTime_0", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(MonoBehaviourSingleton<MenuUI>.Instance.MatchMakerSelectionLocationScreen) == EDateTime.CURR);

            if (!Ready())
            {
                timer = 0f;
                eventTimer = 0f;
                PowerTimer = 0f;
                return;
            }

            timer += Time.deltaTime;
            if (Plugin.EnableEvents.Value) eventTimer += Time.deltaTime;

            if (eventTimer >= timeToNextEvent)
            {
                DoRandomEvent();
                eventTimer = 0f;
                timeToNextEvent = Random.Range(1800f, 3600f);
            }

            if (Plugin.EnablePowerChanges.Value) PowerTimer += Time.deltaTime;

            if (PowerTimer >= PowerOnTimeRange)
            {
                PowerOn();
                eventTimer = 0f;
                PowerOnTimeRange = 999999f;
            }

                if (EventExfilPatch.IsLockdown || EventExfilPatch.awaitDrop)
                if (!exfilUIChanged)
                    ChangeExfilUI();
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

        void DoRandomEvent(bool skipFunny = false)
        {
            float rand = Random.Range(0, 5);

            switch (rand)
            {
                case 0:
                    DoArmorRepair();
                    break;

                case 1:
                    if (skipFunny) DoRandomEvent();
                    DoFunny();
                    break;

                case 2:
                    DoBlackoutEvent();
                    break;

                case 3:
                    DoPowerSurgeEvent();
                    break;

                case 4:
                    if (player.Location == "Factory" || player.Location == "Laboratory") DoRandomEvent();
                    DoAirdropEvent();
                    break;

                case 5:
                    ValueStruct health = player.ActiveHealthController.GetBodyPartHealth(EBodyPart.Common);
                    if (health.Current != health.Maximum)
                    {
                        DoHealPlayer();
                        break;
                    }
                    else DoRandomEvent();
                    break;

                case 6:
                    DoLockDownEvent();
                    break;
                    //case 7:
                    //DoHuntedEvent();
                    //break;
            }
        }

        /*/
        void DoHuntedEvent()
        {
            NotificationManagerClass.DisplayMessageNotification("Hunted Event: AI will now hunt you down for 10 minutes.", ENotificationDurationType.Long, ENotificationIconType.Alert);
        }
        /**/

        void DoHealPlayer()
        {
            NotificationManagerClass.DisplayMessageNotification("Heal Event: On your feet you ain't dead yet.");
            player.ActiveHealthController.RestoreFullHealth();
        }

        void DoArmorRepair()
        {
            NotificationManagerClass.DisplayMessageNotification("Armor Repair Event: All equipped armor repaired... nice!", ENotificationDurationType.Long, ENotificationIconType.Default);
            player.Profile.Inventory.GetAllEquipmentItems().ExecuteForEach((Item item) =>
            {
                if (item.GetItemComponent<ArmorComponent>() != null) item.GetItemComponent<RepairableComponent>().Durability = item.GetItemComponent<RepairableComponent>().MaxDurability;
            });
        }

        //async void DoHuntedEvent()
        //{
        //    NotificationManagerClass.DisplayMessageNotification("Hunted Event: The enemy knows your position, hold out as long as you can.", ENotificationDurationType.Long, ENotificationIconType.Alert);
        //   raidSettings.WavesSettings.IsTaggedAndCursed = true;
        //    await Task.Delay(10000);
        //    NotificationManagerClass.DisplayMessageNotification("You survived, congratulations.", ENotificationDurationType.Long, ENotificationIconType.Default);
        //    raidSettings.WavesSettings.IsTaggedAndCursed = false;
        //}

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
            await Task.Delay(2000); DoRandomEvent(true);
        }

        async void DoLockDownEvent()
        {
            NotificationManagerClass.DisplayMessageNotification("Lockdown Event: All extracts are unavaliable for 15 minutes", ENotificationDurationType.Long, ENotificationIconType.Alert);
            EventExfilPatch.IsLockdown = true;

            await Task.Delay(900000);

            EventExfilPatch.IsLockdown = false;
            NotificationManagerClass.DisplayMessageNotification("Lockdown Event over", ENotificationDurationType.Long, ENotificationIconType.Quest);
        }

        async void DoBlackoutEvent()
        {
            LampController[] dontChangeOnEnd = new LampController[0];

            foreach (Switch pSwitch in FindObjectsOfType<Switch>())
            {
                typeof(Switch).GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
                typeof(Switch).GetMethod("Lock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
            }

            foreach (LampController lamp in FindObjectsOfType<LampController>())
            {
                if (lamp.enabled == false)
                {
                    dontChangeOnEnd.Append(lamp);
                    continue;
                }
                lamp.Switch(Turnable.EState.Off);
                lamp.enabled = false;
            }

            foreach (KeycardDoor door in FindObjectsOfType<KeycardDoor>())
            {
                typeof(KeycardDoor).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                AudioSource.PlayClipAtPoint(door.DeniedBeep, door.gameObject.transform.position);
            }

            NotificationManagerClass.DisplayMessageNotification("Blackout Event: All power switches and lights disabled for 10 minutes", ENotificationDurationType.Long, ENotificationIconType.Alert);

            await Task.Delay(600000);

            foreach (Switch pSwitch in FindObjectsOfType<Switch>())
            {
                typeof(Switch).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
            }

            foreach (LampController lamp in FindObjectsOfType<LampController>())
            {
                if (dontChangeOnEnd.Contains(lamp)) continue;
                lamp.Switch(Turnable.EState.On);
                lamp.enabled = true;
            }

            foreach (KeycardDoor door in FindObjectsOfType<KeycardDoor>())
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

        async void DoPowerSurgeEvent()
        {
            foreach (Switch pSwitch in FindObjectsOfType<Switch>())
            {
                typeof(Switch).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
            }

            NotificationManagerClass.DisplayMessageNotification("Power Surge Event: All power switches are enabled for 10 minutes", ENotificationDurationType.Long, ENotificationIconType.Alert);
            await Task.Delay(600000);

            foreach (Switch pSwitch in FindObjectsOfType<Switch>())
            {
                typeof(Switch).GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
            };

            NotificationManagerClass.DisplayMessageNotification("Power Surge over", ENotificationDurationType.Long, ENotificationIconType.Quest);
        }

        void PowerOn()
        {
            foreach (Switch pSwitch in FindObjectsOfType<Switch>())
            {
                typeof(Switch).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(pSwitch, null);
            }
        }

        public bool Ready() => gameWorld != null && gameWorld.AllAlivePlayersList != null && gameWorld.AllAlivePlayersList.Count > 0 && !(player is HideoutPlayer);
    }
}
