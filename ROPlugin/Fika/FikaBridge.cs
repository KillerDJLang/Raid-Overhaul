using SPT.Reflection.Utils;

namespace RaidOverhaul.Fika
{
    public static class FikaBridge
    {
        public delegate void SimpleEvent(); 
        public delegate bool SimpleBoolReturnEvent();
        public delegate string SimpleStringReturnEvent();
        public static event SimpleEvent PluginEnableEmitted;

        public static void PluginEnable() { PluginEnableEmitted?.Invoke(); }

        public static event SimpleBoolReturnEvent IAmHostEmitted;
        public static bool IAmHost()
        {
            bool? eventResponse = IAmHostEmitted?.Invoke();

            if (eventResponse == null)
            {
                return true;
            }
            else
            {
                return eventResponse.Value;
            }
        }

        public static event SimpleStringReturnEvent GetRaidIdEmitted;
        public static string GetRaidId()
        {
            string eventResponse = GetRaidIdEmitted?.Invoke();

            if (eventResponse == null)
            {
                return ClientAppUtils.GetMainApp().GetClientBackEndSession().Profile.ProfileId;
            }
            else
            {
                return eventResponse;
            }
        }

        public delegate void SendRandomEventRunPacket(string eventToSend);
        public static event SendRandomEventRunPacket SendRandomEventRunPacketEmitted;
        public static void SendRandomEventPacket(string eventToSend)
        { SendRandomEventRunPacketEmitted?.Invoke(eventToSend); }

        public delegate void SendFlareEventRunPacket(string flareEventToSend);
        public static event SendFlareEventRunPacket SendFlareEventRunPacketEmitted;
        public static void SendFlareEventPacket(string flareEventToSend)
        { SendFlareEventRunPacketEmitted?.Invoke(flareEventToSend); }
        
        public delegate void SendDoorStateChangePacketEvent(string doorId);
        public static event SendDoorStateChangePacketEvent SendDoorStateChangePacketEmitted;
        public static void SendDoorStateChangePacket(string doorId)
        { SendDoorStateChangePacketEmitted?.Invoke(doorId); }
        
        public delegate void SendKeycardDoorStateChangePacketEvent(string keycardDoorId);
        public static event SendKeycardDoorStateChangePacketEvent SendKeycardDoorStateChangePacketEmitted;
        public static void SendKeycardDoorStateChangePacket(string keycardDoorId)
        { SendKeycardDoorStateChangePacketEmitted?.Invoke(keycardDoorId); }
        
        public delegate void SendSwitchStateChangePacketEvent(string switchId);
        public static event SendSwitchStateChangePacketEvent SendSwitchStateChangePacketEmitted;
        public static void SendSwitchStateChangePacket(string switchId)
        { SendSwitchStateChangePacketEmitted?.Invoke(switchId); }
        
        public delegate void SendRaidStartDoorStateChangePacketEvent(string doorId);
        public static event SendRaidStartDoorStateChangePacketEvent SendRaidStartDoorStateChangePacketEmitted;
        public static void SendRaidStartDoorStateChangePacket(string doorId)
        { SendRaidStartDoorStateChangePacketEmitted?.Invoke(doorId); }
        
        public delegate void SendRaidStartLampStateChangePacketEvent(string lampId);
        public static event SendRaidStartLampStateChangePacketEvent SendRaidStartLampStateChangePacketEmitted;
        public static void SendRaidStartLampStateChangePacket(string lampId)
        { SendRaidStartLampStateChangePacketEmitted?.Invoke(lampId); }
    }
}