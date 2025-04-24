using EFT;
using System.Reflection;
using SPT.Reflection.Patching;
using RaidOverhaul.Controllers;

namespace RaidOverhaul.Patches
{
    internal class RandomizeDefaultStatePatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return typeof(GameWorld).GetMethod(nameof(GameWorld.OnGameStarted));
        }

        [PatchPrefix]
        private static void PatchPrefix()
        {
            DoorController.RandomizeDefaultDoors();
            DoorController.RandomizeLampState();
        }
    }
}