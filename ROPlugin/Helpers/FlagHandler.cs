using System;
using System.IO;
using Newtonsoft.Json;
using RaidOverhaul.Controllers;
using RaidOverhaul.Models;

namespace RaidOverhaul.Helpers
{
    public class FlagHandler
    {
        public static void ReadFlagFile(string fileName)
        {
            string filePath = Path.Combine(Plugin.resourcePath, "Flags", fileName);
            filePath += ".json";
            string json = File.ReadAllText(filePath);

            var data = JsonConvert.DeserializeObject<Flags>(json);

            ConfigController.flags = data;
        }

        public static string SerializeObject(object data)
        {
            return JsonConvert.SerializeObject(data, Formatting.Indented);
        }

        public static bool CheckFlagPath(string fileName)
        {
            string filePath = Path.Combine(Plugin.resourcePath, "Flags", fileName);
            filePath += ".json";

            return File.Exists(filePath);
        }

        public static void SaveToJson(object data, string fileName)
        {
            if (data == null)
            {
                return;
            }

            try
            {
                if (!CheckFlagPath(fileName))
                {
                    string filePath = Path.Combine(Plugin.resourcePath, "Flags", fileName);
                    filePath += ".json";
                    string jsonString = SerializeObject(data);
                    File.Create(filePath).Dispose();

                    StreamWriter streamWriter = new StreamWriter(filePath);
                    streamWriter.Write(jsonString);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                else if (CheckFlagPath(fileName))
                {
                    string filePath = Path.Combine(Plugin.resourcePath, "Flags", fileName);
                    filePath += ".json";
                    string jsonString = SerializeObject(data);
                    File.Delete(filePath);
                    File.Create(filePath).Dispose();

                    StreamWriter streamWriter = new StreamWriter(filePath);
                    streamWriter.Write(jsonString);
                    streamWriter.Flush();
                    streamWriter.Close();
                }
            }
            catch (Exception e)
            {
                Plugin.Log.LogError(e);
            }
        }
    }
}