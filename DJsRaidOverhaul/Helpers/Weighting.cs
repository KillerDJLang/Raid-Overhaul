
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
            weightedEvents = new List<(Action, int)>
            {
                (Plugin.ECScript.DoDamageEvent,     2),
                (Plugin.ECScript.DoAirdropEvent,    8),
                (Plugin.ECScript.DoBlackoutEvent,   4),
                (Plugin.ECScript.DoFunny,           2),
                (Plugin.ECScript.DoHealPlayer,      6),
                (Plugin.ECScript.DoArmorRepair,     7),
                (Plugin.ECScript.DoSkillEvent,      3),
                (Plugin.ECScript.DoMetabolismEvent, 3),
                (Plugin.ECScript.DoMalfEvent,       2),
                (Plugin.ECScript.DoLLEvent,         1),
                (Plugin.ECScript.DoBerserkEvent,    2),
                (Plugin.ECScript.DoWeightEvent,     2)
            };
        }
    }
}
