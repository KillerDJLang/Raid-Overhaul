$buildFolder = "..\Build"
$bepinexFolder = "$buildFolder\BepInEx"
$userModsFolder = "$buildFolder\user\mods\RaidOverhaul"
$bepinexPatchFolder = "$bepinexFolder\patchers"
$bepinexPluginFolder = "$bepinexFolder\plugins\RaidOverhaul"
$bepinexResourcesFolder = "$bepinexPluginFolder\Resources"
$bepinexFlagsFolder = "$bepinexResourcesFolder\Flags"
$serverModFolder = "..\RaidOverhaul"
$watchAnimsFolder = "..\RaidOverhaulWatchBundles\bundles"
$prePatchFolder = "..\ROPrepatch\bin\Release\net471"
$pluginFolder = "..\ROPlugin\bin\Release\net471"
$basePluginFolder = "..\ROPlugin"

if (Test-Path "$buildFolder") { Remove-Item -Path "$buildFolder" -Recurse -Force }

$foldersToCreate = @("$buildFolder", "$bepinexFolder", "$bepinexPatchFolder", "$bepinexPluginFolder", "$bepinexResourcesFolder", "$bepinexFlagsFolder")
foreach ($folder in $foldersToCreate) {
    if (-not (Test-Path "$folder")) { New-Item -Path "$folder" -ItemType Directory }
}

Copy-Item "$prePatchFolder\LegionPrePatch.dll" -Destination "$bepinexPatchFolder" -Force
Copy-Item "$pluginFolder\RaidOverhaul.dll" -Destination "$bepinexPluginFolder" -Force
Copy-Item "$basePluginFolder\normalLegionSettings.json" -Destination "$bepinexResourcesFolder" -Force
Copy-Item "$basePluginFolder\TraderRep.json" -Destination "$bepinexFlagsFolder" -Force
Copy-Item "$watchAnimsFolder" -Destination "$bepinexPluginFolder" -Recurse -Force
Copy-Item "$serverModFolder\bundles" -Destination "$userModsFolder\bundles" -Recurse -Force
Copy-Item "$serverModFolder\config" -Destination "$userModsFolder" -Recurse -Force
Copy-Item "$serverModFolder\db" -Destination "$userModsFolder" -Recurse -Force
Copy-Item "$serverModFolder\ProfileBackup" -Destination "$userModsFolder" -Recurse -Force
Copy-Item "$serverModFolder\res" -Destination "$userModsFolder" -Recurse -Force
Copy-Item "$serverModFolder\src" -Destination "$userModsFolder" -Recurse -Force
Copy-Item "$serverModFolder\bundles.json" -Destination "$userModsFolder" -Force
Copy-Item "$serverModFolder\package.json" -Destination "$userModsFolder" -Force