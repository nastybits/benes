#!/usr/bin/env node
import { scanDir, benchFiles, parseArgs, printResults } from "./utils/index.js"
import { FLAGS } from "./params.js"

async function main() {
  try {
    const args = parseArgs(process.argv, FLAGS)
    const files = await scanDir(args.dir)
    const results = await benchFiles(files, args.engine, args.runs)

    printResults(results, args.precision, args.all)
  } catch (e) {
    console.error("Error:", e.message)
    process.exit(1)
  }
}

main()