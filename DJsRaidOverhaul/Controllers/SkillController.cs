using EFT;
using System;
using System.Linq;
using UnityEngine;
using Comfort.Common;
using System.Reflection;
using Aki.Reflection.Utils;
using System.Collections.Generic;
using DJsRaidOverhaul.Helpers;

namespace DJsRaidOverhaul.Controllers
{
    public class SkillController : MonoBehaviour
    {
        GameWorld gameWorld
        { get => Singleton<GameWorld>.Instance; }

        Player player
        { get => gameWorld.MainPlayer; }

        private Dictionary<string, Type> _SkillClasses;
        private List<FieldInfo> _skillFields;

        private void Awake()
        {
            _SkillClasses = new Dictionary<string, Type>();
            _skillFields = new List<FieldInfo>();

            GetSkillType();
            GetWeaponSkillType();
            GetAllSkillFields();
        }

        #region Get Types

        private void GetSkillType()
        {
            var skillType = PatchConstants.EftTypes.Single(x =>
                x.GetField("DEFAULT_EXP_LEVEL") != null &&
                x.GetField("MAX_LEVEL") != null &&
                x.GetMethod("CalculateExpOnFirstLevels") != null);

            if (DJConfig.DebugLogging.Value)
            {
                Plugin.logger.LogDebug($"SkillClass: typeof({skillType})");
            }

            _SkillClasses.Add("SkillClass", skillType);
        }

        private void GetWeaponSkillType()
        {
            var weaponSkillType = PatchConstants.EftTypes.Single(x =>
                x.GetField("WeaponBaseType") != null &&
                x.GetMethod("IsAssignableFrom") != null);

            if (DJConfig.DebugLogging.Value)
            {
                Plugin.logger.LogDebug($"WeaponSkillClass: typeof({weaponSkillType})");
            }

            _SkillClasses.Add("WeaponSkillClass", weaponSkillType);
        }

        private void GetAllSkillFields()
        {
            var skillManager = PatchConstants.EftTypes.Single(x => x.Name == "SkillManager");

            foreach (FieldInfo field in skillManager.GetFields()) 
            {
                if (field.FieldType == _SkillClasses["SkillClass"] || 
                    field.FieldType == _SkillClasses["WeaponSkillClass"])
                {
                    if (DJConfig.DebugLogging.Value)
                    {
                        Plugin.logger.LogDebug($"Adding Skill: {field.Name}");
                    }

                    _skillFields.Add(field);
                }
            }
        }

        #endregion

        public bool Ready() => gameWorld != null && gameWorld.AllAlivePlayersList != null && gameWorld.AllAlivePlayersList.Count > 0 && !(player is HideoutPlayer);
    }
}
