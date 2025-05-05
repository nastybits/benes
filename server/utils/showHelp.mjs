import { flagDefs } from "./flagDefs.mjs"

/**
 * Показывает сообщение help
 */
export function showHelp() {
  console.log("node bench.mjs [-h] <dir> [-r N] [-p N] [-q]")
  for (const key in flagDefs) {
    const flag = flagDefs[key]
    console.log(`${flag.aliases.join(", ")}: ${flag.description}`)
  }
}