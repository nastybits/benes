/**
 * Функция для вывода прогресса выполнения тестов.
 * @param {number} current - Текущий номер прогона
 * @param {number} total - Общее количество прогонов
 * @param {string} label - Подпись
 */
export function printProgress(curr, total, label) {
  const pct = ((curr / total) * 100).toFixed(0).padStart(3)
  process.stdout.write(`\r${label}: Runs ${curr}/${total} ${pct}%`)
}