/**
 * Module for parsing command line arguments
 */

const FLAG_PREFIX = '-'
const SEPARATOR = '--'
const ARGS_SEPARATOR = ','

/**
 * Checks if a string is a flag (starts with -)
 * @param {string} arg - Argument to check
 * @returns {boolean}
 */
function isFlag(arg) {
  return arg.startsWith(FLAG_PREFIX) && arg !== SEPARATOR
}

/**
 * Finds flag configuration by its name (alias)
 * @param {string} name - Flag name (e.g., '-v' or '--verbose')
 * @param {Object} configs - Configuration of all flags
 * @returns {[string, Object] | undefined} - Tuple [key, config] or undefined if not found
 */
function findFlagConfig(name, configs) {
  return Object.entries(configs).find(([_, config]) => config.aliases.includes(name))
}

/**
 * Handles multiple parameter - splits by separator
 * @param {string} value - Value to process
 * @param {string} [separator=','] - Values separator
 * @returns {string[]} - List of non-empty, trimmed values
 */
function handleMultiple(value, separator = ARGS_SEPARATOR) {
  return value
    .split(separator)
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
}

/**
 * Converts flag value to the required type and validates
 * @param {string} name - Flag name (e.g., '--runs')
 * @param {string} value - Raw value from CLI
 * @param {Object} config - Flag config (from flagsConfig)
 * @returns {string|number|string[]} - Converted value
 * @throws {Error} If value is missing, equals '--' or fails validation
 */
function parseValue(name, value, config) {
  if (value === undefined || value === SEPARATOR || isFlag(value)) {
    throw new Error(`Flag ${name} requires a value`)
  }

  if (config.multiple) {
    value = handleMultiple(value, config.separator)
  }

  if (config.type === 'number') {
    value = Array.isArray(value) ? value.map(Number) : Number(value)
  }

  if (!config.validate) {
    return value
  }

  const valuesToValidate = Array.isArray(value) ? value : [value]

  for (const val of valuesToValidate) {
    if (!config.validate.call(config, val)) {
      const hint = config.options ? `. Valid values: ${config.options.join(', ')}` : ''
      throw new Error(`Invalid value for ${name}: ${val}${hint}`)
    }
  }

  return value
}

/**
 * Extracts flag value from string like --flag=value
 * @param {string} arg - Flag argument
 * @returns {{ name: string, value: string | undefined, key: string, config: Object }} Object with flag name and configuration
 */
function parseArg(arg, flagConfigs) {
  const [name, value] = arg.split('=')
  const flagConfig = findFlagConfig(name, flagConfigs)

  if (!flagConfig) {
    throw new Error(`Unknown flag: ${name}. Run with --help for available options.`)
  }

  const [key, config] = flagConfig

  return { name, value, key, config }
}

/**
 * @typedef {Object} ParsedArgs
 * @property {Object.<string, string|number|boolean|Array>} flags - Parsed flags
 * @property {string[]} positional - Positional arguments
 */

/**
 * Parses command line arguments into flags and positional arguments
 * @param {string[]} args - Array of arguments
 * @param {Object} flagsConfig - Flags configuration (structure from params.mjs)
 * @returns {ParsedArgs}
 * @throws {Error} If flag is unknown or value is missing/invalid
 */
export function parseArgs(args, flagsConfig) {
  const flags = {}

  // Initialize flags with default values
  for (const key in flagsConfig) {
    flags[key] = flagsConfig[key].default
  }

  const positional = []
  const argsLen = args.length
  let afterSeparator = false

  for (let i = 0; i < argsLen; i++) {
    const arg = args[i]

    // After -- all arguments are positional
    if (arg === SEPARATOR) {
      afterSeparator = true
      continue
    }

    if (afterSeparator || !isFlag(arg)) {
      positional.push(arg)
      continue
    }

    const { name, value, key, config } = parseArg(arg, flagsConfig)

    if (config.type === 'boolean') {
      flags[key] = true
      continue
    }

    if (value !== undefined) {
      flags[key] = parseValue(name, value, config)
      continue
    }

    i++
    flags[key] = parseValue(name, args[i], config)
  }

  return {
    flags,
    positional
  }
}
