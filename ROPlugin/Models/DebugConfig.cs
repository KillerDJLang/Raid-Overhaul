using Newtonsoft.Json;

namespace RaidOverhaul.Models
{
    public struct DebugConfigs
    {
        [JsonProperty("baseLegionChance")]
        public int LegionBaseChance;

        [JsonProperty("debugMode")]
        public bool DebugMode;

        [JsonProperty("dumpData")]
        public bool DumpData;

        [JsonProperty("EnableTimeChanges")]
        public bool TimeChanges;
    }
}