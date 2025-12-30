import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  generateUsage,
  printHelp,
  printProgress,
  printResults,
  printCrossEngineSummary,
  printDivider
} from '../print.mjs'

const SAMPLE_PARAMS = {
  help: {
    aliases: ['-h', '--help'],
    type: 'boolean',
    description: 'Show help'
  },
  runs: {
    aliases: ['-r', '--runs'],
    type: 'number',
    description: 'Runs count'
  },
  engine: {
    aliases: ['-e', '--engine'],
    type: 'string',
    description: 'Engine name'
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('generateUsage', () => {
  it('renders usage string with short flags', () => {
    const usage = generateUsage(SAMPLE_PARAMS)
    expect(usage).toContain('benes <file|dir>')
    expect(usage).toContain('[-h]')
    expect(usage).toContain('[-r N]')
    expect(usage).toContain('[-e S]')
  })

  it('skips flags without short alias', () => {
    const params = {
      longOnly: {
        aliases: ['--long-only'],
        type: 'boolean',
        description: 'Long only'
      }
    }
    const usage = generateUsage(params)
    expect(usage).not.toContain('long-only')
  })
})

describe('printHelp', () => {
  it('prints usage and parameter list', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const usage = 'benes <file|dir> [-h]'

    printHelp(SAMPLE_PARAMS, usage)

    const calls = logSpy.mock.calls.map(([msg]) => msg)
    expect(calls[0]).toBe(`Usage: ${usage}\n`)
    expect(calls.length).toBe(2 + Object.keys(SAMPLE_PARAMS).length)
    expect(calls.some((line) => line.includes('file|dir') && line.includes('Path to test file or directory'))).toBe(
      true
    )
    expect(calls.some((line) => line.includes('-h, --help') && line.includes('Show help'))).toBe(true)
    expect(calls.some((line) => line.includes('-r, --runs') && line.includes('Runs count'))).toBe(true)
    expect(calls.some((line) => line.includes('-e, --engine') && line.includes('Engine name'))).toBe(true)
  })
})

describe('printProgress', () => {
  it('does nothing when total is zero', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    printProgress(1, 0, 'test')
    expect(writeSpy).not.toHaveBeenCalled()
  })

  it('prints progress line and newline on completion', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    printProgress(3, 3, 'run')
    expect(writeSpy.mock.calls[0][0]).toBe('\rrun: 100% (3/3)')
    expect(writeSpy.mock.calls[1][0]).toBe('\n')
  })
})

describe('printDivider', () => {
  it('prints default divider when no text provided', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    printDivider()
    expect(logSpy).toHaveBeenCalledWith('='.repeat(60))
  })

  it('centers text with default length and fill', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    printDivider('Engine: V8')
    expect(logSpy).toHaveBeenCalledWith('======================== Engine: V8 ========================')
  })

  it('uses custom length and fill', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    printDivider('Hi', 10, '-')
    expect(logSpy).toHaveBeenCalledWith('--- Hi ---')
  })

  it('prints text only when longer than divider length', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    printDivider('long text', 5, '=')
    expect(logSpy).toHaveBeenCalledWith(' long text ')
  })
})

