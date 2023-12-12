using System;
using EFT;
using System.Reflection;
using Aki.Reflection.Patching;

namespace DJsRaidOverhaul.Patches
{
    public class OnDeadPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod() =>
            typeof(Player).GetMethod("OnDead", BindingFlags.Instance | BindingFlags.NonPublic);

        [PatchPostfix]
        private static void PatchPostFix(ref Player __instance)
        {
            if (Plugin.DropBackPack.Value && Plugin.DropBackPackChance.Value > new Random().NextDouble())
            {
                __instance.DropBackpack();
            }
        }
    }
}