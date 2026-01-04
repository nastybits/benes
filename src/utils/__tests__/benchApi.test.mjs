import { describe, it, expect, vi, afterEach } from 'vitest'
import { bench } from '../benchApi.mjs'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('bench', () => {
  it('logs elapsed time with __BENCH__ prefix', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const nowSpy = vi.spyOn(performance, 'now').mockReturnValueOnce(100).mockReturnValueOnce(150)

    bench.start()
    bench.end()

    expect(nowSpy).toHaveBeenCalledTimes(2)
    expect(logSpy).toHaveBeenCalledWith('__BENCH__:50')
  })

  it('falls back to Date.now when performance.now is not available', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const originalPerformance = globalThis.performance

    // Temporarily remove performance.now
    globalThis.performance = undefined

    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1050)

    bench.start()
    bench.end()

    expect(dateNowSpy).toHaveBeenCalledTimes(2)
    expect(logSpy).toHaveBeenCalledWith('__BENCH__:50')

    // Restore
    globalThis.performance = originalPerformance
  })

  it('bench.run logs average time and respects warmup', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const fnSpy = vi.fn(() => 1)
    const nowSpy = vi
      .spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(16)
      .mockReturnValueOnce(20)
      .mockReturnValueOnce(29)

    bench.run(fnSpy, { warmup: 2, runs: 3 })

    const avg = (5 + 6 + 9) / 3
    expect(fnSpy).toHaveBeenCalledTimes(5)
    expect(nowSpy).toHaveBeenCalledTimes(6)
    expect(logSpy).toHaveBeenCalledWith(`__BENCH__:${avg}`)
  })

  it('bench.run throws on async functions', () => {
    const fn = () => Promise.resolve()
    expect(() => bench.run(fn)).toThrow('bench.run does not support async functions')
  })
})
