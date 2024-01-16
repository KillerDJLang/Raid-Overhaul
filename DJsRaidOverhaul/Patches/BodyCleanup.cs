using EFT;
using UnityEngine;
using Comfort.Common;
using System.Threading.Tasks;
using System.Collections;
using DJsRaidOverhaul.Helpers;

namespace DJsRaidOverhaul.Patches
{
    public class BodyCleanup : MonoBehaviour
    {
        private bool _MaidOnStandby = false;

        void Update()
        {
            if (!Ready() || !DJConfig.EnableClean.Value)
            {
                return;
            }

            if (!_MaidOnStandby)
            {
                StaticManager.Instance.StartCoroutine(StartClean());
                _MaidOnStandby = true;
            }
        }

        private IEnumerator StartClean()
        {
            yield return new WaitForSeconds(DJConfig.TimeToClean.Value * 60f);

            if (Gameworld != null && Gameworld.AllAlivePlayersList != null && Gameworld.AllAlivePlayersList.Count > 0 && !(Myplayer is HideoutPlayer))
            {
                Task.Delay(10000);
                foreach (BotOwner bot in FindObjectsOfType<BotOwner>())
                {
                    if (!bot.HealthController.IsAlive && UnityEngine.Vector3.Distance(Myplayer.Transform.position, bot.Transform.position) >= DJConfig.DistToClean.Value)
                    {
                        bot.gameObject.SetActive(false);
                    }
                }
            }

            else
            {
                _MaidOnStandby = false;
                yield break;
            }

            _MaidOnStandby = false;
            yield break;
        }

        public bool Ready() => Gameworld != null && Gameworld.AllAlivePlayersList != null && Gameworld.AllAlivePlayersList.Count > 0 && !(Myplayer is HideoutPlayer);

        Player Myplayer
        { get => Gameworld.AllAlivePlayersList[0]; }

        GameWorld Gameworld
        { get => Singleton<GameWorld>.Instance; }
    }
}