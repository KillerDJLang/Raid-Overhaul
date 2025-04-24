using HarmonyLib;
using System.Reflection;
using EFT.UI.DragAndDrop;
using EFT.InventoryLogic;
using SPT.Reflection.Patching;

namespace RaidOverhaul.Patches
{
    public class SpecialSlotPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return AccessTools.DeclaredMethod(typeof(GeneratedGridsView), nameof(GeneratedGridsView.Show));
        }

        [PatchPrefix]
        private static bool PatchPrefix(GeneratedGridsView __instance, CompoundItem compoundItem)
        {
            if (compoundItem.CurrentAddress.IsSpecialSlotAddress() && __instance.transform.parent.name.StartsWith("SpecialSlot"))
            {
                return false;
            }

            return true;
        }
    }
}