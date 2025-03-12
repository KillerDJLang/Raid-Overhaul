using Newtonsoft.Json;

namespace RaidOverhaul.Models
{
    #region Server Config Layout Base
    public struct ServerConfigs
    {
        [JsonProperty("EnableCustomBoss")]
        public bool EnableLegion;

        [JsonProperty("EnableRequisitionOffice")]
        public bool EnableReqShop;
        
        [JsonProperty("UseLegionGlobalSpawnChance")]
        public bool UseGlobalChance;
        
        [JsonProperty("GlobalSpawnChance")]
        public int GlobalSpawnChance;

        [JsonProperty("RemoveFromSwag")]
        public bool RemoveFromSwag;

        [JsonProperty("EnableCustomItems")]
        public bool EnableCustomItems;

        [JsonProperty("BackupProfile")]
        public bool BackupProfile;

        public RaidServer RaidChanges;
        public PocketChangesServer PocketChanges;
        public WeightChangesServer WeightChanges;
        public TraderServer TraderChanges;
        public InsuranceServer Insurance;
        public BasicStackTuningServer BasicStackTuning;
        public AdvancedStackTuningServer AdvancedStackTuning;
        public MoneyStackMultiplierServer MoneyStackMulti;
        public LootChangesServer LootChanges;
        public SeasonsServer Seasons;
    }
    #endregion

    #region Raid Config
    public struct RaidServer
    {
        public ReduceFoodAndHydroDegradeRaid ReduceFoodAndHydroDegrade;

        [JsonProperty("SaveQuestItems")]
        public bool SaveQuestItems;

        [JsonProperty("NoRunThrough")]
        public bool NoRunThrough;

        [JsonProperty("LootableMelee")]
        public bool LootableMelee;

        [JsonProperty("LootableArmbands")]
        public bool LootableArmbands;

        [JsonProperty("EnableExtendedRaids")]
        public bool EnableExtendedRaids;

        [JsonProperty("TimeLimit")]
        public int RaidTimeLimit;

        [JsonProperty("HolsterAnything")]
        public bool HolsterAnything;

        [JsonProperty("LowerExamineTime")]
        public bool LowerExamineTime;

        [JsonProperty("SpecialSlotChanges")]
        public bool SpecialSlotChanges;

        [JsonProperty("ChangeBackpackSizes")]
        public bool ChangeBackpackSizes;

        [JsonProperty("ModifyEnemyBotHealth")]
        public bool ModifyEnemyBotHealth;

        public ChangeAirdropValuesRaid ChangeAirdropValues;
    }

    public struct ReduceFoodAndHydroDegradeRaid
    {
        [JsonProperty("Enabled")]
        public bool EnableFoodAndHydroDegrade;

        [JsonProperty("EnergyDecay")]
        public float EnergyDecay;

        [JsonProperty("HydroDecay")]
        public float HydroDecay;
    }

    public struct ChangeAirdropValuesRaid
    {
        [JsonProperty("Enabled")]
        public bool EnableAirdropValueChanges;

        [JsonProperty("Customs")]
        public int CustomsAirdropValue;

        [JsonProperty("Woods")]
        public int WoodsAirdropValue;

        [JsonProperty("Lighthouse")]
        public int LighthouseAirdropValue;

        [JsonProperty("Interchange")]
        public int InterchangeAirdropValue;

        [JsonProperty("Shoreline")]
        public int ShorelineAirdropValue;

        [JsonProperty("Reserve")]
        public int ReserveAirdropValue;

        [JsonProperty("Streets")]
        public int StreetsAirdropValue;

        [JsonProperty("GroundZero")]
        public int GroundZeroAirdropValue;
    }

    #endregion

    #region Pocket Config
    public struct PocketChangesServer
    {
        [JsonProperty("Enabled")]
        public bool EnablePocketChanges;

        public Pocket1 FirstPocket;
        public Pocket2 SecondPocket;
        public Pocket3 ThirdPocket;
        public Pocket4 FourthPocket;
    }

    public struct Pocket1
    {
        [JsonProperty("Vertical")]
        public int Pocket1Vertical;

