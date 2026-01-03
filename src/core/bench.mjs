import { spawn } from 'child_process'
import { printProgress } from './print.mjs'

// Timeout for each run execution
const TIMEOUT = 5_000

/**
 * Runs a single test iteration
 * @param {string} file - Path to file to execute
 * @param {string} engine - Engine to execute (node, bun, etc.)
 * @param {number} [timeout=TIMEOUT] - Timeout for a single run in milliseconds
 * @returns {Promise<number>} Execution time in milliseconds
 */
function runOnce(file, engine, timeout = TIMEOUT) {
  return new Promise((resolve, reject) => {
    // Prepare engine arguments
    // Most engines need --module flag for ESM support
    // Node.js and Bun handle ESM natively without flags
    const needsModuleFlag = !['node', 'bun'].includes(engine)
    const args = needsModuleFlag ? ['--module', file] : [file]

    const child = spawn(engine, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      signal: AbortSignal.timeout(timeout)
    })

    let output = ''
    let errorOutput = ''

    child.stdout.on('data', (c) => (output += c))
    child.stderr.on('data', (c) => (errorOutput += c))

    child.on('error', (err) => {
      if (err.code === 'ENOENT') {
        let installMessage
        if (engine === 'node') {
          installMessage = 'Make sure Node.js is installed and available in PATH.'
        } else if (engine === 'bun') {
          installMessage = 'Install Bun: https://bun.sh'
        } else {
          installMessage = `Install '${engine}' via JSVU: https://github.com/GoogleChromeLabs/jsvu`
        }

        return reject(new Error(`Engine '${engine}' not found.\n${installMessage}`))
      }
      reject(err)
    })

    child.on('close', (code) => {
      if (code !== 0) {
        const errorMessage = errorOutput.trim() ? `\n${errorOutput.trim()}` : ''
        return reject(new Error(`${engine} exited with code ${code}${errorMessage}`))
      }

      // Parse bench output with __BENCH__: prefix
      const lines = output.trim().split('\n')
      const benchLine = lines.find((line) => line.startsWith('__BENCH__:'))

      if (!benchLine) {
        return reject(
          new Error(
            `Cannot find benchmark output in test.\n` +
              `Expected: Line starting with "__BENCH__:" (e.g., "__BENCH__:123.456")\n` +
              `Got output:\n${output.substring(0, 200)}${output.length > 200 ? '...' : ''}\n\n` +
              `Tip: Make sure you call bench.end() in your test file`
          )
        )
      }

      const timeStr = benchLine.substring('__BENCH__:'.length)
      const time = parseFloat(timeStr)

      if (isNaN(time)) {
        return reject(
          new Error(
            `Cannot parse time from benchmark output.\n` +
              `Expected: "__BENCH__:<number>" (e.g., "__BENCH__:123.456")\n` +
              `Got: "${benchLine}"`
          )
        )
      }

      resolve(time)
    })
  })
}

/**
 * Runs file for benchmarking
 * @param {Object} file - File to run (contains path, label, etc.)
 * @param {string} engine - Engine to execute
 * @param {number} runs - Number of runs
 * @param {number} timeout - Timeout for a single run in milliseconds
 * @returns {Promise<number[]>} Array with execution time of each run
 */
export async function benchFile(file, engine = 'v8', runs = 10, timeout = TIMEOUT) {
  const times = []

  for (let i = 1; i <= runs; i++) {
    const time = await runOnce(file.path, engine, timeout)
    const label = `${file.label}`
    times.push(time)
    printProgress(i, runs, label)
  }

  return times
}

/**
 * Sequential execution of file benchmarks
 * @param {Array<Object>} files - Array of files to benchmark
 * @param {string} engine - Engine to execute
 * @param {number} runs - Number of runs for each file
 * @param {number} timeout - Timeout for a single run in milliseconds
 * @returns {Promise<Array<Object>>} Array of results with times and average values
 */
export async function benchFiles(files, engine = 'v8', runs = 10, timeout = TIMEOUT) {
  const results = []

  for (const file of files) {
    try {
      const times = await benchFile(file, engine, runs, timeout)
      const avg = times.reduce((s, n) => s + n, 0) / times.length
      results.push({ ...file, times, avg })
    } catch (e) {
      throw new Error(`${file.label}: ${e.message}`)
    }
  }

  return results
}
