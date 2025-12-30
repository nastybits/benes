import { getRandomInt } from './getRandomInt.mjs'

/**
 * Получение массива случайных целых чисел
 * @param {Number} len - количество элементов
 * @param {Number} min - минимальное значение для случайного целого
 * @param {Number} max - максимальное значение для случайного целого
 * @returns {[Number]}
 */
export function makeRandomIntArray(len = 10_000, min = 0, max = 100) {
  const arr = []

  for (let i = 0; i < len; i++) {
    arr.push(getRandomInt(min, max))
  }

  return arr
}
