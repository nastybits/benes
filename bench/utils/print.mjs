/**
 * Показывает сообщение help
 */
export function printHelp(params, description) {
  console.log(`Usage: ${description}`)
  const entries = [
    { aliases: ["dir"], description: "Path to testing dirrectory"},
    ...Object.values(params)
  ]

  // строка вида "-h, --help"
  const flagStrings = entries.map(f => f.aliases.join(", "))
  const maxLen = Math.max(...flagStrings.map(s => s.length)) + 4

  // печатаем, выравнивая по maxLen
  flagStrings.forEach((str, i) => {
    const padded = str.padEnd(maxLen)
    console.log(`${padded} ${entries[i].description}`)
  })
}

/**
 * Вывод прогресса выполнения.
 * @param {number} current - Текущий номер прогона
 * @param {number} total - Общее количество прогонов
 * @param {string} label - Подпись
 */
export function printProgress(curr, total, label) {
  const pct = (curr / total * 100).toFixed(0).padStart(3)
  process.stdout.write(`\r${label}: ${pct}% (${curr}/${total})`)
}

/**
 * Вывод таблицы результатов
 * @param {Array} results 
 * @param {number} precision 
 * @param {boolean} all - выводить результыт каждого прогона
 */
export function printResults(results, precision, all) {
  if (!results.length) {
    console.log("No results")
    process.exit(1)
  }

  results.sort((a, b) => a.avg - b.avg)

  if (all) {
    results.forEach(el => {
      const runs = el.times.length
      el.times.forEach((time, i) => console.log(`${el.label}(${i + 1}/${runs}): ${time.toFixed(precision)}`))
      console.log("------------------------")
    })
  }

  const fastest = results[0].avg

  results = results.reduce((obj, el) => {
    obj[el.label] = {
      Average: +el.avg.toFixed(precision),
      Delta: +(el.avg - fastest).toFixed(precision)
    }
    return obj
  }, {})
  console.table(results)
}