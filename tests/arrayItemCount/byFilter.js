/**
 * Получения количества вхождений в массив arr по массиву ids.
 * Используется метод filter + lenght.
 * @param {[{ID: number}]} arr
 * @param {[number]} ids
 * @returns {number}
 */
function countByFilter(arr, ids) {
  return arr.filter(el => ids.includes(el.ID)).length
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
var count = countByFilter(arr, ids)

console.log(performance.now() - start)