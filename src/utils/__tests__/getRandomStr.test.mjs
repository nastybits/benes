import { describe, it, expect, vi, beforeEach } from 'vitest'

const getRandomIntMock = vi.fn()

vi.mock('../getRandomInt.mjs', () => ({
  getRandomInt: getRandomIntMock
}))

const { getRandomStr } = await import('../getRandomStr.mjs')

beforeEach(() => {
  getRandomIntMock.mockReset()
})

describe('getRandomStr', () => {
  it('builds a substring using the generated indices', () => {
    getRandomIntMock.mockReturnValueOnce(0).mockReturnValueOnce(3)
    const result = getRandomStr()

    expect(result).toBe('ABC')
    expect(getRandomIntMock).toHaveBeenCalledTimes(2)
    const firstMax = getRandomIntMock.mock.calls[0][1]
    const secondMax = getRandomIntMock.mock.calls[1][1]
    expect(secondMax).toBe(firstMax + 1)
  })

  it('returns empty string when length is zero', () => {
    getRandomIntMock.mockReturnValueOnce(5).mockReturnValueOnce(0)
    const result = getRandomStr()
    expect(result).toBe('')
  })
})
