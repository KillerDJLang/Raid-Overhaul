﻿using System.Reflection;
using EFT;
using Aki.Reflection.Patching;

namespace DJsRaidOverhaul.Patches
{
    public class HitStaminaPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return typeof(Player).GetMethod("ApplyHitDebuff", BindingFlags.Instance | BindingFlags.Public);
        }

        [PatchPrefix]
        static bool Prefix(ref float staminaBurnRate)
        {
            staminaBurnRate *= Plugin.GetStrength();

            return true;
        }
    }
}