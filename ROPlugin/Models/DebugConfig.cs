using Newtonsoft.Json;

namespace RaidOverhaul.Models
{
    internal struct DebugConfigs
    {
        [JsonProperty("baseLegionChance")]
        public int LegionBaseChance;

        [JsonProperty("debugMode")]
        public bool DebugMode;

        [JsonProperty("dumpData")]
        public bool DumpData;
    }
}