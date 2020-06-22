import ast from './dist/ast'

(async () => {
    const cmpRes = await ast.compare('./demo.js', './demo2.js', true)
    console.log(cmpRes)
})()