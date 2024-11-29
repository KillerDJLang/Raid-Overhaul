using System.Reflection;
using SPT.Reflection.Patching;
using EFT;

namespace RaidOverhaul.Patches
{
    public class GameWorldDisposePatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return typeof(GameWorld).GetMethod(nameof(GameWorld.Dispose));
        }

        [PatchPrefix]
        private static void PatchPrefix()
        {
            Plugin.Controllers.Clear();
        }
    }
}