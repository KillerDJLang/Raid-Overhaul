import { AssortedBullshit } from "../BaseFeatures/baseFeatures";
import type { configFile, seasonalProgression, debugFile } from "./Enums";
import type { Logger } from "./Logger";
import type { References } from "./References";
import type { Utils } from "./Utils";

import * as fs from "node:fs";
import * as path from "node:path";
import JSON5 from "json5";

const EventWeightingsConfig = require("../../config/EventWeightings.json");

export class StaticRouters {
  private routerPrefix = "[Raid Overhaul] ";

  constructor(
    public ref: References,
    public utils: Utils,
    public logger: Logger
  ) {}

  public registerHooks(): void {
    const modConfig = JSON5.parse(
      this.ref.vfs.readFile(
        path.resolve(__dirname, "../../config/config.json5")
      )
    ) as configFile;
    const debugConfig = JSON5.parse(
      this.ref.vfs.readFile(
        path.resolve(__dirname, "./ArrayFiles/debugOptions.json5")
      )
    ) as debugFile;
    const weatherConfig = JSON5.parse(
      this.ref.vfs.readFile(
        path.resolve(__dirname, "./ArrayFiles/SeasonsProgressionFile.json5")
      )
    ) as seasonalProgression;
    const modFeatures = new AssortedBullshit(this.utils, this.ref, this.logger);

    //Backup profile
    this.ref.staticRouter.registerStaticRouter(
      `${this.routerPrefix}-/client/game/start`,
      [
        {
          url: "/client/game/start",
          action: async (url, info, sessionID, output) => {
            const profileInfo =
              this.ref.profileHelper.getFullProfile(sessionID);

            if (modConfig.BackupProfile) {
              this.utils.profileBackup(sessionID, profileInfo);
            }
            return Promise.resolve(output);
          },
        },
      ],
      "spt"
    );

    //Get and send configs to the client
    this.ref.staticRouter.registerStaticRouter(
      "GetEventConfig",
      [
        {
          url: "/RaidOverhaul/GetEventConfig",
          action: async (url, info, sessionId, output) => {
            const EventWeightings = EventWeightingsConfig;

            return JSON.stringify(EventWeightings);
          },
        },
      ],
      "spt"
    );

    this.ref.staticRouter.registerStaticRouter(
      "GetServerConfig",
      [
        {
          url: "/RaidOverhaul/GetServerConfig",
          action: async (url, info, sessionId, output) => {
            const ServerConfig = modConfig;

            return JSON.stringify(ServerConfig);
          },
        },
      ],
      "spt"
    );

    this.ref.staticRouter.registerStaticRouter(
      "GetWeatherConfig",
      [
        {
          url: "/RaidOverhaul/GetWeatherConfig",
          action: async (url, info, sessionId, output) => {
            const WeatherConfig = weatherConfig;

            return JSON.stringify(WeatherConfig);
          },
        },
      ],
      "spt"
    );

    this.ref.staticRouter.registerStaticRouter(
      "GetDebugConfig",
      [
        {
          url: "/RaidOverhaul/GetDebugConfig",
          action: async (url, info, sessionId, output) => {
            const DebugConfig = debugConfig;

            return JSON.stringify(DebugConfig);
          },
        },
      ],
      "spt"
    );

    // Randomize weather pre-raid
    if (modConfig.Seasons.EnableWeatherOptions) {
      if (
        modConfig.Seasons.NoWinter &&
        !modConfig.Seasons.AllSeasons &&
        !modConfig.Seasons.SeasonalProgression &&
        !modConfig.Seasons.WinterWonderland
      ) {
        this.ref.staticRouter.registerStaticRouter(
          `[${this.routerPrefix}]-/Seasons`,
          [
            {
              url: "/client/items",
              action: async (url, info, sessionId, output) => {
                modFeatures.weatherChangesNoWinter(modConfig);
                return Promise.resolve(output);
              },
            },
          ],
          "spt"
        );
      }

      if (
        modConfig.Seasons.AllSeasons &&
        !modConfig.Seasons.NoWinter &&
        !modConfig.Seasons.SeasonalProgression &&
        !modConfig.Seasons.WinterWonderland
      ) {
        this.ref.staticRouter.registerStaticRouter(
          `[${this.routerPrefix}]-/Seasons`,
          [
            {
              url: "/client/items",
              action: async (url, info, sessionId, output) => {
                modFeatures.weatherChangesAllSeasons(modConfig);
                return Promise.resolve(output);
              },
            },
          ],
          "spt"
        );
      }

      if (
        modConfig.Seasons.SeasonalProgression &&
        !modConfig.Seasons.AllSeasons &&
        !modConfig.Seasons.NoWinter &&
        !modConfig.Seasons.WinterWonderland
      ) {
        this.ref.staticRouter.registerStaticRouter(
          `[${this.routerPrefix}]-/Seasons`,
          [
            {
              url: "/client/match/local/start",
              action: async (url, info, sessionId, output) => {
                modFeatures.seasonProgression(debugConfig);
                return Promise.resolve(output);
              },
            },
          ],
          "spt"
        );
      }
    }
  }
}
