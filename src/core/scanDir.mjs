import { readdir, stat } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'

/**
 * Gets files in directory or returns single file
 * @param {string} path - Path to directory or file
 * @param {string[]} exts - File extensions
 * @returns {Promise<{ dir: string, name: string, path: string, label: string }[]>}
 */
export async function scanDir(path, exts = ['.js', '.mjs', '.cjs']) {
  try {
    const stats = await stat(path)

    // If it's a file, return it as a single-item array
    if (stats.isFile()) {
      const name = basename(path)
      const dir = dirname(path)
      const fileExt = extname(name)
      return [
        {
          dir,
          name,
          path,
          label: basename(name, fileExt)
        }
      ]
    }

    // If it's a directory, scan it
    const entries = await readdir(path, { withFileTypes: true })
    return entries
      .filter((file) => {
        if (!file.isFile()) {
          return false
        }
        return exts.includes(extname(file.name))
      })
      .map((file) => ({
        dir: path,
        name: file.name,
        path: join(path, file.name),
        label: basename(file.name, extname(file.name))
      }))
  } catch (error) {
    throw new Error(`Cannot read "${path}": ${error.message}`)
  }
}
