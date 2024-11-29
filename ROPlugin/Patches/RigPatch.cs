using EFT.UI;
using System.Reflection;
using SPT.Reflection.Patching;
using RaidOverhaul.Helpers;

namespace RaidOverhaul.Patches
{
    public class RigPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return typeof(PreloaderUI).GetMethod("InitConsole");
        }

        [PatchPostfix]
        public static void Postfix(PreloaderUI __instance)
        {
            LayoutLoader.LoadRigLayouts();
        }
    }
}