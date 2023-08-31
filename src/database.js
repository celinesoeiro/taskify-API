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

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)

      this.#persist()
    }
  }

  selectById(table, id) {
    const item = this.#database[table].find(element => element.id === id)

    if (item) {
      return item
    } else {
      return null
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    const item = this.#database[table][rowIndex]

    console.log({ item })

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        id,
        created_at: item.created_at,
        ...data
      }

      this.#persist()
    }
  }
}
