import { bench } from '../../src/utils/index.mjs'

/**
 * Test using only 'var' for variable declarations.
 * This test uses patterns where var's function-scoped behavior matters.
 */

function performOperationsWithVar() {
  var result = 0
  var captured = []

  // 1. Loop with var - all iterations share the same variable
  for (var i = 0; i < 1000; i++) {
    var temp = i * 2
    result += temp
  }

  // 2. Closures with var - classic issue
  for (var j = 0; j < 100; j++) {
    captured.push(function () {
      return j
    })
  }

  // 3. Redeclaration is allowed with var
  for (var k = 0; k < 500; k++) {
    var sum = 0
    var sum = k // redeclaration
    result += sum
  }

  // 4. Hoisting - use before declaration
  function useHoisting() {
    x = 10 // works because var hoists
    var x
    return x
  }

  // 5. Block scope doesn't apply
  if (true) {
    var blockVar = 100
  }
  result += blockVar // accessible outside block

  // 6. Multiple loops reusing same var
  for (var m = 0; m < 200; m++) {
    result += m
  }
  for (var m = 0; m < 200; m++) {
    // same 'm' variable
    result += m
  }

  result += useHoisting()
  result += captured.length

  return result
}

bench.start()
var finalResult = performOperationsWithVar()
bench.end()
