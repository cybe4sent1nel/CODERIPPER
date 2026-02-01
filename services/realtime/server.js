// Simple Yjs websocket server wrapper with Redis presence (for scale)
const http = require('http')
const express = require('express')
const WebSocket = require('ws')
const { setupWSConnection } = require('y-websocket/bin/utils')
const Redis = require('ioredis')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const redis = new Redis(redisUrl)

wss.on('connection', (conn, req) => {
  // use setupWSConnection from y-websocket project
  setupWSConnection(conn, req, { gc: true })
})

app.get('/', (req, res) => res.send('Coderipper realtime server'))

const port = process.env.PORT || 1234
server.listen(port, () => console.log(`Realtime server listening on ${port}`))
