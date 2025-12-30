import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, writeFile, mkdir, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { scanDir } from '../scanDir.mjs'

let tempDir = ''

async function ensureTempDir() {
  tempDir = await mkdtemp(join(tmpdir(), 'scanDir-'))
  return tempDir
}

async function cleanupTempDir() {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true })
    tempDir = ''
  }
}

beforeEach(async () => {
  await ensureTempDir()
})

afterEach(async () => {
  await cleanupTempDir()
})

describe('scanDir', () => {
  it('returns only files with default extension', async () => {
    await writeFile(join(tempDir, 'a.js'), 'console.log("a")')
    await writeFile(join(tempDir, 'b.txt'), 'b')
    await writeFile(join(tempDir, 'c.js'), 'console.log("c")')
    await mkdir(join(tempDir, 'subdir'))
    await writeFile(join(tempDir, 'subdir', 'd.js'), 'console.log("d")')

    const results = await scanDir(tempDir)
    const byName = results.slice().sort((l, r) => l.name.localeCompare(r.name))

    expect(byName).toEqual([
      {
        dir: tempDir,
        name: 'a.js',
        path: join(tempDir, 'a.js'),
        label: 'a'
      },
      {
        dir: tempDir,
        name: 'c.js',
        path: join(tempDir, 'c.js'),
        label: 'c'
      }
    ])
  })

  it('supports custom file extension', async () => {
    await writeFile(join(tempDir, 'a.mjs'), 'console.log("a")')
    await writeFile(join(tempDir, 'b.js'), 'console.log("b")')

    const results = await scanDir(tempDir, '.mjs')

    expect(results).toEqual([
      {
        dir: tempDir,
        name: 'a.mjs',
        path: join(tempDir, 'a.mjs'),
        label: 'a'
      }
    ])
  })

  it('returns empty array for empty directory', async () => {
    const results = await scanDir(tempDir)
    expect(results).toEqual([])
  })

  it('throws a helpful error when path is missing', async () => {
    const missingDir = join(tempDir, 'missing')
    await expect(scanDir(missingDir)).rejects.toThrow(`Cannot read "${missingDir}":`)
  })

  it('returns single file when given a file path', async () => {
    const filePath = join(tempDir, 'test.js')
    await writeFile(filePath, 'console.log("test")')

    const results = await scanDir(filePath)

    expect(results).toEqual([
      {
        dir: tempDir,
        name: 'test.js',
        path: filePath,
        label: 'test'
      }
    ])
  })
})
