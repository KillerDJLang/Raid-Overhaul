using EFT;
using System.Reflection;
using SPT.Reflection.Patching;
using RaidOverhaul.Controllers;

namespace RaidOverhaul.Patches
{
    public class KeyPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod() => typeof(GameWorld).GetMethod("OnGameStarted", BindingFlags.Instance | BindingFlags.Public);

        [PatchPostfix]
        private static void Postfix() 
        {
            KeyController.PatchLocks();
        }
    }
}