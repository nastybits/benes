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
})
