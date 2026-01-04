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

function makeArr() {
  var arr = []
  for (let i = 0; i <= 10000; i++) {
    arr.push({ ID: i })
  }
  return arr
}

bench.run(() => getElementByFilter(makeArr(), 5), { warmup: 5, runs: 20 })
