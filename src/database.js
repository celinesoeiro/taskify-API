import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  // Creating private properties and functions
  #database = {}

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  select(table) {
    const data = this.#database[table] ?? []

    return data
  }

  // Creating the insert method - POST
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }
}
