using EFT;
using UnityEngine;
using Comfort.Common;
using System.Threading.Tasks;

namespace DJsRaidOverhaul
{
    public class BodyCleanup : MonoBehaviour
    {
        float Timer { get; set; }

        void Update()
        {
            if (!Ready())
            {
                Timer = 0f;
                return;
            }

            if (Plugin.EnableClean.Value)
            {
                Timer += Time.deltaTime;
            }
            if (Timer >= Plugin.TimeToClean.Value)
            {
                QueueCleanup();
                Timer = 0f;
            }
        }

        async void QueueCleanup()
        {
            await Task.Delay(10000);
            foreach (BotOwner bot in FindObjectsOfType<BotOwner>())
            {
                if (!bot.HealthController.IsAlive && Vector3.Distance(Myplayer.Transform.position, bot.Transform.position) >= Plugin.DistToClean.Value)
                {
                    bot.gameObject.SetActive(false);
                }
            }
        }

        public bool Ready() => Gameworld != null && Gameworld.AllAlivePlayersList != null && Gameworld.AllAlivePlayersList.Count > 0 && !(Myplayer is HideoutPlayer);

        Player Myplayer
        { get => Gameworld.AllAlivePlayersList[0]; }

        GameWorld Gameworld
        { get => Singleton<GameWorld>.Instance; }
    }
}