using BepInEx;
using Comfort.Common;
using UnityEngine;
using EFT;
using EFT.Interactive;
using System.Linq;
using RaidOverhaul.Helpers;

namespace RaidOverhaul.Controllers
{
    public class KeyController : MonoBehaviour
    {
        private static Door[] _door = null;
        private static KeycardDoor[] _kdoor = null;

        public static void PatchLocks()
        {
            if (HasSkeletonKey())
            {
                if (_door == null)
                {
                    _door = FindObjectsOfType<Door>();
                }

                foreach (Door door in _door)
                {
                    if (!door.KeyId.IsNullOrWhiteSpace() || !door.KeyId.IsNullOrEmpty())
                    {
                        door.KeyId = Utils.skeletonKey;
                    }
                }
            }

            if (HasKeycard())
            {
                if (_kdoor == null)
                {
                    _kdoor = FindObjectsOfType<KeycardDoor>();
                }

                foreach (KeycardDoor kDoor in _kdoor)
                {
                    if (!kDoor.KeyId.IsNullOrWhiteSpace() || !kDoor.KeyId.IsNullOrEmpty())
                    {
                        kDoor.KeyId = Utils.vipKeycard;
                    }
                }
            }
        }

        private static bool HasKeycard()
        {
            return Singleton<GameWorld>.Instance.MainPlayer.Profile.Inventory.Equipment.GetAllItems().Any(x => x.TemplateId == Utils.vipKeycard);
        }

        private static bool HasSkeletonKey()
        {
            return Singleton<GameWorld>.Instance.MainPlayer.Profile.Inventory.Equipment.GetAllItems().Any(x => x.TemplateId == Utils.skeletonKey);
        }
    }
}