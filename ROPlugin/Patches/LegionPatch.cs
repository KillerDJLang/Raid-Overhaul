using System.Reflection;
using EFT;
using HarmonyLib;
using UnityEngine;
using SPT.Reflection.Patching;

namespace RaidOverhaul.Patches
{
    [HarmonyPatch]
    internal class LegionSmethodPatch : ModulePatch {
        protected override MethodBase GetTargetMethod() =>
            typeof(GClass598).GetMethod("smethod_1", BindingFlags.Static | BindingFlags.Public);

        [PatchPrefix]
        private static bool Smethod1Prefix(BotDifficulty d, WildSpawnType role, bool external, ref BotSettingsComponents __result) {
            if (role == (WildSpawnType)199) {
                if (Plugin.legionText != null) {
                    __result = BotSettingsComponents.Create(Plugin.legionText.text);
                    return false;
                }
                else {
                    Debug.LogError($"Failed to load Legion settings text asset.");
                }
            }
            return true;
        }
    }
}