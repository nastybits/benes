import { describe, it, expect, vi, beforeEach } from 'vitest'

const getRandomIntMock = vi.fn()

vi.mock('../getRandomInt.mjs', () => ({
  getRandomInt: getRandomIntMock
}))

const { makeRandomIntArray } = await import('../makeRandomIntArray.mjs')

beforeEach(() => {
  getRandomIntMock.mockReset()
})

describe('makeRandomIntArray', () => {
  it('returns array of requested length and uses provided bounds', () => {
    let counter = 0
    getRandomIntMock.mockImplementation(() => {
      counter += 1
      return counter
    })

    const result = makeRandomIntArray(3, 10, 20)

    expect(result).toEqual([1, 2, 3])
    expect(getRandomIntMock).toHaveBeenCalledTimes(3)
    getRandomIntMock.mock.calls.forEach((call) => {
      expect(call).toEqual([10, 20])
    })
  })
})
