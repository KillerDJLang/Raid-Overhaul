
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
            var _switchWeighting = DJConfig.PowerOn.Value ? 2 : 0;
            var _doorWeighting = DJConfig.DoorUnlock.Value ? 10 : 0;
            var _keycardWeighting = DJConfig.KDoorUnlock.Value ? 1 : 0;

            weightedDoorMethods = new List<(Action, int)>
            {
                (Plugin.DCScript.PowerOn,     _switchWeighting),
                (Plugin.DCScript.DoUnlock,    _doorWeighting),
                (Plugin.DCScript.DoKUnlock,   _keycardWeighting)
            };
        }

        private static void InitEventWeighting()
        {
            var _damageWeighting = DJConfig.NoJokesHere.Value ? 4 : 0;
            var _airdropWeighting = DJConfig.Airdrop.Value ? 16 : 0;
            var _blackoutWeighting = DJConfig.Blackout.Value ? 8 : 0;
            var _jokeWeighting = DJConfig.JokesAndFun.Value ? 4 : 0;
            var _healWeighting = DJConfig.Heal.Value ? 12 : 0;
            var _armorWeighting = DJConfig.ArmorRepair.Value ? 14 : 0;
            var _skillWeighting = DJConfig.Skill.Value ? 6 : 0;
            var _metWeighting = DJConfig.Metabolism.Value ? 6 : 0;
            var _malfWeighting = DJConfig.Malfunction.Value ? 4 : 0;
            var _traderWeighting = DJConfig.Trader.Value ? 3 : 0;
            var _berserkWeighting = DJConfig.Berserk.Value ? 4 : 0;
            var _overweightWeightingLOL = DJConfig.Overweight.Value ? 4 : 0;
            var _maxLLWeighting = DJConfig.ShoppingSpree.Value ? 1 : 0;
            var _exfilWeightings = DJConfig.ExfilLockdown.Value ? 1 : 0;

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
                (Plugin.ECScript.DoWeightEvent,     _overweightWeightingLOL),
                (Plugin.ECScript.DoMaxLLEvent,      _maxLLWeighting),
                (Plugin.ECScript.DoLockDownEvent,   _exfilWeightings)
            };
        }
    }
}
