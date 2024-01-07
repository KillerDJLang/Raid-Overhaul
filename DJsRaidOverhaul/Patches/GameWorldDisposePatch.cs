using System.Reflection;
using Aki.Reflection.Patching;
using EFT;

namespace DJsRaidOverhaul.Patches
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