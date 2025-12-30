import { getRandomInt } from './getRandomInt.mjs'

/**
 * Получение случайной строки
 * @returns {String}
 */
export function getRandomStr() {
  const str =
    'ABCDFGHIJKLMNOPQRSTUVWXYZabcdfghijklmnopqrstuvwxyz0123456789!@#;$%^:&?*()-_+={}[]|,.<>/АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзиклмнопрстуфхцчшщъыьэюя'

  const maxLen = str.length
  const firstIdx = getRandomInt(0, maxLen)
  const remaining = maxLen - firstIdx
  const len = getRandomInt(0, remaining + 1)

  return str.substring(firstIdx, firstIdx + len)
}
