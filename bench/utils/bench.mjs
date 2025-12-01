import { spawn } from "child_process"
import { printProgress } from "./index.js"

/**
 * Запуск одного прогона теста с использованием V8.
 * @param {string} file - Путь к файлу для исполнения
 * @returns {Promise<number>} Время выполнения в миллисекундах
 */
function runOnce(file, engine) {
  return new Promise((resolve, reject) => {
    const child = spawn(engine, [file], { stdio: ["ignore", "pipe", "inherit"], shell: true })
    let output = ""
    child.stdout.on("data", c => (output += c))
    child.on("error", reject)
    child.on("close", code => {
      if (code !== 0) {
        return reject(new Error(`v8 exited with code ${code}`))
      }

      const time = parseFloat(output.trim())
      if (isNaN(time)) {
        return reject(new Error(`Cannot parse time from:\n${output}`))
      }

      resolve(time)
    })
  })
}

/**
 * Запуск файла для прогона
 * @param {Object} file - файл для запуска
 * @param {number} runs - количество запусков
 * @returns {Promise<number[]>} - Массив со временем выполнения каждого прогона
 */
export async function benchFile(file, engine = "v8", runs = 10) {
  const times = []

  for (let i = 1; i <= runs; i++) {
    const time = await runOnce(file.path, engine)
    times.push(time)
    printProgress(i, runs, file.label)
  }

  process.stdout.write("\n")
  return times
}

/**
 * Последовательный запуск прогонов файлов
 * @param {[]} files 
 * @param {number} runs 
 * @returns  {Promise<Object[]>}
 */
export async function benchFiles(files, engine = "v8", runs = 10) {
  const results = []

  for (const file of files) {
    try {
      const times = await benchFile(file, engine, runs)
      const avg = times.reduce((s, n) => s + n, 0) / times.length
      results.push({ ...file, times, avg })
    } catch (e) {
      console.error(`${file.label}: ${e.message}`)
      process.exit(1)
    }
  }

  return results
}