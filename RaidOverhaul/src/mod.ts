import { DependencyContainer }      from "tsyringe";

import { IPreAkiLoadMod }           from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod }           from "@spt-aki/models/external/IPostDBLoadMod";
import { PreAkiModLoader }          from "@spt-aki/loaders/PreAkiModLoader";
import { ITraderConfig }            from "@spt-aki/models/spt/config/ITraderConfig";
import { IRagfairConfig }           from "@spt-aki/models/spt/config/IRagfairConfig";
import { LogTextColor }             from "@spt-aki/models/spt/logging/LogTextColor";
import { ILogger }                  from "@spt-aki/models/spt/utils/ILogger";
import { Traders }                  from "@spt-aki/models/enums/Traders";
import { ConfigTypes }              from "@spt-aki/models/enums/ConfigTypes";
import { StaticRouterModService }   from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { DynamicRouterModService }  from "@spt-aki/services/mod/dynamicRouter/DynamicRouterModService";
import { ConfigServer }             from "@spt-aki/servers/ConfigServer";
import { DatabaseServer }           from "@spt-aki/servers/DatabaseServer";
import { VFS }                      from "@spt-aki/utils/VFS";
import { JsonUtil }                 from "@spt-aki/utils/JsonUtil";
import { HashUtil }                 from "@spt-aki/utils/HashUtil";
import { RandomUtil }               from "@spt-aki/utils/RandomUtil";
import { ProbabilityHelper }        from "@spt-aki/helpers/ProbabilityHelper";
import { ProfileHelper }            from "@spt-aki/helpers/ProfileHelper";
import { TraderHelper }             from "@spt-aki/helpers/TraderHelper";
import { ImageRouter }              from "@spt-aki/routers/ImageRouter";

import { References }               from "./Refs/References";
import { Utils, AssortUtils }       from "./Refs/Utils";
import { BaseClasses}               from "./Refs/Enums";
import { LegionData }               from "./RaidBoss/Legion";
import { TraderData }               from "./Trader/ReqShop";
import { Base }                     from "./BaseFeatures/baseFeatures";
import { ItemGenerator }            from "./CustomItems/ItemGenerator";
import { pushTraderFeatures }       from "./Trader/TraderPushes";

import * as EventWeightingsConfig   from "../config/EventWeightings.json";
import * as baseJson                from "../db/base.json";
import * as path                    from "path";
import JSON5                        from "json5";

const fs = require('fs');

class RaidOverhaul implements IPreAkiLoadMod, IPostDBLoadMod
{
    mod: string;
    modName: string
    logstring: string
    protected profilePath: string;
    modPath: string = path.normalize(path.join(__dirname, ".."));

    public imageRouter: ImageRouter;
    static container: DependencyContainer;
    
    private ref: References = new References();
    private utils: Utils = new Utils(this.ref);

    private static pluginDepCheck(): boolean 
    {
        const pluginRO = "raidoverhaul.dll";

        try { const pluginPath = fs.readdirSync("./BepInEx/plugins/RaidOverhaul").map(plugin => plugin.toLowerCase()); return pluginPath.includes(pluginRO); }
        catch { return false; }
    }

    private static preloaderDepCheck(): boolean 
    {
        const pluginRO = "legionprepatch.dll";

        try { const pluginPath = fs.readdirSync("./BepInEx/patchers").map(plugin => plugin.toLowerCase()); return pluginPath.includes(pluginRO); }
        catch { return false; }
    }

    constructor() 
    {
        this.mod = "RaidOverhaul";
        this.modName = "RaidOverhaul"
        this.logstring = "AssortMaker";
    }
    
    //
    //
    //
    //
    //

    /**
    * @param container
    */
    public preAkiLoad(container: DependencyContainer): void 
    {
        this.ref.preAkiLoad(container, "RaidOverhaul");
        const vfs =                 container.resolve<VFS>("VFS");
        const jsonUtil =            container.resolve<JsonUtil>("JsonUtil");
        const randomUtil =          container.resolve<RandomUtil>("RandomUtil");
        const logger =              container.resolve<ILogger>("WinstonLogger");
        const traderHelper =        container.resolve<TraderHelper>("TraderHelper");
        const profileHelper =       container.resolve<ProfileHelper>("ProfileHelper");
        const preAkiModLoader =     container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const configServer =        container.resolve<ConfigServer>("ConfigServer");
        const ragfair =             configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);
        const traderConfig:         ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const traderData =          new TraderData(traderConfig, this.ref, this.utils, vfs, randomUtil, jsonUtil, logger);
        const modConfig =           JSON5.parse(vfs.readFile(path.resolve(__dirname, "../config/config.json5")));
        
        const staticRouterModService: StaticRouterModService =   container.resolve<StaticRouterModService>("StaticRouterModService");
        const dynamicRouterModService: DynamicRouterModService = container.resolve<DynamicRouterModService>("DynamicRouterModService");

        traderData.registerProfileImage();
        traderData.setupTraderUpdateTime();

        Traders["Requisitions"] = "Requisitions";
        ragfair.traders[baseJson._id] = true;

        staticRouterModService.registerStaticRouter(
            `${this.modName}-/client/game/start`,
            [
                {
                    url: "/client/game/start",
                    action: (
                        url: string,
                        info: string,
                        sessionID: string,
                        output: string
                    ): string => 
                    {
                        const profileInfo = profileHelper.getFullProfile(sessionID)

                        if (modConfig.BackupProfile)
                        {
                            this.utils.profileBackup(vfs, logger, this.modName, sessionID, path, profileInfo, randomUtil);
                        }
                        return output;
                    }
                }
            ],
            "aki"
        );

