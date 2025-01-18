/*
using EFT;
using System;
using System.Reflection;
using System.Threading.Tasks;
using HarmonyLib;
using Comfort.Common;
using Newtonsoft.Json;
using JetBrains.Annotations;
using UnityEngine;
using EFT.Interactive;
using EFT.Communications;
using EFT.InventoryLogic;
using SPT.Common.Http;
using SPT.Reflection.Patching;
using RaidOverhaul.Helpers;
using RaidOverhaul.Controllers;

namespace RaidOverhaul.Patches
{
    public class ExfilCratePatch : ModulePatch
    {
        internal static bool isExtractCrate = false;
        private static JsonConverter[] _defaultJsonConverters;

        protected override MethodBase GetTargetMethod()
        {
            return AccessTools.Method(typeof(GameWorld), nameof(GameWorld.OnGameStarted));
        }

        [PatchPostfix]
        public static void PatchPostfix(GameWorld __instance)
        {
            var gameWorld = __instance;
            var location = gameWorld.MainPlayer.Location;
            
            LootableContainer container = gameWorld.GetComponentInChildren<LootableContainer>().gameObject.GetComponentInChildren<LootableContainer>();
        }

        static void BuildCrate(LootableContainer exfilCrate)
        {
            var itemCrate = Singleton<ItemFactoryClass>.Instance.CreateItem("exfilcratecontainer", "6756f0f27ea253ab411935da", null);
            LootItem.CreateLootContainer(exfilCrate, itemCrate, "Heavy crate", Singleton<GameWorld>.Instance);
        }

        static async void AwaitThenGetBox(LootableContainer exfilCrate)
        {
            if (!isExtractCrate) return;
            isExtractCrate = false;

            while (Vector3.Distance(exfilCrate.transform.position, ((IPlayer)Singleton<GameWorld>.Instance.MainPlayer).Position) > 15f)
            {
                await Task.Yield();
            }

            NotificationManagerClass.DisplayMessageNotification("The extract crate is open, stash your loot while you can!", ENotificationDurationType.Long, ENotificationIconType.Default);

            EventExfilPatch.awaitDrop = true;

            await Task.Delay(150000);

            NotificationManagerClass.DisplayMessageNotification("The extract crate is locked, and any gear within it is now secured and will be returned to your stash at the end of the raid.", ENotificationDurationType.Long, ENotificationIconType.Default);

            typeof(LootableContainer).GetMethod("Lock", BindingFlags.Instance | BindingFlags.Public).Invoke(exfilCrate, null);

            sendExfilBox(exfilCrate);

            EventExfilPatch.awaitDrop = false;
        }

        static void sendExfilBox(LootableContainer exfilCrate)
        {
            var exfilCrateItems = Singleton<ItemFactoryClass>.Instance.TreeToFlatItems(exfilCrate.ItemOwner.MainStorage[0].Items);

            RequestHandler.PutJson("/singleplayer/traderServices/itemDelivery", new
            {
                items = exfilCrateItems,
                traderId = Utils.ReqID
            }.ToJson(_defaultJsonConverters));
        }
    }
}
*/