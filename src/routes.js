import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.setHeader('Content-type', 'application/json').end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description, completed } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed,
        created_at: new Date(),
        completed_at: null,
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      if (id) {
        const task = database.selectById('tasks', id)

        if (task) {
          return res.setHeader('Content-type', 'application/json').end(JSON.stringify(task))
        }
      }
      return res.writeHead(404).end('Not found')
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description, completed } = req.body

      const task = database.selectById('tasks', id)

      if (task) {
        database.update('tasks', id, {
          title,
          description,
          completed,
          updated_at: new Date(),
          completed_at: completed ? new Date() : null,
          created_at: task.created_at
        })

        return res.writeHead(204).end()
      } else {
        return res.writeHead(404).end('Not found')
      }
    }
  }
]
