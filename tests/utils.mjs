/**
 * Получение случайного целого числа
 * @param {Number} min - минимальное значение для случайного целого
 * @param {Number} max - максимальное значение для случайного целого
 * @returns {Number}
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * Получение случайной строки
 * @returns {String}
 */
export function getRandomStr() {
  const str = "ABCDFGHIJKLMNOPQRSTUVWXYZabcdfghijklmnopqrstuvwxyz0123456789!@#;$%^:&?*()-_+={}[]|,.<>/АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзиклмнопрстуфхцчшщъыьэюя"

  const maxIdx = str.length - 1
  const firstIdx = getRandomInt(0, maxIdx)
  const len = getRandomInt(0, maxIdx - firstIdx)

  return str.substring(firstIdx, len)
}

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

/**
 * Получение массива случайных строк
 * @param {Number} len - количество элементов
 * @returns {[Strtng]}
 */
export function makeRandomStrArray(len = 10_000) {
  const arr = []
  
  for (let i = 0; i < len; i++) {
    arr.push(getRandomStr())
  }

  return arr
}