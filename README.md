[![npm version](https://badge.fury.io/js/benes.svg)](https://www.npmjs.com/package/benes)
[![Node.js Version](https://img.shields.io/node/v/benes.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

# benes

Cross-engine benchmark runner for comparing JavaScript implementations

## Description

CLI for benchmarking JavaScript implementations across multiple engines using the same test files. It runs each file repeatedly, extracts a `__BENCH__:` timing line, and prints a comparison table.

## Requirements

- Node.js v18+ or Bun v1.3+
- **Optional**: Extra engines for multi-engine runs. (Recommended install via [JSVU](https://github.com/GoogleChromeLabs/jsvu))

## Advantages

- **Multi-engine support**: run the same test files across Node, Bun, V8, SpiderMonkey, JavaScriptCore, and more.
- **Engine-agnostic protocol**: a single `__BENCH__:` line is enough.
- **Simple CLI workflow**: drop files into a folder, run one command, get a clear comparison table.
- **Minimal surface area**: no dependency on large benchmarking frameworks.

## Installation

Install benes with npm:

```bash
npm install --save-dev benes
```

Or with Bun:

```bash
bun add -d benes
```

## Usage

Run via npm scripts or npx:

```bash
# Via npx
npx benes <file|dir> [-h] [-V] [-e S] [-r N] [-t N] [-p N] [-v]

# Or add to package.json scripts:
# "scripts": {
#   "bench": "benes"
# }
# Then run:
npm run bench -- <file|dir> [flags]
```

Run via Bun:

```bash
# Via bunx
bunx benes <file|dir> [-h] [-V] [-e S] [-r N] [-t N] [-p N] [-v]
```

Make sure the engine is installed and available in PATH.

### Parameters

```bash
dir              # Directory with test files (required positional argument)
-h, --help       # Show help message
-e, --engine     # JS engine name (comma-separated for multiple), default: node
                 # Note: Make sure engine is installed and available in PATH.
-r, --runs       # Number of runs, default: 100
-t, --timeout    # Timeout per run in milliseconds, default: 5000
-p, --precision  # Decimal places for time output, default: 5
-v, --verbose    # Show detailed information for each run

# Flags can be specified as --flag=value
# After double dash -- all arguments are treated as positional
```

## Writing Test Files

### Basic Structure

Each test file must follow this structure:

```javascript
// Import the API:
import { bench } from 'benes/utils'

function functionToTest(data) {
  return result
}

var data = []
for (let i = 0; i < 10000; i++) {
  data.push({ ID: i, name: `Item ${i}` })
}

bench.start() // Call before the code to measure
var result = functionToTest(data)
bench.end() // Call after the code to measure
```

### The `bench` API

The `bench` utility provides a simple API for measuring execution time:

- **`bench.start()`** - Starts the timer
- **`bench.end()`** - Stops the timer and outputs the elapsed time in milliseconds

This API handles timing and output format. It uses `performance.now()` when available and falls back to `Date.now()` when it is not.

### Sample Test File

```javascript
import { bench } from 'benes/utils'

function countByFilter(arr, ids) {
  return arr.filter((el) => ids.includes(el.ID)).length
}

var arr = []
var ids = []

for (let i = 0; i <= 1000; i++) {
  arr.push({ ID: i })
  if (i % 3 === 0) {
    ids.push(i)
  }
}

bench.start()
var count = countByFilter(arr, ids)
bench.end()
```

### Using Utility Functions

The project provides utility functions for generating test data and benchmarking.

**Note:** The `bench` API and utility functions are only available as ES modules. Make sure your test files use `.mjs` extension or have `"type": "module"` in package.json.

```javascript
import { bench, makeRandomIntArray, makeRandomStrArray } from 'benes/utils'

// Generate array of 10000 random integers between 0-1000
var numbers = makeRandomIntArray(10000, 0, 1000)

// Generate array of 10000 random strings
var strings = makeRandomStrArray(10000)

// Run benchmark
bench.start()
var result = yourFunction(numbers)
bench.end()
```

For warmup runs inside a single process, use `bench.run`:

```javascript
bench.run(() => yourFunction(numbers), { warmup: 5, runs: 20 })
```

Available utilities:

- **`bench.start()`** - Start benchmark timer
- **`bench.end()`** - End benchmark timer and output result
- **`bench.run(fn, { warmup, runs })`** - Warmup and measure average time in one process
- **`getRandomInt(min, max)`** - Random integer in range [min, max)
- **`getRandomStr()`** - Random string
- **`makeRandomIntArray(length, min, max)`** - Array of random integers
- **`makeRandomStrArray(length)`** - Array of random strings

**Note:** ES module imports work with all modern JS engines. The benchmark system automatically adds the `--module` flag when needed.

### CommonJS Support

If you need to use CommonJS format, you can output the benchmark result manually following the `__BENCH__:` format:

```javascript
// test.cjs or test.js (without "type": "module")
function countByFilter(arr, ids) {
  return arr.filter((el) => ids.includes(el.ID)).length
}

var arr = []
var ids = []

for (let i = 0; i <= 1000; i++) {
  arr.push({ ID: i })
  if (i % 3 === 0) {
    ids.push(i)
  }
}

var start = Date.now() // or performance.now()
var count = countByFilter(arr, ids)
var elapsed = Date.now() - start

// Output in the expected format
console.log('__BENCH__:' + elapsed)
```

The benchmark runner will extract the timing from the `__BENCH__:` prefix automatically.

### Debugging Tests

The benchmark system uses the `__BENCH__:` prefix for timing output, so `console.log()` for debugging is safe:

```javascript
import { bench } from 'benes/utils'

function countByFilter(arr, ids) {
  return arr.filter((el) => ids.includes(el.ID)).length
}

var arr = []
var ids = []

for (let i = 0; i <= 1000; i++) {
  arr.push({ ID: i })
  if (i % 3 === 0) {
    ids.push(i)
  }
}

// Debug logs are perfectly fine!
console.log('Array size:', arr.length)
console.log('Filtering for', ids.length, 'IDs')

bench.start()
var count = countByFilter(arr, ids)
bench.end()

console.log('Result:', count) // This won't break anything
```

When you run the test directly with an engine, you'll see all debug output:

```bash
v8 --module path/to/your/test.mjs
```

Output:

```
Array size: 1001
Filtering for 334 IDs
__BENCH__:0.181
Result: 334
```

### Common CLI Usage

```bash
# Run with V8 engine and detailed output
npx benes ./your-benchmarks -e v8 -r 10 -p 5 -v

# Run with Node.js (doesn't require JSVU)
npx benes ./your-benchmarks -e node -r 10 -p 5

# Brief output (default)
npx benes ./your-benchmarks -e node -r 100

# Compare multiple engines
npx benes ./your-benchmarks -e v8,node,spidermonkey -r 100

# Show help
npx benes -h
```

### Output Format

Example command and console output:

```bash
npx benes ./your-benchmarks -r 100
```

```
======================= Engine: NODE =======================
byFilter: 100% (100/100)
┌───────────┬─────────┬─────────┬───────────┬─────────────┬──────────┐
│  (index)  │ Average │ Median  │ Delta avg │ Delta median│ X slower │
├───────────┼─────────┼─────────┼───────────┼─────────────┼──────────┤
│  byLoop   │ 0.12045 │ 0.12045 │ 0.00000   │ 0.00000     │   1.00   │
│ byFilter  │ 0.15082 │ 0.15082 │ 0.03037   │ 0.03037     │   1.25   │
└───────────┴─────────┴─────────┴───────────┴─────────────┴──────────┘
```

**Columns:**

- **Average**: Mean execution time in milliseconds
- **Median**: Median execution time in milliseconds
- **Delta avg**: Difference from the fastest average result
- **Delta median**: Difference from the fastest median result
- **X slower**: Performance multiplier relative to fastest (1.00 = fastest)

Results are sorted by execution time (fastest first).

### Multi-Engine Comparison

When testing with multiple engines, results are shown separately for each:

```bash
npx benes ./your-benchmarks -e v8,node,spidermonkey -r 100 -p 3
```

```
======================== Engine: V8 ========================
byFilter: 100% (100/100)
byLoop: 100% (100/100)
┌──────────┬─────────┬────────┬───────────┬─────────────┬──────────┐
│ (index)  │ Average │ Median │ Delta avg │ Delta median│ X slower │
├──────────┼─────────┼────────┼───────────┼─────────────┼──────────┤
│ byLoop   │ 0.088   │ 0.088  │ 0         │ 0           │ 1        │
│ byFilter │ 0.147   │ 0.147  │ 0.059     │ 0.059       │ 1.67     │
└──────────┴─────────┴────────┴───────────┴─────────────┴──────────┘

======================= Engine: NODE =======================
byFilter: 100% (100/100)
byLoop: 100% (100/100)
┌──────────┬─────────┬────────┬───────────┬─────────────┬──────────┐
│ (index)  │ Average │ Median │ Delta avg │ Delta median│ X slower │
├──────────┼─────────┼────────┼───────────┼─────────────┼──────────┤
│ byFilter │ 0.12    │ 0.12   │ 0         │ 0           │ 1        │
│ byLoop   │ 0.141   │ 0.141  │ 0.021     │ 0.021       │ 1.17     │
└──────────┴─────────┴────────┴───────────┴─────────────┴──────────┘

=================== Engine: SPIDERMONKEY ===================
byFilter: 100% (100/100)
byLoop: 100% (100/100)
┌──────────┬─────────┬────────┬───────────┬─────────────┬──────────┐
│ (index)  │ Average │ Median │ Delta avg │ Delta median│ X slower │
├──────────┼─────────┼────────┼───────────┼─────────────┼──────────┤
│ byFilter │ 0.202   │ 0.202  │ 0         │ 0           │ 1        │
│ byLoop   │ 0.266   │ 0.266  │ 0.064     │ 0.064       │ 1.32     │
└──────────┴─────────┴────────┴───────────┴─────────────┴──────────┘
```

This allows easy comparison across engines. The CLI also prints per-test tables and a final summary table with X slower values per engine:

```
Test: byLoop
┌──────────┬─────────┬────────┬───────────┬─────────────┬──────────┐
│ (index)  │ Average │ Median │ Delta avg │ Delta median│ X slower │
├──────────┼─────────┼────────┼───────────┼─────────────┼──────────┤
│ V8       │ 0.088   │ 0.088  │ 0         │ 0           │ 1        │
│ NODE     │ 0.141   │ 0.141  │ 0.053     │ 0.053       │ 1.6      │
└──────────┴─────────┴────────┴───────────┴─────────────┴──────────┘

Test: byFilter
┌──────────┬─────────┬────────┬───────────┬─────────────┬──────────┐
│ (index)  │ Average │ Median │ Delta avg │ Delta median│ X slower │
├──────────┼─────────┼────────┼───────────┼─────────────┼──────────┤
│ NODE     │ 0.120   │ 0.120  │ 0         │ 0           │ 1        │
│ V8       │ 0.147   │ 0.147  │ 0.027     │ 0.027       │ 1.23     │
└──────────┴─────────┴────────┴───────────┴─────────────┴──────────┘

Cross-engine summary (median and X slower):
┌──────────┬────────────┬────────────┐
│ (index)  │ V8         │ NODE       │
├──────────┼────────────┼────────────┤
│ byLoop   │ 0.088 (1.0)│ 0.141 (1.6)│
│ byFilter │ 0.147 (1.2)│ 0.120 (1.0)│
└──────────┴────────────┴────────────┘
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.
