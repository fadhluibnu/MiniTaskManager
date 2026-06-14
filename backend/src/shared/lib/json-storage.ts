import fs from 'fs'
import path from 'path'

/**
 * Generic JSON file storage helper.
 * Abstracts read/write operations so repositories can use it like a database layer.
 * Do NOT use this directly in controllers — use it only inside repositories.
 */

/**
 * Read all records from a JSON data file.
 * Returns an empty array if the file does not exist yet.
 */
function readAll<T>(filePath: string): T[] {
  const absolutePath = path.resolve(filePath)

  if (!fs.existsSync(absolutePath)) {
    return []
  }

  const raw = fs.readFileSync(absolutePath, 'utf-8').trim()

  if (!raw || raw === '') {
    return []
  }

  return JSON.parse(raw) as T[]
}

/**
 * Write all records to a JSON data file.
 * Overwrites the entire file content.
 */
function writeAll<T>(filePath: string, data: T[]): void {
  const absolutePath = path.resolve(filePath)
  fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Find a single record by a key-value pair.
 */
function findOne<T>(
  filePath: string,
  key: keyof T,
  value: T[keyof T]
): T | undefined {
  const records = readAll<T>(filePath)
  return records.find((record) => record[key] === value)
}

/**
 * Find all records matching a key-value pair.
 */
function findMany<T>(filePath: string, key: keyof T, value: T[keyof T]): T[] {
  const records = readAll<T>(filePath)
  return records.filter((record) => record[key] === value)
}

/**
 * Insert a new record into the file.
 */
function insert<T>(filePath: string, record: T): T {
  const records = readAll<T>(filePath)
  records.push(record)
  writeAll(filePath, records)
  return record
}

/**
 * Update an existing record by a key-value pair.
 * Returns the updated record, or undefined if not found.
 */
function update<T>(
  filePath: string,
  key: keyof T,
  value: T[keyof T],
  changes: Partial<T>
): T | undefined {
  const records = readAll<T>(filePath)
  const index = records.findIndex((record) => record[key] === value)

  if (index === -1) {
    return undefined
  }

  records[index] = { ...records[index], ...changes }
  writeAll(filePath, records)
  return records[index]
}

/**
 * Remove a record by a key-value pair.
 * Returns true if deleted, false if not found.
 */
function remove<T>(filePath: string, key: keyof T, value: T[keyof T]): boolean {
  const records = readAll<T>(filePath)
  const filtered = records.filter((record) => record[key] !== value)

  if (filtered.length === records.length) {
    return false
  }

  writeAll(filePath, filtered)
  return true
}

export const jsonStorage = {
  readAll,
  writeAll,
  findOne,
  findMany,
  insert,
  update,
  remove
}