describe('printResults', () => {
  it('prints "No results" when array is empty', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    printResults([], 2, false)
    expect(logSpy).toHaveBeenCalledWith('No results')
  })

  it('handles results with empty times array', () => {
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})
    const data = [{ label: 'test', avg: 0, times: [] }]

    printResults(data, 2, false)

    expect(tableSpy).toHaveBeenCalledWith({
      test: { Average: 0, Median: 0, 'Delta avg': 0, 'Delta median': 0, 'X slower': 0 }
    })
  })

  it('prints table sorted by average time', () => {
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})
    const data = [
      { label: 'b', avg: 2, times: [2, 2] },
      { label: 'a', avg: 1.5, times: [1.5] }
    ]

    printResults(data, 2, false)

    expect(tableSpy).toHaveBeenCalledWith({
      a: { Average: 1.5, Median: 1.5, 'Delta avg': 0, 'Delta median': 0, 'X slower': 1 },
      b: { Average: 2, Median: 2, 'Delta avg': 0.5, 'Delta median': 0.5, 'X slower': 1.33 }
    })
  })

  it('rounds values using provided precision', () => {
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})
    const data = [
      { label: 'fast', avg: 1.23456, times: [1.23456] },
      { label: 'slow', avg: 2.98765, times: [2.98765] }
    ]

    printResults(data, 3, false)

    expect(tableSpy).toHaveBeenCalledWith({
      fast: { Average: 1.235, Median: 1.235, 'Delta avg': 0, 'Delta median': 0, 'X slower': 1 },
      slow: { Average: 2.988, Median: 2.988, 'Delta avg': 1.753, 'Delta median': 1.753, 'X slower': 2.42 }
    })
  })

  it('handles zero fastest value', () => {
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})
    const data = [
      { label: 'zero', avg: 0, times: [0] },
      { label: 'slow', avg: 1, times: [1] }
    ]

    printResults(data, 2, false)

    expect(tableSpy).toHaveBeenCalledWith({
      zero: { Average: 0, Median: 0, 'Delta avg': 0, 'Delta median': 0, 'X slower': 0 },
      slow: { Average: 1, Median: 1, 'Delta avg': 1, 'Delta median': 1, 'X slower': 0 }
    })
  })

  it('prints verbose run details when enabled', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})
    const data = [
      { label: 'b', avg: 2, times: [2, 2] },
      { label: 'a', avg: 1.5, times: [1.5] }
    ]

    printResults(data, 2, true)

    const lines = logSpy.mock.calls.map(([msg]) => msg)
    expect(lines).toContain('a(1/1): 1.50')
    expect(lines).toContain('b(1/2): 2.00')
    expect(lines).toContain('b(2/2): 2.00')
    expect(lines.filter((line) => line === '------------------------').length).toBe(2)
    expect(tableSpy).toHaveBeenCalled()
  })
})

describe('printCrossEngineSummary', () => {
  it('does nothing when resultsByEngine is empty', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})

    printCrossEngineSummary([], 2)

    expect(logSpy).not.toHaveBeenCalled()
    expect(tableSpy).not.toHaveBeenCalled()
  })

  it('handles missing results for some engines', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})
    const resultsByEngine = [
      {
        engine: 'node',
        results: [{ label: 'a', avg: 1, times: [1] }]
      },
      {
        engine: 'v8',
        results: [{ label: 'b', avg: 2, times: [2] }]
      }
    ]

    printCrossEngineSummary(resultsByEngine, 2)

    // Should still work even though 'a' is missing from v8 and 'b' from node
    expect(tableSpy).toHaveBeenCalled()
  })

  it('prints per-test tables and a summary table with X slower', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {})
    const resultsByEngine = [
      {
        engine: 'node',
        results: [
          { label: 'a', avg: 2, times: [2, 2] },
          { label: 'b', avg: 1, times: [1] }
        ]
      },
      {
        engine: 'v8',
        results: [
          { label: 'a', avg: 1, times: [1, 3] },
          { label: 'b', avg: 2, times: [2] }
        ]
      }
    ]

    printCrossEngineSummary(resultsByEngine, 2)

    expect(logSpy).toHaveBeenCalledWith('\nTest: a')
    expect(logSpy).toHaveBeenCalledWith('\nTest: b')
    expect(logSpy).toHaveBeenCalledWith('\nCross-engine summary (median and X slower):')

    expect(tableSpy).toHaveBeenNthCalledWith(1, {
      V8: {
        Average: 1,
        Median: 2,
        'Delta avg': 0,
        'Delta median': 0,
        'X slower': 1
      },
      NODE: {
        Average: 2,
        Median: 2,
        'Delta avg': 1,
        'Delta median': 0,
        'X slower': 2
      }
    })
    expect(tableSpy).toHaveBeenNthCalledWith(2, {
      NODE: {
        Average: 1,
        Median: 1,
        'Delta avg': 0,
        'Delta median': 0,
        'X slower': 1
      },
      V8: {
        Average: 2,
        Median: 2,
        'Delta avg': 1,
        'Delta median': 1,
        'X slower': 2
      }
    })
    expect(tableSpy).toHaveBeenNthCalledWith(3, {
      a: { NODE: '2.00 (2.0)', V8: '2.00 (1.0)' },
      b: { NODE: '1.00 (1.0)', V8: '2.00 (2.0)' }
    })
  })
})
