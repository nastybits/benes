import { bench } from '../../src/utils/index.mjs'

/**
 * Remove element from array arr by id.
 * Uses filter method.
 * @param {[{ID: number}]} arr
 * @param {number} id
 * @returns {Array}
 */
function getElementByFilter(arr, id) {
  return arr.filter((el) => el.ID !== id)
}

var arr = []

for (let i = 0; i <= 10000; i++) {
  arr.push({ ID: i })
}

bench.start()
var r = getElementByFilter(arr, 5)
bench.end()
