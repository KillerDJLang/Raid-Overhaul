using System;
using System.IO;
using System.Reflection;
using System.Collections.Generic;
using UnityEngine;
using EFT.UI.DragAndDrop;

namespace RaidOverhaul.Helpers
{
    //Huge thanks to Groovey and all tho folks who figured this one out! All credit for this goes to them \('_')/
    internal class LayoutLoader
    {
        public static void LoadRigLayouts()
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
#if DEBUG
                        Console.WriteLine("Successfully added new rig layout to resources dictionary!");
#endif
                    }
                }
            }
        }

    }
}
