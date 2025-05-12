import { resolve } from "path"
import { printHelp } from "./index.js"

/**
 * Разбор аргументов CLI.
 * @param {string[]} argv - process.argv
 * @param {Object[]} params - настройки флагов для разбора
 * @returns {{ dir:string } & Record<string,any>}
 */
export function parseArgs(argv, params) {
  const args = argv.slice(2)

  const flags = {}
  for (const key in params) {
    flags[key] = params[key].default
  }

  for (let i = args.length - 1; i >= 0; i--) {
    const token = args[i]
    const entrie = Object.entries(params).find(([_, val]) => val.aliases.includes(token))
    if (!entrie) {
      continue
    }

    const [key, flag] = entrie
    let value = true

    // Обработка типов string | number с аргументом после флага
    if (flag.type !== "boolean") {
      const argValue = args[i + 1]
      if (argValue === undefined) {
        throw new Error(`Flag ${token} expects value`)
      }

      value = flag.type === "number" ? Number(argValue) : argValue
      if (flag.validate && !flag.validate(value)) {
        throw new Error(`Wrong value for "${token}": ${value}`)
      }

      args.splice(i + 1, 1)
    }

    flags[key] = value
    args.splice(i, 1)
  }

  const dir = args[0]

  if (!dir || flags.help) {
    printHelp(params, "node ./bench <dir> [-h] [-e S] [-r N] [-p N] [-a]")
    process.exit(1)
  }

  if (args.length > 1) {
    throw new Error(`Unknown argument "${args[1]}"`)
  }

  return { dir: resolve(process.cwd(), dir), ...flags }
}
