using EFT;
using System;
using UnityEngine;
using System.Linq;
using System.Reflection;
using EFT.InventoryLogic;
using SPT.Reflection.Patching;

namespace RaidOverhaul.Patches
{
    internal struct PlayerInfo
    {
        internal static bool PlayerHasEarPro()
        {
            CompoundItem helm;

            if (Plugin.ROPlayer.Profile.Inventory.Equipment.GetSlot(EquipmentSlot.Earpiece).ContainedItem != null)
                return true;

            if ((helm = Plugin.ROPlayer.Profile.Inventory.Equipment.GetSlot(EquipmentSlot.Headwear).ContainedItem as CompoundItem) != null)
            {
                SlotBlockerComponent blocker = helm.GetItemComponent<SlotBlockerComponent>();
                if (blocker != null && blocker.ConflictingSlotNames.Contains("Earpiece"))
                    return true;

                return helm.Slots.Any(slot => slot.ContainedItem != null && slot.ContainedItem.GetItemComponent<SlotBlockerComponent>() != null && slot.ContainedItem.GetItemComponent<SlotBlockerComponent>().ConflictingSlotNames.Contains("Earpiece"));
            }

            return false;
        }
    }

    internal class DeafnessPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod() => typeof(Player.FirearmController).GetMethod("RegisterShot", BindingFlags.Instance | BindingFlags.Public);

        [PatchPostfix]
        private static void Postfix(Player.FirearmController __instance, object shot)
        {
            if (Plugin.ROPlayer is HideoutPlayer) return;

            float bulletSpeed = (float)shot.GetType().GetField("Speed", BindingFlags.Instance | BindingFlags.Public).GetValue(shot);

            if (Plugin.ROFirearmController == __instance && GoodToDeafen(bulletSpeed))
                DoEarDamage(false);
            else if (TargetGoodToDeafen(__instance, bulletSpeed))
                DoEarDamage(true);
        }

        private static bool TargetGoodToDeafen(Player.FirearmController target, float bulletSpeed) => Vector3.Distance(target.gameObject.transform.position, Plugin.ROPlayer.Transform.position) <= 45 && !PlayerInfo.PlayerHasEarPro() && !target.IsSilenced && bulletSpeed > 343f;

        private static bool GoodToDeafen(float bulletSpeed) => !PlayerInfo.PlayerHasEarPro() && !Plugin.ROFirearmController.IsSilenced && (bulletSpeed > 343f || Plugin.ROPlayer.Environment == EnvironmentType.Indoor);

        private static void DoEarDamage(bool invokedByBot)
        {
            if (!invokedByBot && Plugin.ROFirearmController.Item.AmmoCaliber == "86x70")
            {
                try
                {
                    Plugin.ROPlayer.ActiveHealthController.DoStun(1, 0);
                    Plugin.ROPlayer.ActiveHealthController.DoContusion(4, 50);
                }
                catch (Exception ex)
                {
                    Plugin.Log.LogError("Attempting to access ActiveHealthController resulted in an exception" + ex);
                }
            }
            try
            {
                Plugin.ROPlayer.ActiveHealthController.DoStun(1, 0);
                Plugin.ROPlayer.ActiveHealthController.DoContusion(0, 100);
            }
            catch (Exception ex)
            {
                Plugin.Log.LogError("Attempting to access ActiveHealthController resulted in an exception" + ex);
            }
        }
    }

    public class GrenadeDeafnessPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return typeof(Grenade).GetMethod(nameof(Grenade.OnExplosion), BindingFlags.Instance | BindingFlags.Public);
        }

        [PatchPrefix]
        private static void Prefix(Grenade __instance)
        {
            float dist = Vector3.Distance(__instance.transform.position, Plugin.ROPlayer.Transform.position);
            if (!PlayerInfo.PlayerHasEarPro() && dist <= 30)
            {
                Plugin.ROPlayer.ActiveHealthController.DoStun(1, 0);
                Plugin.ROPlayer.ActiveHealthController.DoContusion(30 / (dist / 2), 100 / dist);
            }
        }
    }

    public class ConcussionPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return typeof(Player).GetMethod("ApplyShot", BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly);
        }

        [PatchPostfix]
        private static void PatchPostfix(
            Player __instance,
            DamageInfoStruct damageInfo,
            EBodyPart bodyPartType,
            EBodyPartColliderType colliderType,
            EArmorPlateCollider armorPlateCollider,
            ShotIdStruct shotId)
        {
            if (bodyPartType == EBodyPart.Head && !string.IsNullOrEmpty(damageInfo.BlockedBy))
            {
                float hsDmg = damageInfo.Damage;
                
                try
                {
                    Plugin.ROPlayer.ActiveHealthController.DoStun(1, 0);
                    Plugin.ROPlayer.ActiveHealthController.DoContusion(4, hsDmg * 1.5f);
                }
                catch (Exception ex)
                {
                    Plugin.Log.LogError("Attempting to access ActiveHealthController resulted in an exception" + ex);
                }
            }
        }
    }
}