        staticRouterModService.registerStaticRouter(
            "GetEventWeightings",
            [
                {
                    url: "/RaidOverhaul/GetEventWeightings",
                    action: (url: string, 
                        info: string, 
                        sessionId: string, 
                        output: string) => 
                    {                     
                        const EventWeightings = EventWeightingsConfig;

                        return JSON.stringify(EventWeightings);
                    }
                }
            ],
            ""
        );

        dynamicRouterModService.registerDynamicRouter(`DynamicReportError${this.modName}`,
        [
            {
                url: "/RaidOverhaul/LogToServer/",
                    action: (url: string) => 
                    {
                        const urlParts = url.split("/");
                        const clientMessage = urlParts[urlParts.length - 1];

                        const regex = /%20/g;
                        this.utils.logToServer(clientMessage.replace(regex, " "), logger);

                        return JSON.stringify({ resp: "OK" });
                    }
                }
            ], "LogToServer"
        );

        staticRouterModService.registerStaticRouter(
            `${this.modName}:RaidSaved`,
            [
                {
                    url: "/raid/profile/save",
                    action: (
                        url: string, 
                        info: string, 
                        sessionId: string, 
                        output: string
                    ) => 
                    {
                        TraderData.traderRepLogic(info, sessionId, traderHelper);
                        TraderData.legionRepLogic(info, sessionId, traderHelper);
                        LegionData.modifySpawnChance(info, output);
                        LegionData.LoadBossData();
                        if (preAkiModLoader.getImportedModsNames().includes("SWAG"))
                        { 
                            LegionData.swagPatch();
                        }
                        return output;
                    }
                }
            ],
            "aki"
        );
        if (preAkiModLoader.getImportedModsNames().includes("SWAG"))
        { 
            LegionData.swagPatch();
            logger.log("[RaidOverhaul] SWAG detected, modifying Legion patterns.", LogTextColor.MAGENTA)
        }
    }

    //
    //
    //
    //
    //
    //

    /**
    * @param container
    */
    public postDBLoad(container: DependencyContainer): void
    {
        this.ref.postDBLoad(container);
        const databaseServer =  container.resolve<DatabaseServer>("DatabaseServer");
        const tables =          databaseServer.getTables();
        const vfs =             container.resolve<VFS>("VFS");
        const hashUtil =        container.resolve<HashUtil>("HashUtil");
        const jsonUtil =        container.resolve<JsonUtil>("JsonUtil");
        const randomUtil =      container.resolve<RandomUtil>("RandomUtil");
        const logger =          container.resolve<ILogger>("WinstonLogger");
        const imageRouter =     container.resolve<ImageRouter>("ImageRouter");
        const configServer =    container.resolve<ConfigServer>("ConfigServer");
        const probHelper =      container.resolve<ProbabilityHelper>("ProbabilityHelper");
        const traderConfig:     ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);

        //Imports
        const traderData =      new TraderData(traderConfig, this.ref, this.utils, vfs, randomUtil, jsonUtil, logger);
        const modFeatures =     new Base(this.utils);
        const assortUtils =     new AssortUtils(hashUtil, logger);
        const utils =           new Utils(this.ref);
        const itemGenerator =   new ItemGenerator(this.utils);
        const traderFeatures =  new pushTraderFeatures();

        //For new items
        const modPath =         path.resolve(__dirname.toString()).split(path.sep).join("/")+"/";
        const modConfig =       JSON5.parse(vfs.readFile(path.resolve(__dirname, "../config/config.json5")));

        //For stack object changes
        const shotgun =         JSON.parse(vfs.readFile(path.resolve(__dirname, "../db/AmmoList/Shotgun.json")));
        const flares =          JSON.parse(vfs.readFile(path.resolve(__dirname, "../db/AmmoList/UBGL.json")));
        const sniper =          JSON.parse(vfs.readFile(path.resolve(__dirname, "../db/AmmoList/Sniper.json")));
        const smg =             JSON.parse(vfs.readFile(path.resolve(__dirname, "../db/AmmoList/SMG.json")));
        const rifle =           JSON.parse(vfs.readFile(path.resolve(__dirname, "../db/AmmoList/Rifle.json")));

        //Random message on server on startup
        const messageArray =    ["The hamsters can take a break now", "Time to get wrecked by Birdeye LOL", "Back to looking for cat pics", "I made sure to crank up your heart attack event chances", "If there's a bunch of red text it's 100% not my fault", "We are legion, for we are many", "All Hail the Cult of Cj", "Good luck out there"];
        const randomMessage =   messageArray[Math.floor(Math.random() * messageArray.length)];

        if (!RaidOverhaul.pluginDepCheck())
        {
            return logger.error(`[${this.modName}] Error, client portion of Raid Overhaul is missing from BepInEx/plugins folder.\nPlease install correctly.`);
        }

        if (!RaidOverhaul.preloaderDepCheck())
        {
            return logger.error(`[${this.modName}] Error, Legion Boss Preloader is missing from BepInEx/patchers folder.\nPlease install correctly.`);
        }

        //Load all custom items
        if (modConfig.EnableCustomItems)
        {
            itemGenerator.createWeapons();
        }
        itemGenerator.createGear();

        // Load custom boss data
        LegionData.LoadBossData();

        // Load Trader Data  
        traderFeatures.pushExports(utils, traderData, assortUtils, hashUtil, modConfig, tables, baseJson, BaseClasses, vfs, fs, path, probHelper, randomUtil, logger, this.logstring, LogTextColor, imageRouter, modPath, this.modName);

        //Push all of the mods base features
        modFeatures.pushModFeatures(modConfig, shotgun, flares, sniper, smg, rifle);

        logger.log(`[${this.modName}] has finished modifying your raids. ${randomMessage}.`, LogTextColor.CYAN);
    }
}
//      \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/

module.exports = { mod: new RaidOverhaul() };