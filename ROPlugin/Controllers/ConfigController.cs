using UnityEngine;
using RaidOverhaul.Models;

namespace RaidOverhaul.Controllers
{
    internal class ConfigController : MonoBehaviour
    {
        public static ServerConfigs ServerConfig = new ServerConfigs();
        public static DebugConfigs DebugConfig = new DebugConfigs();
        public static EventsConfig EventConfig = new EventsConfig();
        public static SeasonalConfig SeasonConfig = new SeasonalConfig();
        public static Flags flags = new Flags();
    }
}