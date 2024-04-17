export class pushTraderFeatures
{
    public pushExports(utils: any, traderData: any, assortUtils: any, hashUtil: any, modConfig: any, tables: any, baseJson: any, BaseClasses: any, vfs: any, fs: any, path: any, probHelper: any, randomUtil: any, logger: any, logstring: any, LogTextColor: any, imageRouter: any, modPath: any, modName: any): void
    {
        const debugLogging = false

        //Add Req Shop to the game
        traderData.pushTrader();

        //Add Req Shop to Locales
        traderData.addTraderToLocales(tables, baseJson.name, "Requisitions Office", baseJson.nickname, baseJson.location, "A collection of Ex-PMC's and rogue Scavs who formed a group to aid others in Tarkov. They routinely scour the battlefield for any leftover supplies and aren't afraid to fight their old comrades for it. They may not be the most trustworthy but they do have some much needed provisions in stock.");

        //Load Item IDs into the json arrays
        assortUtils.generateFluidAssortData(tables, BaseClasses, vfs);
        //assortUtils.generateAmmoTypeData(tables, BaseClasses, vfs);

        //Get preset data from globals
        //assortUtils.getPresets(fs, path, hashUtil);  
                 
        //Get trader assorts from trader helper
        //assortUtils.getAssorts(traderHelper ,vfs);

        //Push each type of item to the assort
        traderData.createItemFluidAssort(probHelper, debugLogging);
        traderData.createAmmoFluidAssort(probHelper, debugLogging);
        traderData.createPlateFluidAssort(probHelper, debugLogging);
        traderData.createMedsFluidAssort(probHelper, debugLogging);
        traderData.createModsFluidAssort(probHelper, debugLogging);
        traderData.createGearFluidAssort(probHelper, debugLogging);
        traderData.createWeaponFluidAssort(probHelper, debugLogging);
        traderData.createKeyFluidAssort(probHelper, debugLogging);
        traderData.createSpecFluidAssort(probHelper, debugLogging);
        traderData.addReqSlips();
        traderData.addFlares();
        
        for (var wepPresetCount = 1; wepPresetCount <randomUtil.getInt(17, 34); wepPresetCount++) traderData.addWeaponPresets(wepPresetCount, debugLogging);
        for (var gearPresetCount = 1; gearPresetCount <randomUtil.getInt(15, 30); gearPresetCount++) traderData.addGearPresets(gearPresetCount, debugLogging);

        if (debugLogging)
        {
            logger.log(`[${logstring}] ${wepPresetCount} total weapon presets have been added`, LogTextColor.GREEN);
            logger.log(`[${logstring}] ${gearPresetCount} total gear presets have been added`, LogTextColor.GREEN);
        }

        if (modConfig.EnableCustomItems)
        {
            traderData.addStaticItems(probHelper, debugLogging);
            for (var customPresetCount = 1; customPresetCount <randomUtil.getInt(1, 4); customPresetCount++) traderData.addCustomPresets(customPresetCount, debugLogging);

            if (debugLogging)
            {
                logger.log(`[${logstring}] ${customPresetCount} total custom presets have been added`, LogTextColor.GREEN);                    
            }
        }

        //Add custom quests
        utils.addQuests(tables, imageRouter, modPath, modName, debugLogging);        
    }
}