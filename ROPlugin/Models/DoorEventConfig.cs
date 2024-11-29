using Newtonsoft.Json;

namespace RaidOverhaul.Models
{
    public struct EventsConfig
    {
        public DoorWeightings DoorEvents;

        [JsonProperty("DoorEventRangeMinimum")]
        public float DoorEventRangeMinimumServer;

        [JsonProperty("DoorEventRangeMaximum")]
        public float DoorEventRangeMaximumServer;

        public RaidEventWeightings RaidEvents;

        [JsonProperty("RandomEventRangeMinimum")]
        public float RandomEventRangeMinimumServer;

        [JsonProperty("RandomEventRangeMaximum")]
        public float RandomEventRangeMaximumServer;
    }
}