import { describe, it, expect, beforeEach } from 'vitest'
import { parseArgs } from '../parser.mjs'

describe('parseArgs', () => {
  let config

  beforeEach(() => {
    config = {
      verbose: {
        aliases: ['-v', '--verbose'],
        type: 'boolean',
        default: false
      },
      runs: {
        aliases: ['-r', '--runs'],
        type: 'number',
        default: 100,
        validate: (n) => !isNaN(Number(n)) && Number(n) >= 1
      },
      engine: {
        aliases: ['-e', '--engine'],
        type: 'string',
        default: 'v8',
        multiple: true,
        separator: ',',
        options: ['node', 'v8', 'spidermonkey', 'javascriptcore'],
        validate: function (e) {
          return this.options.includes(e)
        }
      }
    }
  })

  it('should return default values when no arguments provided', () => {
    const result = parseArgs([], config)

    expect(result.flags.verbose).toBe(false)
    expect(result.flags.runs).toBe(100)
    expect(result.flags.engine).toBe('v8')
    expect(result.positional).toEqual([])
  })

  it('should parse boolean flag (short form)', () => {
    const result = parseArgs(['-v'], config)

    expect(result.flags.verbose).toBe(true)
  })

  it('should parse boolean flag (long form)', () => {
    const result = parseArgs(['--verbose'], config)

    expect(result.flags.verbose).toBe(true)
  })

  it('should parse flag with value using = (long form)', () => {
    const result = parseArgs(['--runs=50'], config)

    expect(result.flags.runs).toBe(50)
  })

  it('should parse flag with value using = (short form)', () => {
    const result = parseArgs(['-r=50'], config)

    expect(result.flags.runs).toBe(50)
  })

  it('should parse flag with value using space (long form)', () => {
    const result = parseArgs(['--runs', '50'], config)

    expect(result.flags.runs).toBe(50)
  })

  it('should parse flag with value using space (short form)', () => {
    const result = parseArgs(['-r', '50'], config)

    expect(result.flags.runs).toBe(50)
  })

  it('should parse positional arguments', () => {
    const result = parseArgs(['file.js'], config)

    expect(result.positional).toEqual(['file.js'])
  })

  it('should parse multiple positional arguments', () => {
    const result = parseArgs(['file1.js', 'file2.js'], config)

    expect(result.positional).toEqual(['file1.js', 'file2.js'])
  })

  it('should handle -- separator', () => {
    const result = parseArgs(['-v', '--', 'file.js'], config)

    expect(result.flags.verbose).toBe(true)
    expect(result.positional).toEqual(['file.js'])
  })

  it('should not treat -- separator as value when flag expects one', () => {
    expect(() => parseArgs(['--runs', '--', 'file.js'], config)).toThrow('requires a value')
    expect(() => parseArgs(['--runs=--'], config)).toThrow('requires a value')
  })

  it('should treat everything after -- as positional', () => {
    const result = parseArgs(['--', '-v', '--runs', '50'], config)

    expect(result.flags.verbose).toBe(false)
    expect(result.positional).toEqual(['-v', '--runs', '50'])
  })

  it('should parse mixed arguments', () => {
    const result = parseArgs(['-v', '--runs', '50', 'file.js', '--engine=node'], config)

    expect(result.flags.verbose).toBe(true)
    expect(result.flags.runs).toBe(50)
    expect(result.flags.engine).toEqual(['node'])
    expect(result.positional).toEqual(['file.js'])
  })

  it('should throw error for unknown flags', () => {
    expect(() => parseArgs(['--unknown'], config)).toThrow('Unknown flag')
  })

  it('should throw error when flag requires value but none provided', () => {
    expect(() => parseArgs(['--runs'], config)).toThrow('requires a value')
  })

  it('should throw error when flag value is invalid', () => {
    expect(() => parseArgs(['--engine=invalid'], config)).toThrow('Invalid value')
  })

  it('should throw error when flag value fails validation', () => {
    expect(() => parseArgs(['--runs=0'], config)).toThrow('Invalid value')
  })

  it('should parse flag with multiple values (comma-separated)', () => {
    const result = parseArgs(['--engine=v8,node,spidermonkey'], config)

    expect(result.flags.engine).toEqual(['v8', 'node', 'spidermonkey'])
  })

  it('should parse flag with multiple values (with spaces)', () => {
    const result = parseArgs(['--engine=v8, node, spidermonkey'], config)

    expect(result.flags.engine).toEqual(['v8', 'node', 'spidermonkey'])
  })

  it('should parse flag with single value when multiple is enabled', () => {
    const result = parseArgs(['--engine=v8'], config)

    expect(result.flags.engine).toEqual(['v8'])
  })

  it('should validate each value in multiple flag', () => {
    expect(() => parseArgs(['--engine=v8,invalid,node'], config)).toThrow('Invalid value')
  })

  it('should handle flags without validation', () => {
    const configWithoutValidation = {
      name: {
        aliases: ['-n', '--name'],
        type: 'string',
        default: 'default'
        // No validate function
      }
    }

    const result = parseArgs(['--name=test'], configWithoutValidation)
    expect(result.flags.name).toBe('test')
  })

  it('should parse multiple numeric values', () => {
    const configWithMultipleNumbers = {
      ports: {
        aliases: ['-p', '--ports'],
        type: 'number',
        default: 8080,
        multiple: true,
        separator: ','
      }
    }

    const result = parseArgs(['--ports=8080,3000,9000'], configWithMultipleNumbers)
    expect(result.flags.ports).toEqual([8080, 3000, 9000])
  })
})
