using EFT;
using UnityEngine;
using Comfort.Common;
using EFT.Interactive;
using System.Reflection;
using EFT.Communications;
using System.Collections;
using System;
using System.Linq;
using DJsRaidOverhaul.Helpers;

namespace DJsRaidOverhaul.Controllers
{
    internal class DoorController : MonoBehaviour
    {
        private Switch[] _switchs = null;
        private Door[] _door = null;
        private KeycardDoor[] _kdoor = null;
        private bool _dooreventisRunning = false;

        Player player
        { get => gameWorld.MainPlayer; }

        GameWorld gameWorld
        { get => Singleton<GameWorld>.Instance; }

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
                DoRandomUnlock();
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

        void DoRandomUnlock()
        {
            // Shuffle the list to randomize the order
            Plugin.weightedDoorMethods = Plugin.weightedDoorMethods.OrderBy(_ => Guid.NewGuid()).ToList();

            // Calculate total weight
            int totalWeight = Plugin.weightedDoorMethods.Sum(pair => pair.Item2);

            // Generate a random number between 1 and totalWeight
            int randomNum = new System.Random().Next(1, totalWeight + 1);

            // Find the method to call based on the random number
            foreach (var (method, weight) in Plugin.weightedDoorMethods)
            {
                randomNum -= weight;
                if (randomNum <= 0)
                {
                    // Call the selected method
                    method();
                    break;
                }
            }
        }

        public void PowerOn()
        {
            if (_switchs == null || _switchs.Length <= 0)
            {
                if (DJConfig.DebugLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("No switches available, returning.", ENotificationDurationType.Default);
                }
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_switchs.Length);
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
                DoRandomUnlock();
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
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_door.Length);
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
                DoRandomUnlock();
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
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_kdoor.Length);
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
                DoRandomUnlock();
            }
        }

        public static void RandomizeDefaultDoors()
        {
            FindObjectsOfType<Door>().ExecuteForEach(door =>
            {
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

                if (UnityEngine.Random.Range(0, 100) < 50 && (door.DoorState == EDoorState.Shut))
                {
                    typeof(Door).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                }

                if (UnityEngine.Random.Range(0, 100) < 50 && (door.DoorState == EDoorState.Open))
                {
                    typeof(Door).GetMethod("Close", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                }
            });

            if (DJConfig.DebugLogging.Value)
            {
                NotificationManagerClass.DisplayMessageNotification("Starting doors have been randomized.", ENotificationDurationType.Default);
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
