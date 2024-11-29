using Newtonsoft.Json;

namespace RaidOverhaul.Models
{
    public struct SeasonalConfig
    {
        [JsonProperty("seasonsProgression")]
        public int SeasonsProgression;
    }
}