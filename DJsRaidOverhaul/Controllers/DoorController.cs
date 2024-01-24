using EFT;
using System;
using UnityEngine;
using Comfort.Common;
using EFT.Interactive;
using System.Reflection;
using EFT.Communications;
using System.Collections;
using DJsRaidOverhaul.Helpers;

namespace DJsRaidOverhaul.Controllers
{
    internal class DoorController : MonoBehaviour
    {
        private Switch[] _switchs = null;
        private Door[] _door = null;
        private KeycardDoor[] _kdoor = null;
        private bool _dooreventisRunning = false;

        GameWorld gameWorld
        { get => Singleton<GameWorld>.Instance; }

        Player player
        { get => gameWorld.MainPlayer; }

        void Update()
        {
            if (!Ready() || !DJConfig.EnableDoorEvents.Value)
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

            if (!_dooreventisRunning)
            {
                StaticManager.Instance.StartCoroutine(DoorEvents());

                _dooreventisRunning = true;
            }
        }

        private IEnumerator DoorEvents()
        {
            yield return new WaitForSeconds(UnityEngine.Random.Range(DJConfig.DoorRangeMin.Value, DJConfig.DoorRangeMax.Value) * 60f);

            if (gameWorld != null && gameWorld.AllAlivePlayersList != null && gameWorld.AllAlivePlayersList.Count > 0 && !(player is HideoutPlayer))
            {
                Weighting.DoRandomEvent(Weighting.weightedDoorMethods);
            }

            else
            {
                _switchs = null;
                _door = null;
                _kdoor = null;
            }

            _dooreventisRunning = false;
            yield break;
        }

        public void PowerOn()
        {
            if (_switchs == null || _switchs.Length <= 0)
            {
                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("No switches available, returning.", ENotificationDurationType.Default);
                }
                DoUnlock();
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_switchs.Length + 1);
            Switch _switch = _switchs[selection];

            if (_switch.DoorState == EDoorState.Shut)
            {
                typeof(Switch).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(_switch, null);

                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("A random switch has been thrown.", ENotificationDurationType.Default);
                }

                RemoveAt(ref _switchs, selection);
            }

            else
            {
                RemoveAt(ref _door, selection);
                DoUnlock();
            }
        }

        public void DoUnlock()
        {
            if (_door == null || _door.Length <= 0)
            {
                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("No locked doors available, returning.", ENotificationDurationType.Default);
                }
                Weighting.DoRandomEvent(Weighting.weightedDoorMethods);
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_door.Length + 1);
            Door door = _door[selection];

            if (door.DoorState == EDoorState.Locked)
            {
                typeof(Door).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                typeof(Door).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);

                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("A random door has been unlocked.", ENotificationDurationType.Default);
                }

                RemoveAt(ref _door, selection);
            }

            else
            {
                RemoveAt(ref _door, selection);
                Weighting.DoRandomEvent(Weighting.weightedDoorMethods);
            }
        }

        public void DoKUnlock()
        {
            if (_kdoor == null || _kdoor.Length <= 0)
            {
                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("No keycard doors available, returning.", ENotificationDurationType.Default);
                }
                DoUnlock();
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_kdoor.Length + 1);
            KeycardDoor kdoor = _kdoor[selection];

            if (kdoor.DoorState == EDoorState.Locked)
            {
                typeof(KeycardDoor).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(kdoor, null);
                typeof(KeycardDoor).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(kdoor, null);

                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("A random keycard door has been unlocked.", ENotificationDurationType.Default);
                }

                RemoveAt(ref _kdoor, selection);
            }

            else
            {
                RemoveAt(ref _door, selection);
                DoUnlock();
            }
        }

        public static void RandomizeDefaultDoors()
        {
            if (DJConfig.EnableRaidStartEvents.Value)
            {
                FindObjectsOfType<Door>().ExecuteForEach(door =>
                {
                    System.Random random = new System.Random();

                    int chance = random.Next(0, 100 + 1);

                    if (!door.Operatable || !door.enabled)
                    {
                        return;
                    }

                    if (door.DoorState != EDoorState.Shut && door.DoorState != EDoorState.Open)
                    {
                        return;
                    }

                    if (door.DoorState == EDoorState.Locked)
                    {
                        return;
                    }

                    if (chance is >= 50 && (door.DoorState == EDoorState.Shut))
                    {
                        typeof(Door).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                    }

                    if (chance is >= 50 && (door.DoorState == EDoorState.Open))
                    {
                        typeof(Door).GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                    }
                });

                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("Starting doors have been randomized.", ENotificationDurationType.Default);
                }
            }
        }

        static void RemoveAt<T>(ref T[] array, int index)
        {
            if (index >= 0 && index < array.Length)
            {
                for (int i = index; i < array.Length - 1; i++)
                {
                    array[i] = array[i + 1];
                }

                Array.Resize(ref array, array.Length - 1);
            }
        }

        public bool Ready() => gameWorld != null && gameWorld.AllAlivePlayersList != null && gameWorld.AllAlivePlayersList.Count > 0 && !(player is HideoutPlayer);
    }
}
