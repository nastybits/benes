/**
 * Удаление элемента в массиве arr по id.
 * Используется метод find.
 * @param {[{ID: number}]} arr
 * @param {[number]} ids
 * @returns {number}
 */
function getElementByFilter(arr, id) {
  return arr.filter(el => el.ID !== id)
}

var arr = []
for (let i = 0; i <= 10000; i++) {
  arr.push({ ID: i })
}

var start = performance.now()
var r = getElementByFilter(arr, 5)

console.log(performance.now() - start)