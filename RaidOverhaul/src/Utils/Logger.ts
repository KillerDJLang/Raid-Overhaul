import * as path from "node:path";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import JSON5 from "json5";
import type { debugFile } from "../Utils/Enums";
import type { References } from "./References";

export class Logger {
  private logPrefix = "[Raid Overhaul] ";

  constructor(private ref: References) {}

  public log(text: string, textColor?: LogTextColor) {
    if (typeof textColor !== "undefined") {
      this.ref.logger.log(this.logPrefix + text, textColor);
    } else {
      this.ref.logger.log(this.logPrefix + text, LogTextColor.WHITE);
    }
  }

  public logError(errorText: string) {
    this.ref.logger.error(this.logPrefix + errorText);
  }

  public logWarning(text: string) {
    this.ref.logger.warning(this.logPrefix + text);
  }

  public logDebug(text: string) {
    const debugConfig = JSON5.parse(
      this.ref.vfs.readFile(
        path.resolve(__dirname, "./ArrayFiles/debugOptions.json5")
      )
    ) as debugFile;

    if (debugConfig.debugMode) {
      this.ref.logger.log(this.logPrefix + text, LogTextColor.WHITE);
    }
  }
}