        [JsonProperty("Horizontal")]
        public int Pocket1Horizontal;
    }

    public struct Pocket2
    {
        [JsonProperty("Vertical")]
        public int Pocket2Vertical;

        [JsonProperty("Horizontal")]
        public int Pocket2Horizontal;
    }

    public struct Pocket3
    {
        [JsonProperty("Vertical")]
        public int Pocket3Vertical;

        [JsonProperty("Horizontal")]
        public int Pocket3Horizontal;
    }

    public struct Pocket4
    {
        [JsonProperty("Vertical")]
        public int Pocket4Vertical;

        [JsonProperty("Horizontal")]
        public int Pocket4Horizontal;
    }
    #endregion

    #region Weight Config
    public struct WeightChangesServer
    {
        [JsonProperty("Enabled")]
        public bool EnableWeightChanges;

        [JsonProperty("WeightMultiplier")]
        public float WeightMulti;
    }
    #endregion

    #region Trader Config
    public struct TraderServer
    {
        [JsonProperty("DisableFleaBlacklist")]
        public bool DisableFleaBlacklist;

        [JsonProperty("LL1Items")]
        public bool ReqShopLL1Items;

        [JsonProperty("RemoveFirRequirementsForQuests")]
        public bool RemoveFirRequirementsForQuests;
    }
    #endregion

    #region Insurance Config
    public struct InsuranceServer
    {
        [JsonProperty("Enabled")]
        public bool EnableInsuranceChanges;

        [JsonProperty("PraporMinReturn")]
        public int PraporMinReturnTime;

        [JsonProperty("PraporMaxReturn")]
        public int PraporMaxReturnTime;

        [JsonProperty("TherapistMinReturn")]
        public int TherapistMinReturnTime;

        [JsonProperty("TherapistMaxReturn")]
        public int TherapistMaxReturnTime;
    }
    #endregion

    #region Basic Stack Tuning Config
    public struct BasicStackTuningServer
    {
        [JsonProperty("Enabled")]
        public bool EnableBasicStackTuning;

        [JsonProperty("StackMultiplier")]
        public float StackMultiplier;
    }
    #endregion

    #region Advanced Stack Tuning Config
    public struct AdvancedStackTuningServer
    {
        [JsonProperty("Enabled")]
        public bool EnableAdvancedStackTuning;

        [JsonProperty("ShotgunStack")]
        public int ShotgunStackMulti;

        [JsonProperty("FlaresAndUBGL")]
        public int FlaresAndUBGLStackMulti;

        [JsonProperty("SniperStack")]
        public int SniperStackMulti;

        [JsonProperty("SMGStack")]
        public int SMGStackMulti;

        [JsonProperty("RifleStack")]
        public int RifleStackMulti;
    }
    #endregion

    #region Money Stack Multiplier Config
    public struct MoneyStackMultiplierServer
    {
        [JsonProperty("Enabled")]
        public bool EnableMoneyStackMultiplier;

        [JsonProperty("MoneyMultiplier")]
        public float MoneyMulti;
    }
    #endregion

    #region Loot Changes Config
    public struct LootChangesServer
    {
        [JsonProperty("Enabled")]
        public bool EnableLootChanges;

        [JsonProperty("StaticLootMultiplier")]
        public float StaticLootMulti;

        [JsonProperty("LooseLootMultiplier")]
        public float LooseLootMulti;

        [JsonProperty("MarkedRoomLootMultiplier")]
        public float MarkedRoomMulti;
    }
    #endregion

    #region Season Changes Config
    public struct SeasonsServer
    {
        [JsonProperty("EnableWeatherOptions")]
        public bool EnableWeatherChanges;

        [JsonProperty("AllSeasons")]
        public bool AllSeasonsRandomized;

        [JsonProperty("NoWinter")]
        public bool NoWinterRandomized;

        [JsonProperty("SeasonalProgression")]
        public bool SeasonalWeatherProgression;

        [JsonProperty("WinterWonderland")]
        public bool EnableWinterOnly;
    }
    #endregion
}