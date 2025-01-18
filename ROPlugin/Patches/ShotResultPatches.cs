using EFT;
using System;
using UnityEngine;
using System.Linq;
using Comfort.Common;
using System.Reflection;
using EFT.InventoryLogic;
using SPT.Reflection.Patching;

namespace RaidOverhaul.Patches
{
    internal struct PlayerInfo
    {
        internal static GameWorld gameWorld
        { get => Singleton<GameWorld>.Instance; }

        internal static Player.FirearmController FC
        { get => player.HandsController as Player.FirearmController; }

        internal static Player player
        { get => gameWorld.MainPlayer; }

        internal static bool PlayerHasEarPro()
        {
            CompoundItem helm;

            if (player.Profile.Inventory.Equipment.GetSlot(EquipmentSlot.Earpiece).ContainedItem != null)
                return true;

            if ((helm = player.Profile.Inventory.Equipment.GetSlot(EquipmentSlot.Headwear).ContainedItem as CompoundItem) != null)
            {
                SlotBlockerComponent blocker = helm.GetItemComponent<SlotBlockerComponent>();
                if (blocker != null && blocker.ConflictingSlotNames.Contains("Earpiece"))
                    return true;

                return helm.Slots.Any(slot => slot.ContainedItem != null && slot.ContainedItem.GetItemComponent<SlotBlockerComponent>() != null && slot.ContainedItem.GetItemComponent<SlotBlockerComponent>().ConflictingSlotNames.Contains("Earpiece"));
            }

            return false;
        }
    }

    public class DeafnessPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod() => typeof(Player.FirearmController).GetMethod("RegisterShot", BindingFlags.Instance | BindingFlags.Public);

        [PatchPostfix]
        static void Postfix(Player.FirearmController __instance, object shot)
        {
            if (PlayerInfo.player is HideoutPlayer) return;

            float bulletSpeed = (float)shot.GetType().GetField("Speed", BindingFlags.Instance | BindingFlags.Public).GetValue(shot);

            if (PlayerInfo.FC == __instance && GoodToDeafen(bulletSpeed))
                DoEarDamage(false);
            else if (TargetGoodToDeafen(__instance, bulletSpeed))
                DoEarDamage(true);
        }

        static bool TargetGoodToDeafen(Player.FirearmController target, float bulletSpeed) => Vector3.Distance(target.gameObject.transform.position, PlayerInfo.player.Transform.position) <= 45 && !PlayerInfo.PlayerHasEarPro() && !target.IsSilenced && bulletSpeed > 343f;

        static bool GoodToDeafen(float bulletSpeed) => !PlayerInfo.PlayerHasEarPro() && !PlayerInfo.FC.IsSilenced && (bulletSpeed > 343f || PlayerInfo.player.Environment == EnvironmentType.Indoor);

        static void DoEarDamage(bool invokedByBot)
        {
            if (!invokedByBot && PlayerInfo.FC.Item.AmmoCaliber == "86x70")
            {
                try
                {
                    PlayerInfo.player.ActiveHealthController.DoStun(1, 0);
                    PlayerInfo.player.ActiveHealthController.DoContusion(4, 50);
                }
                catch (Exception ex)
                {
                    Plugin.Log.LogError("Attempting to access ActiveHealthController resulted in an exception" + ex);
                }
            }
            try
            {
                PlayerInfo.player.ActiveHealthController.DoStun(1, 0);
                PlayerInfo.player.ActiveHealthController.DoContusion(0, 100);
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
        static void Prefix(Grenade __instance)
        {
            float dist = Vector3.Distance(__instance.transform.position, PlayerInfo.player.Transform.position);
            if (!PlayerInfo.PlayerHasEarPro() && dist <= 30)
            {
                PlayerInfo.player.ActiveHealthController.DoStun(1, 0);
                PlayerInfo.player.ActiveHealthController.DoContusion(30 / (dist / 2), 100 / dist);
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
                    PlayerInfo.player.ActiveHealthController.DoStun(1, 0);
                    PlayerInfo.player.ActiveHealthController.DoContusion(4, hsDmg * 1.5f);
                }
                catch (Exception ex)
                {
                    Plugin.Log.LogError("Attempting to access ActiveHealthController resulted in an exception" + ex);
                }
            }
        }
    }
}