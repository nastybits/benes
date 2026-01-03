import { bench } from '../../src/utils/index.mjs'

/**
 * Test using 'let' and 'const' for variable declarations.
 * This test uses patterns where let/const block-scoped behavior prevents optimization.
 */

function performOperationsWithLetConst() {
  let result = 0
  const captured = []

  // 1. Loop with let - each iteration gets new binding
  for (let i = 0; i < 1000; i++) {
    const temp = i * 2
    result += temp
  }

  // 2. Closures with let - each closure captures different 'j'
  for (let j = 0; j < 100; j++) {
    captured.push(function () {
      return j
    })
  }

  // 3. No redeclaration with let/const
  for (let k = 0; k < 500; k++) {
    let sum = 0
    sum = k // assignment, not redeclaration
    result += sum
  }

  // 4. No hoisting with let
  function noHoisting() {
    const x = 10 // must be declared before use
    return x
  }

  // 5. Block scope applies
  let blockVar = 0
  if (true) {
    const blockVar = 100 // different variable
    result += blockVar
  }
  // outer blockVar is still 0

  // 6. Multiple loops with separate let bindings
  for (let m = 0; m < 200; m++) {
    result += m
  }
  for (let m = 0; m < 200; m++) {
    // new 'm' variable
    result += m
  }

  result += noHoisting()
  result += captured.length

  return result
}

bench.start()
const finalResult = performOperationsWithLetConst()
bench.end()
