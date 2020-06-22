
import { parse } from '@babel/parser'
import { File, Statement } from '@babel/types'
import utils from './util'

const { readFile, writeFile } = utils;

export interface Options {
    outputTokens: Boolean;
    briefTokens: Boolean;
    outputTokensFile: string;
}

const defaultOptions: Options = {
    outputTokens: false,
    briefTokens: false,
    outputTokensFile: './demo-tokens.json',
}

async function parseCodeToAST(inputModule: string, outputFile?: string, options = defaultOptions) {
    const content = await readFile(inputModule);
    // console.log("parseCodeToAST -> content", content)
    const ast = parse(content, { sourceType: 'module', tokens: true });

    // 输出 tokens
    // const tokens = ast.tokens;
    // console.log("parseCodeToAST -> tokens", tokens)

    // 层级遍历 AST
    // const traverseData = traverseNode(ast);
    // console.log("parseCodeToAST -> traverseData", traverseData)

    // 输出到文件
    if (outputFile !== undefined) {
        const outputContent = JSON.stringify(ast, null, '\t');
        await writeFile(outputFile, outputContent);
    }
    if (options.outputTokens) {
        if (options.briefTokens) {
            const resContent = JSON.stringify(briefTokens(ast.tokens), null, '\t');
            await writeFile(options.outputTokensFile, resContent);
        }
    }
    return ast;
}

const uselessToken = [
    ';',
    '(', ')',
    '{', '}',
    '=', '</>/<=/>=',
    '++/--', '+/-', '*//',
    'eof',
    'export', 'import',
    'default', 'function',
    'let', 'const', 'var',undefined
]
function briefTokens(tokens: any[]): any[] {
    // 筛选出有用token
    tokens = tokens.filter((item) => {
        const label = item.type.label;
        if (uselessToken.includes(label)) {
            return false;
        }
        return true;
    })
    return tokens.map(item => {
        return {
            type: item.type.label,
            value: item.value
        }
    })
}

export interface BriefTokenArray {
    type: string,
    value: string | Number
}
function lcsCompare(tokensArr1: BriefTokenArray[], tokensArr2: BriefTokenArray[], debug: boolean): Boolean {
    // LCS algorithm
    // init
    const len1 = tokensArr1.length;
    const len2 = tokensArr2.length;
    let m = new Array(len1 + 1);
    for (let i = 0; i <= len1; i++) {
        m[i] = new Array(len2 + 1);
    }
    for (let i = 0; i <= len2; i++) {
        m[0][i] = 0;
    }
    for (let i = 0; i <= len1; i++) {
        m[i][0] = 0;
    }
    // dp
    for (let i = 0; i < len1; i++) {
        for (let j = 0; j < len2; j++) {
            if (tokensArr1[i].type === tokensArr2[j].type && tokensArr1[i].value === tokensArr2[j].value) {
                m[i + 1][j + 1] = 1 + m[i][j];
            }
            else m[i + 1][j + 1] = Math.max(m[i][j + 1], m[i + 1][j]);
        }
    }
    // final process
    const lcs = m[len1][len2];
    if (debug) {
        console.log("LCS value", lcs);
        console.log("Length value", len1, len2);
    }
    const flag = (lcs === Math.min(len1, len2));
    return flag;
}

function traverseNode(node: File) {
    let resData = new Array();
    let nodeQ = new Array(); // 队列
    nodeQ.unshift(node.program); // 入队
    while (nodeQ.length !== 0) {
        const curNode = nodeQ.pop(); // 出队
        resData.push(curNode);
        // 根据node类型做相应处理
        if (curNode.body) {
            // 存在body
            if (curNode.body instanceof Array) {
                curNode.body.forEach((item: Statement) => {
                    nodeQ.unshift(item);
                });
            } else {
                nodeQ.unshift(curNode.body)
            }
        }
    }
    return resData;
}

async function compare(inputModule1: string, inputModule2: string, debug = false) {
    const ast1 = await parseCodeToAST(inputModule1);
    const ast2 = await parseCodeToAST(inputModule2);
    const brieftokens1 = briefTokens(ast1.tokens);
    const brieftokens2 = briefTokens(ast2.tokens);
    if (debug) {
        console.log(brieftokens1)
        console.log(brieftokens2)
    }
    return lcsCompare(brieftokens1, brieftokens2, debug);
}

export default { parseCodeToAST, lcsCompare, briefTokens, traverseNode, compare }