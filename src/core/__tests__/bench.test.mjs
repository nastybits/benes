import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventEmitter } from 'events'
import { benchFile, benchFiles } from '../bench.mjs'

const spawnMock = vi.fn()
const printProgressMock = vi.fn()

vi.mock('child_process', () => ({
  spawn: (...args) => spawnMock(...args)
}))

vi.mock('../print.mjs', () => ({
  printProgress: (...args) => printProgressMock(...args)
}))

function makeChild({ stdout = '', stderr = '', code = 0, error = null }) {
  const child = new EventEmitter()
  child.stdout = new EventEmitter()
  child.stderr = new EventEmitter()

  setTimeout(() => {
    if (stdout) {
      child.stdout.emit('data', stdout)
    }
    if (stderr) {
      child.stderr.emit('data', stderr)
    }
    if (error) {
      child.emit('error', error)
      return
    }
    child.emit('close', code)
  }, 0)

  return child
}

beforeEach(() => {
  spawnMock.mockReset()
  printProgressMock.mockReset()
})

describe('benchFile', () => {
  it('collects run times and reports progress', async () => {
    const file = { path: '/tmp/test.js', label: 'test' }
    spawnMock
      .mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:1\n' }))
      .mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:2\n' }))

    const times = await benchFile(file, 'node', 2)

    expect(times).toEqual([1, 2])
    expect(printProgressMock).toHaveBeenCalledTimes(2)
    expect(printProgressMock).toHaveBeenNthCalledWith(1, 1, 2, 'test')
    expect(printProgressMock).toHaveBeenNthCalledWith(2, 2, 2, 'test')
  })

  it('rejects when benchmark output is missing', async () => {
    const file = { path: '/tmp/test.js', label: 'test' }
    spawnMock.mockImplementationOnce(() => makeChild({ stdout: 'hello\n' }))

    await expect(benchFile(file, 'node', 1)).rejects.toThrow('Cannot find benchmark output')
  })

  it('rejects when benchmark output is not a number', async () => {
    const file = { path: '/tmp/test.js', label: 'test' }
    spawnMock.mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:abc\n' }))

    await expect(benchFile(file, 'node', 1)).rejects.toThrow('Cannot parse time from benchmark output')
  })

  it('rejects on non-zero exit code and includes stderr', async () => {
    const file = { path: '/tmp/test.js', label: 'test' }
    spawnMock.mockImplementationOnce(() => makeChild({ stderr: 'boom', code: 1 }))

    await expect(benchFile(file, 'node', 1)).rejects.toThrow('node exited with code 1\nboom')
  })

  it('uses default timeout when spawning', async () => {
    const file = { path: '/tmp/test.js', label: 'test' }
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout')
    spawnMock.mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:1\n' }))

    await benchFile(file, 'node', 1)

    expect(timeoutSpy).toHaveBeenCalledWith(5_000)
    timeoutSpy.mockRestore()
  })

  it('passes custom timeout to run', async () => {
    const file = { path: '/tmp/test.js', label: 'test' }
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout')
    spawnMock.mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:1\n' }))

    await benchFile(file, 'node', 1, 1_234)

    expect(timeoutSpy).toHaveBeenCalledWith(1_234)
    timeoutSpy.mockRestore()
  })
})

describe('benchFiles', () => {
  it('returns averages for each file', async () => {
    const files = [
      { path: '/tmp/a.js', label: 'a' },
      { path: '/tmp/b.js', label: 'b' }
    ]

    spawnMock
      .mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:1\n' }))
      .mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:3\n' }))
      .mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:2\n' }))
      .mockImplementationOnce(() => makeChild({ stdout: '__BENCH__:4\n' }))

    const results = await benchFiles(files, 'node', 2)

    expect(results).toEqual([
      { path: '/tmp/a.js', label: 'a', times: [1, 3], avg: 2 },
      { path: '/tmp/b.js', label: 'b', times: [2, 4], avg: 3 }
    ])
  })

  it('wraps errors with file label', async () => {
    const files = [{ path: '/tmp/a.js', label: 'a' }]
    spawnMock.mockImplementationOnce(() => makeChild({ stdout: 'nope\n' }))

    await expect(benchFiles(files, 'node', 1)).rejects.toThrow('a: Cannot find benchmark output')
  })
})
