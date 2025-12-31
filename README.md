[![npm version](https://badge.fury.io/js/benes.svg)](https://www.npmjs.com/package/benes)
[![Node.js Version](https://img.shields.io/node/v/benes.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

# benes

Cross-engine benchmark runner for comparing JavaScript implementations

## Description

A small CLI to benchmark JavaScript implementations across multiple engines using the same test files. It runs each file repeatedly, extracts a `__BENCH__:` timing line, and prints a comparison table. Requires [Node.js](https://nodejs.org/en) v18+.

By default, tests run on Node.js. For multi-engine runs (V8, SpiderMonkey, JavaScriptCore, etc.), install engines via [JSVU](https://github.com/GoogleChromeLabs/jsvu).

## Advantages

- **Multi-engine by default**: run the same test files across Node, V8, SpiderMonkey, JavaScriptCore, and more (via JSVU).
- **Engine-agnostic protocol**: a single `__BENCH__:` line is enough, no engine-specific APIs.
- **Simple CLI workflow**: drop files into a folder, run one command, get a clear comparison table.
- **Minimal surface area**: no dependency on large benchmarking frameworks; works with plain ECMAScript files.

Tests run on a "clean" engine, which minimizes the impact of the environment on execution speed.

## Installation

Make sure you have [Node.js](https://nodejs.org/en) v18+ installed

### Recommended: Local Installation (Project Dependency)

**Install locally to use both the CLI and the benchmark API in your tests:**

```bash
npm install --save-dev benes
```

Then run via npm scripts or npx:

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

In your test files, import the API:

```javascript
import { bench, makeRandomIntArray } from 'benes/utils'
```

### Global Installation (CLI Only)

**For CLI-only usage without writing tests in your project:**

```bash
npm install -g benes
```

After installation, use the `benes` command anywhere:

```bash
benes <file|dir> [-h] [-V] [-e S] [-r N] [-t N] [-p N] [-v]
```

**Note:** Global installation provides the CLI command but **does not allow importing the benchmark API** in your code. For writing tests that use `bench.start()`, `bench.end()`, and utility functions, you must install benes locally as a dev dependency.

### Optional: Other JavaScript Engines

If you want to compare performance across different engines (V8, SpiderMonkey, JavaScriptCore, etc.),
install [JSVU](https://github.com/GoogleChromeLabs/jsvu):

### Parameters

```bash
dir              # Directory with test files (required positional argument)
-h, --help       # Show help message
-e, --engine     # JS engine name (comma-separated for multiple), default: node
                 # Options: node | v8 | spidermonkey | javascriptcore | graaljs | quickjs | hermes | xs
                 # Note: Engines other than 'node' require JSVU installation
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
// Import from 'benes/utils' if installed locally
import { bench } from 'benes/utils'

// 1. Define the function to test
function functionToTest(data) {
  // Your implementation
  return result
}

// 2. Prepare test data
var data = []
for (let i = 0; i < 10000; i++) {
  data.push({ ID: i, name: `Item ${i}` })
}

// 3. Run the benchmark
bench.start()
var result = functionToTest(data)
bench.end()
```

### The `bench` API

The `bench` utility provides a simple API for measuring execution time:

- **`bench.start()`** - Starts the timer
- **`bench.end()`** - Stops the timer and outputs the elapsed time in milliseconds

This API handles all timing logic internally and ensures correct output format. It uses `performance.now()` when available and falls back to `Date.now()` when it is not.

**Important:** To use the `bench` API, you must install `benes` locally in your project:

```bash
npm install --save-dev benes
```

### Important Rules

✅ **DO:**

- Import `bench` from `'benes/utils'` (requires local installation)
- Call `bench.start()` before the code to measure
- Call `bench.end()` after the code to measure
- Keep test logic simple and focused
- Use `console.log()` freely for debugging - it won't interfere with benchmark results

❌ **DON'T:**

- Call `bench.start()` multiple times without `bench.end()`
- Modify global state that affects subsequent runs

### Example Test File

```javascript
// /tests/arrayItemCount/byFilter.js
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

**Important:** Install `benes` locally to use these utilities:

```bash
npm install --save-dev benes
```

Then in your test files:

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

Available utilities:

- **`bench.start()`** - Start benchmark timer
- **`bench.end()`** - End benchmark timer and output result
- **`getRandomInt(min, max)`** - Random integer in range [min, max)
- **`getRandomStr()`** - Random string (mixed characters)
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

The benchmark system uses a special `__BENCH__:` prefix to identify timing output, which means **you can freely use `console.log()` for debugging** without interfering with results:

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
v8 --module tests/arrayItemCount/byFilter.js
```

Output:

```
Array size: 1001
Filtering for 334 IDs
__BENCH__:0.181
Result: 334
```

### Examples

```bash
# Run with V8 engine and detailed output
benes ./tests/arrayItemCount -e v8 -r 10 -p 5 -v

# Run with Node.js (doesn't require JSVU)
benes ./tests/arrayItemCount -e node -r 10 -p 5

# Brief output (default)
benes ./tests/arrayItemCount -e node -r 100

# Compare multiple engines
benes ./tests/arrayItemCount -e v8,node,spidermonkey -r 100

# Show help
benes -h

# Direct usage (without npm)
node src/index.mjs ./tests/arrayItemCount -e v8,node -r 100
```

### Output Format

Example command and console output:

```bash
benes ./tests/arrayItemCount -r 100
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
npm run bench -- ./tests/arrayItemCount -e v8,node,spidermonkey -r 100 -p 3
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

This allows easy comparison of how different implementations perform across various JavaScript engines.

The CLI also prints per-test tables (rows: engines, columns: metrics) and a final summary table with X slower values per engine:

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

## Advanced: V8 Bytecode Analysis

If you have V8 installed, you can inspect bytecode for any file or function:

```bash
# Print bytecode of a file to console
v8 --print-bytecode <file>
```

### Filters

```bash
# Print bytecode with filtering
v8 --print-bytecode <file> --print-bytecode-filter=[param]
```

Filter parameters:

- `*` - Print bytecode for everything
- `""` - Print bytecode only for global scope code
- `-` - Print bytecode only for non-global scope code
- `doSomething` - Print bytecode only for function "doSomething"

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.
