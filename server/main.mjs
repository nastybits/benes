#!/usr/bin/env node

/**
 * Запуск: node bench.mjs <dir> [runs] [-p] [-q]
 */

import { scanDir, benchFile, parseArgs, showHelp } from "./utils/index.js"

async function main() {
  let args
  try {
    args = parseArgs(process.argv)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }

  const { dir, runs, quiet, precision, help } = args

  if (help) {
    showHelp()
    process.exit(1)
  }

  const files = await scanDir(dir)

  if (files.length === 0) {
    console.error(`No .js files found in "${dir}"`)
    process.exit(1)
  }

  console.log(`-------- Test: ${dir} ----------`)
  const results = []
  for (const file of files) {
    try {
      const times = await benchFile(file, runs)
      const average = times.reduce((s, n) => s + n, 0) / times.length
      results.push({ ...file, times, avg: average.toFixed(precision) })
    } catch (e) {
      console.error(`${file.label}: ${e.message}`)
      process.exit(1)
    }
  }

  results.sort((a, b) => a.avg - b.avg)

  if (!quiet) {
    results.forEach(el => {
      console.log(`Runs ${el.label}:`)
      el.times.forEach((time, i) => console.log(`  ${el.label} (${i}/${runs}): ${time}`))
      console.log("------------------------")
    })
  }

  console.log("---- Average Results -----")
  results.forEach(el => console.log(`${el.label}: ${el.avg}`))
  console.log("--------------------------")
}

main()