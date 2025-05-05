import { flagDefs } from "./flagDefs.mjs"
import { resolve } from "path"

/**
 * Разбор аргументов CLI.
 * @param {string[]} argv - process.argv
 * @returns {{ dir:string, runs:number } & Record<string,any>}
 */
export function parseArgs(argv) {
  const args = argv.slice(2)

  // ---------- Значениями по умолчанию ----------
  const flags = {}
  for (const key in flagDefs) {
    flags[key] = flagDefs[key].default
  }

  // ---------- вытаскиваем флаги ----------
  for (let i = args.length - 1; i >= 0; i--) {
    const token = args[i]
    const flag = Object.entries(flagDefs).find(([_, val]) => val.aliases.includes(token))

    if (!flag) {
      continue
    }

    const [name, def] = flag
    if (def.type === "boolean") {
      flags[name] = true
    } else {
      // string | number с аргументом после флага
      const val = args[i + 1]
      if (val === undefined) {
        throw new Error(`Flag ${token} expects value`)
      }

      flags[name] = def.type === "number" ? Number(val) : val
      args.splice(i + 1, 1)
    }

    args.splice(i, 1) // удаляем сам флаг
  }

  if (args.length === 0) {
    throw new Error("Directory <dir> is required")
  }

  if (args.length > 2) {
    throw new Error(`Unknown argument "${args[2]}"`)
  }

  return { dir: resolve(process.cwd(), args[0]), ...flags }
}
