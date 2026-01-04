/**
 * Simple benchmarking utility for measuring execution time
 *
 * @example
 * import { bench } from 'benes/utils'
 *
 * // Prepare test data
 * var data = prepareData()
 *
 * // Run benchmark
 * bench.start()
 * var result = functionToTest(data)
 * bench.end()
 *
 * // Run benchmark with warmup
 * bench.run(() => functionToTest(data), { warmup: 5, runs: 20 })
 */

let startTime = 0

function nowMs() {
  if (globalThis.performance && typeof globalThis.performance.now === 'function') {
    return globalThis.performance.now()
  }
  return Date.now()
}

function ensureSyncResult(result) {
  if (result && typeof result.then === 'function') {
    throw new Error('bench.run does not support async functions')
  }
}

function runOnce(fn) {
  const start = nowMs()
  const result = fn()
  ensureSyncResult(result)
  return nowMs() - start
}

export const bench = {
  /**
   * Starts the benchmark timer
   */
  start() {
    startTime = nowMs()
  },

  /**
   * Ends the benchmark timer and outputs the elapsed time to console
   * The output is prefixed with __BENCH__: to distinguish from user logs
   */
  end() {
    const elapsed = nowMs() - startTime
    console.log(`__BENCH__:${elapsed}`)
  },

  /**
   * Runs optional warmup iterations and measures average execution time
   * @param {Function} fn - Function to measure
   * @param {Object} [options] - Run options
   * @param {number} [options.warmup=0] - Warmup iterations
   * @param {number} [options.runs=1] - Measured iterations
   */
  run(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new Error('bench.run requires a function')
    }

    const warmup = options.warmup ?? 0
    const runs = options.runs ?? 1

    if (!Number.isInteger(warmup) || warmup < 0) {
      throw new Error('bench.run warmup must be a non-negative integer')
    }

    if (!Number.isInteger(runs) || runs < 1) {
      throw new Error('bench.run runs must be a positive integer')
    }

    for (let i = 0; i < warmup; i++) {
      const result = fn()
      ensureSyncResult(result)
    }

    const times = []
    for (let i = 0; i < runs; i++) {
      times.push(runOnce(fn))
    }

    const avg = times.reduce((sum, n) => sum + n, 0) / times.length
    console.log(`__BENCH__:${avg}`)
  }
}
