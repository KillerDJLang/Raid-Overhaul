using Newtonsoft.Json;

namespace RaidOverhaul.Models
{
    public struct DebugConfigs
    {
        [JsonProperty("seasonalEventChance")]
        public int SeasonalEventChance;
        [JsonProperty("hordeEventChance")]
        public int HordeChance;
        [JsonProperty("hordeActive")]
        public bool HordeStatus;
        [JsonProperty("baseLegionChance")]
        public int LegionBaseChance;
        [JsonProperty("debugMode")]
        public bool DebugMode;
    }
}