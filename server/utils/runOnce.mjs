import { spawn } from "child_process"

/**
 * Запуск одного прогона теста с использованием V8.
 * @param {string} file - Путь к файлу для исполнения
 * @returns {Promise<number>} Время выполнения в миллисекундах
 */
export function runOnce(file) {
  return new Promise((resolve, reject) => {
    const child = spawn("v8", [file], { stdio: ["ignore", "pipe", "inherit"] })
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