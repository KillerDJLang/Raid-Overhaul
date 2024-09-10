using Mono.Cecil;
using BepInEx.Logging;
using System.IO;
using System.Reflection;
using System.Collections.Generic;
using LegionPreLoader.Helpers;

namespace LegionPreLoader.Patches
{
    public static class LegionWildSpawnTypePatch
    {
        public static IEnumerable<string> TargetDLLs { get; } = new[] { "Assembly-CSharp.dll" };

        public static void Patch(ref AssemblyDefinition assembly)
        {
            if (!ShouldPatchAssembly())
            { 
                Logger.CreateLogSource("Raid Overhaul PrePatch")
                      .LogWarning("Raid Overhaul plugin not detected, not patching assembly. Make sure you have installed or uninstalled the mod correctly.");
                return;
            }

            var wildSpawnType = assembly.MainModule.GetType("EFT.WildSpawnType");
            LegionUtils.AddEnumValue(ref wildSpawnType, LegionEnums.BossLegionName, LegionEnums.BossLegionValue);
        }

        
        private static bool ShouldPatchAssembly()
        {
            var patcherLoc = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var bepDir = Directory.GetParent(patcherLoc);
            var modDllLoc = Path.Combine(bepDir.FullName, "plugins", "RaidOverhaul", "RaidOverhaul.dll");
            
            return File.Exists(modDllLoc);
        }
    }
}