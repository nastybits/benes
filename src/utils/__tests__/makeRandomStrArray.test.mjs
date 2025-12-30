import { describe, it, expect, vi, beforeEach } from 'vitest'

const getRandomStrMock = vi.fn()

vi.mock('../getRandomStr.mjs', () => ({
  getRandomStr: getRandomStrMock
}))

const { makeRandomStrArray } = await import('../makeRandomStrArray.mjs')

beforeEach(() => {
  getRandomStrMock.mockReset()
})

describe('makeRandomStrArray', () => {
  it('returns array of requested length', () => {
    getRandomStrMock.mockReturnValueOnce('a').mockReturnValueOnce('b').mockReturnValueOnce('c')

    const result = makeRandomStrArray(3)

    expect(result).toEqual(['a', 'b', 'c'])
    expect(getRandomStrMock).toHaveBeenCalledTimes(3)
  })
})
