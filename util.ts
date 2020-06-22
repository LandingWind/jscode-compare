import * as fs from 'fs';

function readFile(path: string) {
    return new Promise((resolve: (data: string) => void, reject: (err: NodeJS.ErrnoException) => void) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function writeFile(path: string, content: string) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    })
}

export default {
    readFile,
    writeFile
}