using Mono.Cecil;

namespace LegionPrePatch.Helpers
{
    public static class LegionUtils
    {
        public static void AddEnumValue(ref TypeDefinition type, string name, object value)
        {
            const FieldAttributes defaultEnumFieldAttributes = FieldAttributes.Public | FieldAttributes.Static | FieldAttributes.Literal | FieldAttributes.HasDefault;
            type.Fields.Add(new FieldDefinition(name, defaultEnumFieldAttributes, type) { Constant = value });
        }
    }

    public static class LegionEnums
    {
        public const string BossLegionName = "bosslegion";
        public const int BossLegionValue = 199;
    }
}