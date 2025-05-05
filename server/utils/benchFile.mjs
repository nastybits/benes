import { runOnce, printProgress } from "./index.js"

/**
 * Запуск файла для прогона
 * @param {Object} file - файл для запуска
 * @param {number} runs - количество запусков
 * @returns {[number]} - Массив со временем выполнения каждого прогона
 */
export async function benchFile(file, runs = 10) {
  const times = []

  for (let i = 1; i <= runs; i++) {
    const time = await runOnce(file.path)
    times.push(time)
    printProgress(i, runs, file.label)
  }

  process.stdout.write("\n")
  return times
}