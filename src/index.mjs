import { scanDir } from './core/scanDir.mjs'
import { benchFiles } from './core/bench.mjs'
import { parseArgs } from './core/parser.mjs'
import { printResults, printHelp, generateUsage, printCrossEngineSummary, printDivider } from './core/print.mjs'
import { FLAGS } from './params.mjs'

const VERSION = '0.0.2'

async function main() {
  try {
    const argv = process.argv.slice(2)
    const { flags, positional } = parseArgs(argv, FLAGS)

    // Handle version flag
    if (flags.version) {
      console.log(VERSION)
      return
    }

    // Handle help flag
    if (flags.help) {
      const usage = generateUsage(FLAGS)
      printHelp(FLAGS, usage)
      return
    }

    if (!positional.length) {
      throw new Error('File or directory is required. Run with --help for usage.')
    }

    // Node treats path starting with "-" as a flag and throws error
    if (positional[0].startsWith('-')) {
      throw new Error('Invalid file or directory path.')
    }

    const files = await scanDir(positional[0])

    if (!files.length) {
      console.log('No files found in the specified directory.')
      return
    }

    // Normalize engine to array
    const engines = Array.isArray(flags.engine) ? flags.engine : [flags.engine]

    const resultsByEngine = []

    // Run benchmarks for each engine
    for (const engine of engines) {
      printDivider(`Engine: ${engine.toUpperCase()}`)
      const results = await benchFiles(files, engine, flags.runs, flags.timeout)
      printResults(results, flags.precision, flags.verbose)
      resultsByEngine.push({ engine, results })
    }

    if (engines.length > 1) {
      printCrossEngineSummary(resultsByEngine, flags.precision)
    }
  } catch (e) {
    console.error('Error:', e.message)
    process.exit(1)
  }
}

main()
