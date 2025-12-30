/**
 * Получение случайного целого числа
 * @param {Number} min - минимальное значение для случайного целого
 * @param {Number} max - максимальное значение для случайного целого
 * @returns {Number}
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
