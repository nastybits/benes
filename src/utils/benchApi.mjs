/**
 * Simple benchmarking utility for measuring execution time
 *
 * @example
 * import { bench } from '../../src/utils/bench.mjs'
 *
 * // Prepare test data
 * var data = prepareData()
 *
 * // Run benchmark
 * bench.start()
 * var result = functionToTest(data)
 * bench.end()
 */

let startTime = 0

function nowMs() {
  if (globalThis.performance && typeof globalThis.performance.now === 'function') {
    return globalThis.performance.now()
  }
  return Date.now()
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
  }
}
