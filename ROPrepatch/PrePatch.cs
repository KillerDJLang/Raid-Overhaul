using BepInEx;
using LegionPrePatch.Helpers;

namespace LegionPrePatch
{
    [BepInPlugin(ClientInfo.ROPreLoadGUID, ClientInfo.ROPreLoadName, ClientInfo.PluginVersion)]
    public class LegionPrePatch : BaseUnityPlugin
    {
        public static LegionPrePatch Instance { get; private set; }

        public void Awake()
        {
            Instance = this;
        }
    }
}