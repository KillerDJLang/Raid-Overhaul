using EFT;
using TMPro;
using System;
using System.Reflection;
using HarmonyLib;
using EFT.UI.Map;
using EFT.UI.Matchmaker;
using UnityEngine.UI;
using SPT.Reflection.Patching;
using RaidOverhaul.Helpers;

namespace RaidOverhaul.Patches
{

    public struct RaidTime
    {
        internal static bool inverted = false;

        private static DateTime inverseTime
        {
            get
            {
                DateTime result = DateTime.Now.AddHours(12);
                return result.Day > DateTime.Now.Day
                       ? result.AddDays(-1)
                       : result.Day < DateTime.Now.Day
                       ? result.AddDays(1) : result;
            }
        }

        public static DateTime GetCurrTime() => DateTime.Now;
        public static DateTime GetInverseTime() => inverseTime;
        public static DateTime GetDateTime() => inverted ? GetInverseTime() : GetCurrTime();
    }

    public class EnableEntryPointPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod() => typeof(EntryPointView).GetMethod("Show", BindingFlags.Instance | BindingFlags.Public);

        [PatchPrefix]
        static void Prefix(ref bool allowSelection) => allowSelection = true;
    }
    
    public class WatchPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod() => typeof(Watch).GetProperty("DateTime_0", BindingFlags.Instance | BindingFlags.Public).GetGetMethod(true);

        [PatchPostfix]
        static void Postfix(ref DateTime __result)
        {
            __result = RaidTime.GetDateTime();
        }
    }

    //
    //
    //

    internal class OnGameStartedPatch : ModulePatch 
    {

        protected override MethodBase GetTargetMethod()
        {
            return AccessTools.Method(typeof(GameWorld), nameof(GameWorld.OnGameStarted));
        }

        [PatchPostfix]
        static void Postfix()
        {
            Utils.SetRaidTime(5f);
        }
    }

    internal class TimeUIUpdatePatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return AccessTools.Method(typeof(LocationConditionsPanel), nameof(LocationConditionsPanel.Update));
        }

        [PatchPrefix]
        static bool Prefix()
        {
            return false;
        }
    }

    internal class TimeUIPanelPatch : ModulePatch
    {
        protected override MethodBase GetTargetMethod()
        {
            return AccessTools.Method(typeof(LocationConditionsPanel), nameof(LocationConditionsPanel.Set));
        }

        [PatchPostfix]
        static void Postfix(
            RaidSettings raidSettings,
            bool takeFromCurrent,
            ref TextMeshProUGUI ____currentPhaseTime,
            ref TextMeshProUGUI ____nextPhaseTime,
            ref Toggle ____pmTimeToggle,
            ref Toggle ____amTimeToggle
        )
        {
            DateTime dateTime = Utils.GetCurrentGameTime();
            DateTime inverseDateTime = Utils.GetInverseGameTime();

            if (raidSettings.SelectedLocation.Id == "factory4_day" || raidSettings.SelectedLocation.Id == "factory4_night") {
                Utils.EnableTimeUI(____currentPhaseTime, ____amTimeToggle, "15:28:00", false);
                Utils.EnableTimeUI(____nextPhaseTime, ____pmTimeToggle, "03:28:00", false);
                return;
            }

            Utils.EnableTimeUI(____nextPhaseTime, ____pmTimeToggle, inverseDateTime.ToString("HH:mm:ss"));
            Utils.EnableTimeUI(____currentPhaseTime, ____amTimeToggle, dateTime.ToString("HH:mm:ss"));
        }
    }

    internal class LocationConditionsPanelPatch : ModulePatch
    {

        protected override MethodBase GetTargetMethod()
        {
            return AccessTools.FirstMethod(typeof(LocationConditionsPanel), x => x.Name == nameof(LocationConditionsPanel.Set) && x.GetParameters()[0].Name == "session");
        }

        [PatchPostfix]
        static void Postfix(RaidSettings raidSettings, bool takeFromCurrent, MatchMakerAcceptScreen __instance)
        {
            TextMeshProUGUI timePanel;

            try {
                timePanel = __instance.transform.Find("TimePanel").gameObject.transform.Find("Time").gameObject.GetComponent<TextMeshProUGUI>();
            }
            catch (Exception) { return; }

            if (raidSettings.SelectedLocation.Id == "factory4_day" || raidSettings.SelectedLocation.Id == "factory4_night") {
                if (Utils.IsDayTime(Utils.GetCurrentGameTime())) {
                    SetTimePanelText(timePanel, "15:28:00");
                }
                else {
                    SetTimePanelText(timePanel, "03:28:00");
                }
                return;
            }

            SetTimePanelText(timePanel, Utils.GetCurrentGameTime().ToString("HH:mm:ss"));
        }

        static void SetTimePanelText(TextMeshProUGUI timePanel, string text)
        {
            try {
                timePanel.text = text;
            } catch(Exception) { }
        }
    }
}