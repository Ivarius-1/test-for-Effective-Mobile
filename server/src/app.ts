import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import { globalErrorHandler } from './middlewares/errorMiddleware.ts'
import { route } from './routes/index.ts'
import './configs/env.ts'

export const app = express()

const _fileName = fileURLToPath(import.meta.url)
const _dirName = path.dirname(_fileName)
app.use(express.static(path.join(_dirName, '../../client/src')))

app.use(cors({
    credentials: true
}))

app.use(express.json())

app.use(cookieParser(process.env.COOKIE_SECRET))

app.use('/app', route)

app.get('/', (req, res) => {
    res.sendFile(path.join(_dirName, '../../client/src/', 'index.html'))
})

app.use(globalErrorHandler)
