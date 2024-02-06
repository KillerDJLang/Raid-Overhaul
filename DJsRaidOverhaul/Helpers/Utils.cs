using System.Collections.Generic;

namespace DJsRaidOverhaul.Helpers
{
    public static class Utils
    {
        public static readonly List<string> Traders = new List<string>
        {
            "54cb50c76803fa8b248b4571",     //Prapor
            "54cb57776803fa99248b456e",     //Therapist 
            "579dc571d53a0658a154fbec",     //Fence
            "58330581ace78e27b8b10cee",     //Skier 
            "5935c25fb3acc3127c3d8cd9",     //Peacekeeper 
            "5a7c2eca46aef81a7ca2145d",     //Mechanic 
            "5ac3b934156ae10c4430e83c",     //Ragman 
            "5c0647fdd443bc2504c2d371",     //Jaeger 
            "Requisitions"                  //Req Shop
        };

        public static readonly string ReqID = "Requisitions";

        public static float GetStrength()
        {
            return DJConfig.EffectStrength.Value;
        }
    }
}
