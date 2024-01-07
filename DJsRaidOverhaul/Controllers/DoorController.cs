using EFT;
using UnityEngine;
using Comfort.Common;
using EFT.Interactive;
using System.Reflection;
using EFT.Communications;
using System.Collections;
using System;

namespace DJsRaidOverhaul.Controllers
{
    internal class DoorController : MonoBehaviour
    {
        private Switch[] _switchs = null;
        private Door[] _door = null;
        private KeycardDoor[] _kdoor = null;
        private bool _dooreventisRunning = false;
        private bool _doorsAreRandomized = false;

        Player player
        { get => gameWorld.MainPlayer; }

        GameWorld gameWorld
        { get => Singleton<GameWorld>.Instance; }

        void Update()
        {
            if (!Ready() || !Plugin.EnableDoorEvents.Value)
            {
                _doorsAreRandomized = false;
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

                if (!_doorsAreRandomized)
                {
                    RandomizeDefaultDoors();
                    _doorsAreRandomized = true;
                }

                _dooreventisRunning = true;
            }
        }

        private IEnumerator DoorEvents()
        {
            yield return new WaitForSeconds(UnityEngine.Random.Range(Plugin.DoorRangeMin.Value, Plugin.DoorRangeMax.Value) * 60f);

            if (Ready())
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
            float rand = UnityEngine.Random.Range(0, 8);

            switch (rand)
            {
                case 0:
                case 1:
                    PowerOn();
                    break;
                case 2:
                case 3:
                    DoKUnlock();
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    DoUnlock();
                    break;
            }
        }

        private void PowerOn()
        {
            if (_switchs == null || _switchs.Length <= 0)
            {
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_switchs.Length);
            Switch _switch = _switchs[selection];

            if (!_switch.Operatable || !_switch.enabled)
            {
                return;
            }

            if (_switch.DoorState == EDoorState.Shut)
            {
                typeof(Switch).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(_switch, null);

                if (Plugin.ExtraLogging.Value)
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

        private void DoUnlock()
        {
            if (_door == null || _door.Length <= 0)
            {
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_door.Length);
            Door door = _door[selection];

            if (!door.Operatable || !door.enabled)
            {
                return;
            }

            if (door.DoorState == EDoorState.Locked)
            {
                typeof(Door).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);
                typeof(Door).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(door, null);

                if (Plugin.ExtraLogging.Value)
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

        private void DoKUnlock()
        {
            if (_kdoor == null || _kdoor.Length <= 0)
            {
                return;
            }

            System.Random random = new System.Random();

            int selection = random.Next(_kdoor.Length);
            KeycardDoor kdoor = _kdoor[selection];

            if (!kdoor.Operatable || !kdoor.enabled)
            {
                return;
            }

            if (kdoor.DoorState == EDoorState.Locked)
            {
                typeof(KeycardDoor).GetMethod("Unlock", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(kdoor, null);
                typeof(KeycardDoor).GetMethod("Open", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(kdoor, null);

                if (Plugin.ExtraLogging.Value)
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

        private void RandomizeDefaultDoors()
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

                if (Plugin.ExtraLogging.Value)
                {
                    NotificationManagerClass.DisplayMessageNotification("Starting doors have been randomized.", ENotificationDurationType.Default);
                }
            });
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
