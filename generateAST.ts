import * as fs from 'fs';
import { parse } from '@babel/parser'

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

async function parseCodeToAST(inputModule: string) {
    const content = await readFile(inputModule);
    console.log("file-content >>>", content);
    const ast = parse(content, { sourceType: 'module' });
    return ast;
}


export default parseCodeToAST