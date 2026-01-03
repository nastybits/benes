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

var arr = []

for (let i = 0; i <= 10000; i++) {
  arr.push({ ID: i })
}

bench.start()
var r = getElementBySplice(arr, 5)
bench.end()
