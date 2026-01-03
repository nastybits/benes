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
const nowMs = () => {
  if (globalThis.performance && typeof globalThis.performance.now === 'function') {
    return globalThis.performance.now()
  }
  return Date.now()
}

for (let i = 0; i <= 1000; i++) {
  arr.push({ ID: i })
  if (i % 3 === 0) {
    ids.push(i)
  }
}

var start = nowMs()
var count = countByFilter(arr, ids)
var elapsed = nowMs() - start
console.log('__BENCH__:' + elapsed)
