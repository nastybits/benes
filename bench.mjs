#!/usr/bin/env node
/**
 * Запуск:
 * node bench.mjs <file> [runs] [-q]
 *
 *   <file> — путь к JS-файлу, который выполняется командой `v8`
 *   [runs] — количество прогонов (по умолчанию 10)
 *   -q     — выводить только итог (время каждого прогона скрыто)
 */

import { spawn } from "child_process"
import { resolve as resolvePath } from "path"

const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.error("Usage: node bench.mjs <file> [runs] [-q]")
  process.exit(1)
}

const quiet = argv.includes("-q")
if (quiet) argv.splice(argv.indexOf("-q"), 1)

const filePath = resolvePath(process.cwd(), argv[0])
const runs = Number(argv[1] || 10)
const times = []

function runOnce(file) {
  return new Promise((resolve, reject) => {
    const child = spawn("v8", [file], { stdio: ["ignore", "pipe", "inherit"] })
    let output = ""
    child.stdout.on("data", c => (output += c))
    child.on("error", reject)
    child.on("close", code => {
      if (code !== 0) {
        return reject(new Error(`v8 exited with code ${code}`))
      }
      const time = parseFloat(output.trim())
      if (isNaN(time)) {
        return reject(new Error(`Cannot parse time from:\n${output}`))
      }
      resolve(time)
    })
  })
}

function printProgress(curr, total) {
  const pct = ((curr / total) * 100).toFixed(0).padStart(3)
  process.stdout.write(`\rProgress: ${curr}/${total}  ${pct}%`)
}

for (let i = 1; i <= runs; i++) {
  try {
    const t = await runOnce(filePath)
    times.push(t)

    if (!quiet) {
      console.log(`Run ${i}/${runs}: ${t.toFixed(3)} ms`)
    } else {
      printProgress(i, runs)
    }
  } catch (e) {
    console.error(`\n${e.message}`)
    process.exit(1)
  }
}

if (quiet) process.stdout.write("\n")

const avg = times.reduce((s, n) => s + n, 0) / times.length
console.log(
  `────────────────────────
Average (${runs} runs): ${avg.toFixed(3)} ms
────────────────────────`
)
