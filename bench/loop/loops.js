/**
 * Сравнение получения количества вхождений по массиву:
 * 1. getCountByFilter - с испоользованием встроенной функции filter() + length.
 * 2. getCountByLoop - с использованием цикла for.
 */

/**
 * Получения кол-ва вхождений в массиве arr по массиву ids.
 * Используется метод filter + lenght.
 * @param {[{ID: number}]} arr
 * @param {[number]} ids
 * @returns {number}
 */
function getCountByFilter(arr, ids) {
  return arr.filter(el => ids.includes(el.ID)).length
}

/**
 * Получения кол-ва вхождений в массиве arr по массиву ids.
 * Используется цикл for с условием.
 * @param {[{ID: number}]} arr
 * @param {[number]} ids
 * @returns {number}
 */
function getCountByLoop(arr, ids) {
  let idx = 0

  for (const el of arr) {
    if (ids.includes(el.ID)) {
      idx++
    }
  }

  return idx
}

const arr = []
const ids = []

for (let i = 0; i <= 10000; i++) {
  arr.push({ ID: i })
  if (i % 3 === 0) {
    ids.push(i)
  }
}

const start = performance.now()
const count = getCountByLoop(arr, ids)

console.log(performance.now() - start)