/**
 * Получения количества вхождений в массив arr по массиву ids.
 * Используется цикл for с условием.
 * @param {[{ID: number}]} arr
 * @param {[number]} ids
 * @returns {number}
 */
function countByLoop(arr, ids) {
  let idx = 0

  for (const el of arr) {
    if (ids.includes(el.ID)) {
      idx++
    }
  }

  return idx
}

var arr = []
var ids = []

for (let i = 0; i <= 1000; i++) {
  arr.push({ ID: i })
  if (i % 3 === 0) {
    ids.push(i)
  }
}

var start = performance.now()
var count = countByLoop(arr, ids)

console.log(performance.now() - start)