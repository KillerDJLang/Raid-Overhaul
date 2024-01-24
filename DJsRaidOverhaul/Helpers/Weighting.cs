
using System;
using System.Linq;
using System.Collections.Generic;

namespace DJsRaidOverhaul.Helpers
{
    public static class Weighting
    {
        public static List<(Action, int)> weightedEvents;
        public static List<(Action, int)> weightedDoorMethods;

        public static void InitWeightings()
        {
            InitDoorWeighting();
            InitEventWeighting();
        }

        public static void DoRandomEvent(List<(Action, int)> weighting)
        {
            // Shuffle the list to randomize the order
            weighting = weighting.OrderBy(_ => Guid.NewGuid()).ToList();

            // Calculate total weight
            int totalWeight = weighting.Sum(pair => pair.Item2);

            // Generate a random number between 1 and totalWeight
            int randomNum = new System.Random().Next(1, totalWeight + 1);

            // Find the method to call based on the random number
            foreach (var (method, weight) in weighting)
            {
                randomNum -= weight;
                if (randomNum <= 0)
                {
                    // Call the selected method
                    method();
                    break;
                }
            }
        }

        private static void LoadWeightings()
        {
            //TODO: Load weightings from disk json
        }

        private static void InitDoorWeighting()
        {
            weightedDoorMethods = new List<(Action, int)>
            {
                (Plugin.DCScript.PowerOn,     1),
                (Plugin.DCScript.DoUnlock,    8),
                (Plugin.DCScript.DoKUnlock,   1)
            };
        }

        private static void InitEventWeighting()
        {
            var _damageWeighting = DJConfig.NoJokesHere.Value ? 0 : 2;
            var _airdropWeighting = DJConfig.DisableAirdrop.Value ? 0 : 8;
            var _blackoutWeighting = DJConfig.DisableBlackout.Value ? 0 : 4;
            var _jokeWeighting = DJConfig.DisableJokesAndFun.Value ? 0 : 2;
            var _healWeighting = DJConfig.DisableHeal.Value ? 0 : 6;
            var _armorWeighting = DJConfig.DisableArmorRepair.Value ? 0 : 7;
            var _skillWeighting = DJConfig.DisableSkill.Value ? 0 : 3;
            var _metWeighting = DJConfig.DisableMetabolism.Value ? 0 : 3;
            var _malfWeighting = DJConfig.DisableMalfunction.Value ? 0 : 2;
            var _traderWeighting = DJConfig.DisableTrader.Value ? 0 : 1;
            var _berserkWeighting = DJConfig.DisableBerserk.Value ? 0 : 2;
            var _weightWeightingLOL = DJConfig.DisableWeight.Value ? 0 : 2;

            weightedEvents = new List<(Action, int)>
            {
                (Plugin.ECScript.DoDamageEvent,     _damageWeighting),
                (Plugin.ECScript.DoAirdropEvent,    _airdropWeighting),
                (Plugin.ECScript.DoBlackoutEvent,   _blackoutWeighting),
                (Plugin.ECScript.DoFunny,           _jokeWeighting),
                (Plugin.ECScript.DoHealPlayer,      _healWeighting),
                (Plugin.ECScript.DoArmorRepair,     _armorWeighting),
                (Plugin.ECScript.DoSkillEvent,      _skillWeighting),
                (Plugin.ECScript.DoMetabolismEvent, _metWeighting),
                (Plugin.ECScript.DoMalfEvent,       _malfWeighting),
                (Plugin.ECScript.DoLLEvent,         _traderWeighting),
                (Plugin.ECScript.DoBerserkEvent,    _berserkWeighting),
                (Plugin.ECScript.DoWeightEvent,     _weightWeightingLOL)
            };
        }
    }
}
