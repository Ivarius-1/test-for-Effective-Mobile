import { Worker, workerData } from 'worker_threads'
import path from 'path'
import { fileURLToPath } from 'url'

const _dirname = path.dirname(fileURLToPath(import.meta.url))

const runWorker = (workerData: object): Promise<any> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.resolve(_dirname, '../workers/bcrypt.worker.ts'),
            {
                workerData,
                execArgv: ['--require', 'ts-node/register']
            }
        )
        worker.on('message', resolve)
        worker.on('error', reject)
    })
}

export const hashPassword = ((password: string) => {
    return runWorker({type:'hash', password})
})

export const comparePassword = ((password: string, hash: string) => {
    return runWorker({type:'compare', password, hash})
})