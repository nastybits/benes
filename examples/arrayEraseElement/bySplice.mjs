import { bench } from '../../src/utils/index.mjs'

/**
 * Remove element from array arr by id.
 * Uses findIndex + splice method.
 * @param {[{ID: number}]} arr
 * @param {number} id
 * @returns {Array}
 */
function getElementBySplice(arr, id) {
  arr.splice(
    arr.findIndex((el) => el.ID === id),
    1
  )
  return arr
}

function makeArr() {
  var arr = []
  for (let i = 0; i <= 10000; i++) {
    arr.push({ ID: i })
  }
  return arr
}

bench.run(() => getElementBySplice(makeArr(), 5), { warmup: 5, runs: 20 })
