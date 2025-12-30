import { getRandomStr } from './getRandomStr.mjs'

/**
 * Получение массива случайных строк
 * @param {Number} len - количество элементов
 * @returns {[String]}
 */
export function makeRandomStrArray(len = 10_000) {
  const arr = []

  for (let i = 0; i < len; i++) {
    arr.push(getRandomStr())
  }

  return arr
}
