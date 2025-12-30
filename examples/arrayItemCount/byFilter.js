import { bench } from '../../src/utils/index.mjs'

/**
 * Count occurrences in array arr by array of ids.
 * Uses filter + length method.
 * @param {[{ID: number}]} arr
 * @param {[number]} ids
 * @returns {number}
 */
function countByFilter(arr, ids) {
  return arr.filter((el) => ids.includes(el.ID)).length
}

var arr = []
var ids = []

for (let i = 0; i <= 1000; i++) {
  arr.push({ ID: i })
  if (i % 3 === 0) {
    ids.push(i)
  }
}

bench.start()
var count = countByFilter(arr, ids)
bench.end()
