/**
 * Сравнение получения кол-ва вхождений по массиву:
 * 1. getCountByFilter - с испоользованием встроенной функции filter() + length
 * 2. getCountByLoop - с использованием цикла for
 */

/**
 * @param {*} arr
 * @param {*} ids
 * @returns 
 */
function getCountByFilter(arr, ids) {
  return arr.filter(el => ids.includes(el.ID)).length
}

/**
 * 
 * @param {*} arr
 * @param {*} ids
 * @returns 
 */
function getCountByLoop(arr, ids) {
  var idx = 0

  for (var el of arr) {
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
const count = getCountByFilter(arr, ids)

console.log(performance.now() - start)