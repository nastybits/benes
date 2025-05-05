/**
 * Удаление элемента в массиве arr по id.
 * Используется метод findIndex + splice.
 * @param {[{ID: number}]} arr
 * @param {[number]} ids
 * @returns {number}
 */
function getElementBySplice(arr, id) {
  arr.splice(arr.findIndex(el => el.ID === id), 1)
  return arr
}

var arr = []

for (let i = 0; i <= 10000; i++) {
  arr.push({ ID: i })
}

var start = performance.now()
var r = getElementBySplice(arr, 5)

console.log(performance.now() - start)