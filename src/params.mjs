/**
 * Description of supported command line flags.
 * @typedef arg
 * @property {string[]} aliases - Flag notation variants recognized in CLI
 * @property {string} type - "boolean" | "string" | "number"
 * @property {boolean|string|number} default - Default value
 * @property {string} description - Description shown in --help
 * @property {function} validate - Validation function
 */
export const FLAGS = Object.freeze({
  help: {
    aliases: ['-h', '--help'],
    type: 'boolean',
    default: false,
    description: 'Show this message'
  },
  version: {
    aliases: ['-V', '--version'],
    type: 'boolean',
    default: false,
    description: 'Show version number'
  },
  engine: {
    aliases: ['-e', '--engine'],
    type: 'string',
    default: 'node',
    multiple: true,
    separator: ',',
    description: 'Name of JS Engine(s) to use (comma-separated for multiple)',
    options: ['node', 'bun', 'v8', 'spidermonkey', 'javascriptcore', 'graaljs', 'quickjs', 'hermes', 'xs'],
    validate: function (e) {
      return this.options.includes(e)
    }
  },
  runs: {
    aliases: ['-r', '--runs'],
    type: 'number',
    default: 100,
    description: 'Amount of runs for each file',
    validate: (n) => n && !isNaN(Number(n)) && Number(n) >= 1
  },
  timeout: {
    aliases: ['-t', '--timeout'],
    type: 'number',
    default: 5_000,
    description: 'Timeout for a single run in milliseconds',
    validate: (n) => n && !isNaN(Number(n)) && Number(n) >= 1
  },
  precision: {
    aliases: ['-p', '--precision'],
    type: 'number',
    default: 5,
    description: 'Time precision in decimal places',
    validate: (n) => n && !isNaN(Number(n)) && Number(n) >= 1
  },
  verbose: {
    aliases: ['-v', '--verbose'],
    type: 'boolean',
    default: false,
    description: 'Show detailed output with time for each run'
  }
})
