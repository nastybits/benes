import { describe, it, expect, vi, afterEach } from 'vitest'
import { getRandomInt } from '../getRandomInt.mjs'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getRandomInt', () => {
  it('returns values within the [min, max) range', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(getRandomInt(5, 10)).toBe(5)

    randomSpy.mockReturnValue(0.999999)
    expect(getRandomInt(5, 10)).toBe(9)
  })
})
