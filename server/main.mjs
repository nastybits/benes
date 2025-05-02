#!/usr/bin/env node
/**
 * Запуск:
 * node bench.mjs <file> [runs] [-q]
 *
 *   <file> — путь к JS-файлу, который выполняется командой `v8`
 *   [runs] — количество прогонов (по умолчанию 10)
 *   -q     — выводить только итог (время каждого прогона скрыто)
 */

import { runOnce } from "./utils/runOnce.mjs"
import { printProgress } from "./utils/printProgress.mjs"
import { resolve as resolvePath } from "path"

const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.error("Usage: node bench.mjs <file> [runs] [-q]")
  process.exit(1)
}

const quiet = argv.includes("-q")
if (quiet) {
  argv.splice(argv.indexOf("-q"), 1)
}

const PRECITION = 5
const RUNS_DEFAULT = 10

const filePath = resolvePath(process.cwd(), argv[0])
const runs = Number(argv[1] || RUNS_DEFAULT)
const times = []

for (let i = 0; i <= runs; i++) {
  try {
    const t = await runOnce(filePath)
    times.push(t)

    quiet
      ? printProgress(i, runs)
      : console.log(`Run ${i}/${runs}: ${t.toFixed(PRECITION)} ms`)
  } catch (e) {
    console.error(`\n${e.message}`)
    process.exit(1)
  }
}

if (quiet) {
  process.stdout.write("\n")
}

const avg = (times.reduce((s, n) => s + n, 0) / times.length).toFixed(PRECITION)
console.log(`────────────────────────
Average (${runs} runs): ${avg} ms
────────────────────────`
)