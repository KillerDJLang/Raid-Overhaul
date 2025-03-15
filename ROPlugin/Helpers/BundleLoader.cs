using System;
using System.IO;
using System.Reflection;
using System.Collections.Generic;
using UnityEngine;
using EFT.UI.DragAndDrop;
using RaidOverhaul.Controllers;

namespace RaidOverhaul.Helpers
{
    internal class BundleLoader
    {
        public static void LoadBundles()
        {
            string rigLayoutsDirectory = Path.Combine(Plugin.pluginPath, "bundles", "CustomLayouts");
            string bundleDirectory = Path.Combine(Plugin.pluginPath, "bundles", "CustomAssets");

            if (!Directory.Exists(rigLayoutsDirectory))
            {
                if (ConfigController.DebugConfig.DebugMode) {
                    Plugin.Log.LogInfo("Rig layouts directory not found.");
                    Utils.LogToServerConsole("Rig layouts directory not found.");
                }
                return;
            }
            if (!Directory.Exists(bundleDirectory))
            {
                if (ConfigController.DebugConfig.DebugMode) {
                    Plugin.Log.LogInfo("Custom assets directory not found.");
                    Utils.LogToServerConsole("Custom assets directory not found.");
                }
                return;
            }

            var rigLayoutBundles = Directory.GetFiles(rigLayoutsDirectory, "*.bundle");
            var assetBundles = Directory.GetFiles(bundleDirectory, "*.bundle");

            foreach (var rigLayoutBundleFile in rigLayoutBundles)
            {
                string bundleName = Path.GetFileNameWithoutExtension(rigLayoutBundleFile);
                AssetBundle rigLayoutBundle = AssetBundle.LoadFromFile(rigLayoutBundleFile);

                if (rigLayoutBundle == null)
                {
                    if (ConfigController.DebugConfig.DebugMode) {
                        Plugin.Log.LogInfo($"Failed to load rig layout bundle: {bundleName}");
                        Utils.LogToServerConsole($"Failed to load rig layout bundle: {bundleName}");
                    }
                    continue;
                }

                string[] prefabNames = rigLayoutBundle.GetAllAssetNames();

                foreach (var prefabName in prefabNames)
                {

                    GameObject rigLayoutPrefab = rigLayoutBundle.LoadAsset<GameObject>(prefabName);

                    if (rigLayoutPrefab == null)
                    {
                        if (ConfigController.DebugConfig.DebugMode) {
                            Plugin.Log.LogInfo($"Failed to load rig layout prefab from bundle: {prefabName}");
                            Utils.LogToServerConsole($"Failed to load rig layout prefab from bundle: {prefabName}");
                        }
                        continue;
                    }


                    ContainedGridsView gridView = rigLayoutPrefab.GetComponent<ContainedGridsView>();

                    if (gridView == null)
                    {
                        if (ConfigController.DebugConfig.DebugMode) {
                            Plugin.Log.LogInfo($"Rig layout prefab {prefabName} is missing ContainedGridsView component.");
                            Utils.LogToServerConsole($"Rig layout prefab {prefabName} is missing ContainedGridsView component.");
                        }
                        continue;
                    }

                    string rigLayoutName = Path.GetFileNameWithoutExtension(prefabName);
                    AddEntryToDictionary($"UI/Rig Layouts/{rigLayoutName}", gridView);
                }

                rigLayoutBundle.Unload(false);
            }

            foreach (var bundle in assetBundles)
            {
                string bundleName = Path.GetFileNameWithoutExtension(bundle);
                AssetBundle assetBundle = AssetBundle.LoadFromFile(bundle);

                if (assetBundle == null)
                {
                    if (ConfigController.DebugConfig.DebugMode) {
                        Plugin.Log.LogInfo($"Failed to load custom asset bundle: {bundleName}");
                        Utils.LogToServerConsole($"Failed to load custom asset bundle: {bundleName}");
                    }
                }
            }
        }

        public static void AddEntryToDictionary(string key, object value)
        {
            Type type = typeof(CacheResourcesPopAbstractClass);
            FieldInfo dictionaryField = type.GetField("dictionary_0", BindingFlags.NonPublic | BindingFlags.Static);
            if (dictionaryField != null)
            {
                Dictionary<string, object> dictionary = (Dictionary<string, object>)dictionaryField.GetValue(null);
                if (dictionary != null)
                {
                    if (!dictionary.ContainsKey(key))
                    {
                        dictionary.Add(key, value);
                        if (ConfigController.DebugConfig.DebugMode) {
                            Plugin.Log.LogInfo("Successfully added new rig layout to resources dictionary!");
                            Utils.LogToServerConsole("Successfully added new rig layout to resources dictionary!");
                        }
                    }
                }
            }
        }

    }
}
