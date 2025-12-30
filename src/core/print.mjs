/**
 * Generates usage string based on parameters
 * @param {Object} params - Object with command line parameters
 * @returns {string} String like "node ./src/index.mjs <dir> [-h] [-e S] [-r N] [-v]"
 */
export function generateUsage(params) {
  const flags = Object.values(params)
    .map((param) => {
      const shortAlias = param.aliases.find((a) => a.startsWith('-') && !a.startsWith('--'))

      if (!shortAlias) {
        return ''
      }

      if (param.type === 'boolean') {
        return `[${shortAlias}]`
      }

      const typeLabel = param.type === 'number' ? 'N' : 'S'
      return `[${shortAlias} ${typeLabel}]`
    })
    .filter(Boolean)

  return `node ./src/index.mjs <file|dir> ${flags.join(' ')}`
}

/**
 * Shows help message with program usage description and parameter list
 * @param {Object} params - Object with command line parameters
 * @param {string} description - Program usage description
 */
export function printHelp(params, description) {
  console.log(`Usage: ${description}\n`)
  const entries = [{ aliases: ['<file|dir>'], description: 'Path to test file or directory' }, ...Object.values(params)]

  // String like "-h, --help"
  const flagStrings = entries.map((f) => f.aliases.join(', '))
  const maxLen = Math.max(...flagStrings.map((s) => s.length)) + 4

  // Print aligned by maxLen
  flagStrings.forEach((str, i) => {
    const padded = str.padEnd(maxLen)
    console.log(`${padded} ${entries[i].description}`)
  })
}

/**
 * Outputs execution progress to console with line rewriting
 * @param {number} curr - Current run number
 * @param {number} total - Total number of runs
 * @param {string} label - Label for progress display
 */
export function printProgress(curr, total, label) {
  if (total === 0) {
    return
  }

  const pct = ((curr / total) * 100).toFixed(0).padStart(3)
  process.stdout.write(`\r${label}: ${pct}% (${curr}/${total})`)

  if (curr === total) {
    process.stdout.write('\n')
  }
}

/**
 * Prints divider line with optional text, total length 60
 * @param {string} [text] - Optional label for divider
 */
export function printDivider(text, totalLen = 60, fill = '=') {
  if (!text) {
    console.log(fill.repeat(totalLen))
    return
  }

  const normalized = String(text)
  const padded = ` ${normalized} `
  const remaining = totalLen - padded.length

  if (remaining <= 0) {
    console.log(padded)
    return
  }

  const left = Math.floor(remaining / 2)
  const right = remaining - left
  console.log(`${fill.repeat(left)}${padded}${fill.repeat(right)}`)
}

/**
 * Calculates median from a list of numbers
 * @param {number[]} values - Array of numeric values
 * @returns {number}
 */
function getMedian(values) {
  if (!values.length) {
    return 0
  }

  const sorted = values.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 1) {
    return sorted[mid]
  }

  return (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Outputs benchmark results table sorted by average time
 * @param {Array<{ label: string, avg: number, times: number[] }>} resulData - Array of results with timing data
 * @param {number} precision - Number of decimal places for time display
 * @param {boolean} verbose - Flag to output results of each individual run
 */
export function printResults(resulData, precision, verbose) {
  if (!resulData.length) {
    console.log('No results')
    return
  }

  const results = resulData.slice().sort((a, b) => a.avg - b.avg)

  if (verbose) {
    results.forEach((el) => {
      const runs = el.times.length
      el.times.forEach((time, i) => console.log(`${el.label}(${i + 1}/${runs}): ${time.toFixed(precision)}`))
      console.log('------------------------')
    })
  }

  const fastest = results[0].avg
  const fastestMedian = getMedian(results[0].times)
  const resultsTable = results.reduce((obj, el) => {
    let xSlower = 0
    if (fastest !== 0) {
      xSlower = +(el.avg / fastest).toFixed(2)
    }
    const median = getMedian(el.times)
    obj[el.label] = {
      Average: +el.avg.toFixed(precision),
      Median: +median.toFixed(precision),
      'Delta avg': +(el.avg - fastest).toFixed(precision),
      'Delta median': +(median - fastestMedian).toFixed(precision),
      'X slower': xSlower
    }
    return obj
  }, {})

  console.table(resultsTable)
}

/**
 * Outputs cross-engine summary by test label, sorted by average time
 * @param {Array<{ engine: string, results: Array<Object> }>} resultsByEngine - Results per engine
 * @param {number} precision - Number of decimal places for time display
 */
export function printCrossEngineSummary(resultsByEngine, precision) {
  if (!resultsByEngine.length) {
    return
  }

  const labelSet = new Set()
  const resultsMaps = resultsByEngine.map(({ engine, results }) => {
    const map = new Map(results.map((r) => [r.label, r]))
    results.forEach((r) => labelSet.add(r.label))
    return { engine, map }
  })

  const labels = Array.from(labelSet).sort()
  const summaryTable = {}

  labels.forEach((label) => {
    const entries = []

    resultsMaps.forEach(({ engine, map }) => {
      const res = map.get(label)
      if (!res) {
        return
      }
      const median = getMedian(res.times)
      entries.push({ engine, avg: res.avg, median })
    })

    const fastestAvg = entries.reduce((min, entry) => {
      if (min === null || entry.avg < min) {
        return entry.avg
      }
      return min
    }, null)

    const fastestMedian = entries.reduce((min, entry) => {
      if (min === null || entry.median < min) {
        return entry.median
      }
      return min
    }, null)

    const table = {}
    const sortedEntries = entries.slice().sort((a, b) => a.avg - b.avg)

    sortedEntries.forEach((entry) => {
      let xSlower = 0
      if (fastestAvg !== null && fastestAvg !== 0) {
        xSlower = +(entry.avg / fastestAvg).toFixed(2)
      }

      const deltaAvg = fastestAvg === null ? 0 : entry.avg - fastestAvg
      const deltaMedian = fastestMedian === null ? 0 : entry.median - fastestMedian

      table[entry.engine.toUpperCase()] = {
        Average: +entry.avg.toFixed(precision),
        Median: +entry.median.toFixed(precision),
        'Delta avg': +deltaAvg.toFixed(precision),
        'Delta median': +deltaMedian.toFixed(precision),
        'X slower': xSlower
      }
    })

    console.log(`\nTest: ${label}`)
    console.table(table)

    const summaryRow = {}
    sortedEntries.forEach((entry) => {
      let xSlower = 0
      if (fastestAvg !== null && fastestAvg !== 0) {
        xSlower = entry.avg / fastestAvg
      }
      summaryRow[entry.engine.toUpperCase()] = `${entry.median.toFixed(precision)} (${xSlower.toFixed(1)})`
    })
    summaryTable[label] = summaryRow
  })

  console.log('\nCross-engine summary (median and X slower):')
  console.table(summaryTable)
}
