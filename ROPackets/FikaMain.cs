using Comfort.Common;
using Fika.Core.Coop.Utils;
using Fika.Core.Networking;
using RaidOverhaul.Fika;
using RaidOverhaul.FikaModule.Components;

namespace RaidOverhaul.FikaModule
{
    internal class FikaMain
    {
        public static void Init()
        {
            PluginAwake();
            FikaBridge.PluginEnableEmitted += PluginEnable;

            FikaBridge.IAmHostEmitted += IAmHost;
            FikaBridge.GetRaidIdEmitted += GetRaidId;

            FikaBridge.SendFlareEventRunPacketEmitted += FikaComponent.SendFlareEventPacket;
            FikaBridge.SendRandomEventRunPacketEmitted += FikaComponent.SendRandomEventPacket;
            FikaBridge.SendDoorStateChangePacketEmitted += FikaComponent.SendDoorStateChangePacket;
            FikaBridge.SendKeycardDoorStateChangePacketEmitted += FikaComponent.SendSwitchStateChangePacket;
            FikaBridge.SendSwitchStateChangePacketEmitted += FikaComponent.SendKeycardDoorStateChangePacket;
            FikaBridge.SendRaidStartDoorStateChangePacketEmitted += FikaComponent.SendRaidStartDoorStateChangePacket;
            FikaBridge.SendRaidStartLampStateChangePacketEmitted += FikaComponent.SendRaidStartLampStateChangePacket;
        }

        public static void PluginAwake()
        {}

        public static void PluginEnable()
        {
            FikaComponent.InitOnPluginEnabled();
        }

        public static bool IAmHost()
        {
            return Singleton<FikaServer>.Instantiated;
        }

        public static string GetRaidId()
        {
            return FikaBackendUtils.GroupId;
        }
    }
}