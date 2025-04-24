using EFT;
using UnityEngine;
using System.Threading.Tasks;
using System.Collections;
using RaidOverhaul.Configs;

namespace RaidOverhaul.Patches
{
    internal class BodyCleanup : MonoBehaviour
    {
        private static bool _MaidOnStandby = false;

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

        private static IEnumerator StartClean()
        {
            yield return new WaitForSeconds(DJConfig.TimeToClean.Value * 60f);

            if (Ready())
            {
                Task.Delay(10000);
                foreach (BotOwner bot in FindObjectsOfType<BotOwner>())
                {
                    if (!bot.HealthController.IsAlive && UnityEngine.Vector3.Distance(Plugin.ROPlayer.Transform.position, bot.Transform.position) >= DJConfig.DistToClean.Value)
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

        internal static void MaidServiceRun()
        {
            if (Ready())
            {
                Task.Delay(10000);
                foreach (BotOwner bot in FindObjectsOfType<BotOwner>())
                {
                    if (!bot.HealthController.IsAlive && UnityEngine.Vector3.Distance(Plugin.ROPlayer.Transform.position, bot.Transform.position) >= DJConfig.DistToClean.Value)
                    {
                        bot.gameObject.SetActive(false);
                    }
                }
            }
        }

        private static bool Ready() => Plugin.ROGameWorld != null && Plugin.ROGameWorld.AllAlivePlayersList != null && Plugin.ROGameWorld.AllAlivePlayersList.Count > 0 && !(Plugin.ROPlayer is HideoutPlayer);
    }
}