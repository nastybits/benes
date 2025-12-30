import { bench } from '../../src/utils/index.mjs'

/**
 * Count occurrences in array arr by array of ids.
 * Uses for loop with condition.
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

bench.start()
var count = countByLoop(arr, ids)
bench.end()
