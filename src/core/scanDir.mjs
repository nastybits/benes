import { readdir, stat } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'

/**
 * Gets files in directory or returns single file
 * @param {string} path - Path to directory or file
 * @param {string} ext - File extension
 * @returns {Promise<{ dir: string, name: string, path: string, label: string }[]>}
 */
export async function scanDir(path, ext = '.js') {
  try {
    const stats = await stat(path)

    // If it's a file, return it as a single-item array
    if (stats.isFile()) {
      const name = basename(path)
      const dir = dirname(path)
      return [
        {
          dir,
          name,
          path,
          label: basename(name, extname(name))
        }
      ]
    }

    // If it's a directory, scan it
    const entries = await readdir(path, { withFileTypes: true })
    return entries
      .filter((file) => file.isFile() && extname(file.name) === ext)
      .map((file) => ({
        dir: path,
        name: file.name,
        path: join(path, file.name),
        label: basename(file.name, ext)
      }))
  } catch (error) {
    throw new Error(`Cannot read "${path}": ${error.message}`)
  }
}
