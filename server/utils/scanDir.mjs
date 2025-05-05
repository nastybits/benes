import { readdir } from "fs/promises"
import { join, extname, basename } from "path"

/**
 * Получает файлы в дирректории
 * @param {string} dir - Путь к дирректирии
 * @returns {[{ dir: string, name: string, path: string, label: string }]}
 */
export async function scanDir(dir) {
  let files
  try {
    files = await readdir(dir, { withFileTypes: true })
    files = files
      .filter(file => file.isFile() && extname(file.name) === ".js")
      .map(file => ({
        dir,
        name: file.name,
        path: join(dir, file.name),
        label: basename(file.name, ".js")
      }))
  } catch (error) {
    console.error(`Cannot read directory "${dir}": ${error.message}`)
    process.exit(1)
  }

  return files
}