using EFT;
using System;
using System.Reflection;
using SPT.Reflection.Patching;
using RaidOverhaul.Helpers;

namespace RaidOverhaul.Patches
{
    public class OnDeadPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod() =>
            typeof(Player).GetMethod("OnDead", BindingFlags.Instance | BindingFlags.Public);

        [PatchPostfix]
        private static void PatchPostFix(ref Player __instance)
        {
            if (DJConfig.DropBackPack.Value && DJConfig.DropBackPackChance.Value > new Random().NextDouble())
            {
                __instance.DropBackpack();
            }
        }
    }
}