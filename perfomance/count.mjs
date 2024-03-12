/**
 * Получения кол-ва элементов в массиве удовлетворяющих условие
 * Сравниваются методы filter и reduce
 */

import { makeRandomIntArray } from "./utils.mjs"

const arraysCount = 1                       // Количество гененрируемых массивов для подсчета
const elementsCount = 10000                 // Количество элементов в массиве
const filterFunction = (el) => el % 2 === 0 // Функция фильтрации

const arrays = []

for (let i = 0; i < arraysCount; i++) {
  arrays.push(makeRandomIntArray(elementsCount))
}

const start = performance.now()

let count = 0

arrays.forEach(arr => {
  // Использование filter (~ 0.36)
  // count += arr.filter(i => filterFunction(i)).length

  // Использование reduce (~ 0.31)
  // count += arr.reduce((n, i) => filterFunction(i) ? n + 1 : n, 0)

  count = 0
  arr.forEach(el => {
    if (filterFunction(el)) count++
  })
})

console.log(performance.now() - start, "res: " + count)