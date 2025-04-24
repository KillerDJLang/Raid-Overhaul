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
        public static void LoadLayouts()
        {
            string rigLayoutsDirectory = Path.Combine(Plugin.pluginPath, "bundles", "CustomLayouts");

            if (!Directory.Exists(rigLayoutsDirectory))
            {
                Console.WriteLine("Rig layouts directory not found.");
                return;
            }

            var rigLayoutBundles = Directory.GetFiles(rigLayoutsDirectory, "*.bundle");

            foreach (var rigLayoutBundleFile in rigLayoutBundles)
            {
                string bundleName = Path.GetFileNameWithoutExtension(rigLayoutBundleFile);

                AssetBundle rigLayoutBundle = AssetBundle.LoadFromFile(rigLayoutBundleFile);

                if (rigLayoutBundle == null)
                {
                    Console.WriteLine($"Failed to load rig layout bundle: {bundleName}");
                    continue;
                }

                string[] prefabNames = rigLayoutBundle.GetAllAssetNames();

                foreach (var prefabName in prefabNames)
                {

                    GameObject rigLayoutPrefab = rigLayoutBundle.LoadAsset<GameObject>(prefabName);

                    if (rigLayoutPrefab == null)
                    {
                        Console.WriteLine($"Failed to load rig layout prefab from bundle: {prefabName}");
                        continue;
                    }


                    ContainedGridsView gridView = rigLayoutPrefab.GetComponent<ContainedGridsView>();

                    if (gridView == null)
                    {
                        Console.WriteLine($"Rig layout prefab {prefabName} is missing ContainedGridsView component.");
                        continue;
                    }

                    string rigLayoutName = Path.GetFileNameWithoutExtension(prefabName);
                    AddEntryToDictionary($"UI/Rig Layouts/{rigLayoutName}", gridView);
                }

                rigLayoutBundle.Unload(false);
            }
        }

        public static void LoadAssets()
        {
            string bundleDirectory = Path.Combine(Plugin.pluginPath, "bundles", "CustomAssets");
            
            if (!Directory.Exists(bundleDirectory))
            {
                Plugin.Log.LogInfo("Custom assets directory not found.");
                return;
            }

            var assetBundles = Directory.GetFiles(bundleDirectory, "*.bundle");

            foreach (var bundle in assetBundles)
            {
                string bundleName = Path.GetFileNameWithoutExtension(bundle);
                AssetBundle assetBundle = AssetBundle.LoadFromFile(bundle);

                if (assetBundle == null)
                {
                    Plugin.Log.LogInfo($"Failed to load custom asset bundle: {bundleName}");
                }
            }
        }

        private static void AddEntryToDictionary(string key, object value)
        {
            Type type = typeof(CacheResourcesPopAbstractClass);
            FieldInfo dictionaryField = type.GetField("dictionary_0", BindingFlags.Public | BindingFlags.Static);
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
