import { getRandomInt, makeRandomIntArray, makeRandomStrArray } from "./utils.mjs"

const arraysCount = 500 // Количество гененрируемых массивов для подсчета
const arrays = []

for (let i = 0; i < arraysCount; i++) {
  arrays.push(makeRandomIntArray(getRandomInt(1, 100)))
}

const start = performance.now()

let count = 0

/**
 * Получения кол-ва элементов в массиве удовлетворяющих условие
 * Сравниваются методы filter и reduce
 */

arrays.forEach(arr => {
  // Использование filter (~ 0.4 - 0.6 ms)
  // count += arr.filter(i => i > 50).length

  // Использование reduce (~ 0.38 - 0.5 ms)
  // count += arr.reduce((n, i) => i > 50 ? n + 1 : n, 0)
})

console.log(performance.now() - start, "res: " + count)