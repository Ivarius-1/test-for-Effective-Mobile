import { workerData, parentPort } from 'worker_threads'
import bcrypt from 'bcrypt'

const { type, password, hash } = workerData

if(type === 'hash'){
    bcrypt.hash(password, 10).then(result => parentPort?.postMessage(result))
}

if(type === 'compare'){
    bcrypt.compare(password, hash).then(result => parentPort?.postMessage(result))
}